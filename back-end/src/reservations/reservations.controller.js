/**
 * List handler for reservation resources
 */

const service = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Validation:
const VALID_PROPERTIES = [
  "reservation_id",
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "created_at",
  "updated_at",
];

function hasOnlyValidProperties(req, res, next) {
  const {data = {}} = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
  if (invalidFields.length)
    return next({
  status: 400,
message: `invalid fields: ${invalidFields.join(", ")}`});
next();
}

function hasProperties(...properties) {
  return function (req, res, next) {
    const {data = {}} = res.body;
    try {
      properties.forEach((property) => {
        if (!data[property]) {
          const error = new Error(`A "${property}" property is required.`);
          error.status = 400;
          throw error;
        }
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

function dateIsValid(req, res, next){
  const {reservation_date} = req.body.data;
  const isValidDate = Date.parse(reservation_date);
  if (!Number.isNaN(isValidDate)){
    res.locals.reservation_date = reservation_date;
    return next();
  }
  next({
    status: 400,
    message: `reservation_date is not a valid date.`,
  });
}

function phoneIsValid(req, res, next){
  const {mobile_number} = req.body.data;
  const isValidPhoneNumber = mobile_number.match(/^[1-9]\d{2}-\{3}-\d{4}$/)
  if (isValidPhoneNumber){
    return next()
  } else {
    next({
      status: 400, message: "Please enter a valid mobile number xxx-xxx-xxxx"
    })
  }
}

function phoneIsNumber(req,res, next){
  const {mobile_number} = req.body.data;
  const array = []
  mobile_number.split("").forEach(character => {
    if (Number(character)) {
      array.push(character)
    }
  })
  const testString = array.join('');
  const isNumber = Number(testString);
  if (isNumber) {
    return next();
  } else {
    next({ status: 400, message: "Please enter a valid mobile number xxx-xxx-xxxx"})
  }
}

function timeIsValid(req, res, next){
  const {reservation_time} = req.body.data;
  const isValidTime = reservation_time.match(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
  if (isValidTime) {
    res.locals.reservation_time = reservation_time;
    return next();
  } else {
    next({status: 400, message: "resrevation_time is not a valid time."});
  }
}

function peopleIsNumber(req, res, next) {
  let {people} = req.body.data;
  if (typeof people !== "number" || people < 0) {
    next({status:400, message: "people must be a number and greater than zero."});
  } else {
    res.locals.people = people;
    return next();
  }
}

function notInPast(req, res, next) {
  const {reservation_date, reservation_time} = res.locals;
  let now = Date.now();
  let bookedTime = Date.parse(`${reservation_date} ${reservation_time} EST`);
  if (bookedTime > now) {
    return next({ status: 400, message: "Reservations must be made in the future"});
  }
}

function notOnTuesday(req, res, next) {
  const {reservation_date, reservation_time} = res.locals;
  let day = new Date(`${reservation_date} ${reservation_time}`);
  if (day.getDay() !==2) {
    next();
  } else {
    return next({ status: 400, message: "Restaurant is closed on Tuesdays. Please select another day."});
  }
}

function resDuringOpenHours(req, res, next) {
  const {reservation_time} = res.locals;
  if (reservation_time < "10:30:00" || reservation_time > "21:30:00") {
    return next({status: 400, message: "Reservations can only be made between 10:30 AM and 9:30 PM."});
  } else {
    return next();
  }
}

async function reservationExists(req, res, next){
  const {reservationId} = req.params;
  const reservation = await service.read(reservationId);
  if (reservation){
    res.locals.resrvation = reservation;
    return next();
  }
  next({status:404, message: `Reservation id ${reservationId} cannot be found.`});
}
function notBooked(req, res, next) {
  const {status} = req.body.data;
  if (status){
    if (status !=="booked"){
      return next({status:400, message: `Cannot seat a reservation with a status of ${status}`});
    } else if (status==="booked"){
      return next();
    }
  }
  next();
}

function notFinished(req, res, next) {
  const {status} = res.locals.reservation;
  if (status !=="finished") {
    return next();
  }
  next({status: 400, message: `Status cannot be updated if it is finished.`});
}

function validStatus(req, res, next){
  const {status} = req.body.data;
  if (status==="booked" || status==="seated" || status==="finished" || status==="cancelled"){
    return next();
  } 
  next({status: 400, message: `${status} is not a valid status.`});
}

//CRUDL

async function list(req, res) {
  const {date, mobile_number} = req.query;
  let data;
  if (date) {
    data = await service.listByDate(date);
  } else if (mobile_number) {
    data = await service.search(mobile_number);
  } else {
    data = await service.list();
  }
  res.status(200).json({ data });
}

async function create(req, res, next){
  const newReservation = {...req.body.data};
  const data = await service.create(newReservation);
  res.status(201).json({data});
}

async function read(req, res){
  const { reservation: data } = res.locals;
  res.json({ data});
}

async function update(req, res) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await service.update(updatedReservation);
  res.status(200).json({data});
}

async function updateStatus(req, res) {
  const {reservation_id} = res.locals.reservation;
  const {status} = req.body.data;
  const data = await service.updateStatus(reservation_id, status);
  res.json({ data});
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    dateIsValid,
    timeIsValid,
    phoneIsValid,
    phoneIsNumber,
    peopleIsNumber,
    notInPast,
    notOnTuesday,
    resDuringOpenHours,
    notBooked,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reservationExists),
    hasOnlyValidProperties,
    hasRequiredProperties,
    dateIsValid,
    timeIsValid,
    phoneIsNumber,
    phoneIsValid,
    peopleIsNumber,
    notInPast,
    notOnTuesday,
    resDuringOpenHours,
    notBooked,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    notFinished,
    validStatus,
    asyncErrorBoundary(updateStatus),
  ]
};
