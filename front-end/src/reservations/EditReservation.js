import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

function EditReservation() {
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
    status: "",
  };

  const params = useParams();
  const reservation_id = params.reservation_id;
  const navigate = useNavigate();
  const location = useLocation();

  const [reservationError, setReservationError] = useState(null);
  const [formData, setFormData] = useState({ ...initialFormState });
  const [errorAlert, setErrorAlert] = useState(null);

  //load reservation
  useEffect(loadReservation, [reservation_id]);

  function loadReservation() {
    const abortController = new AbortController();
    setReservationError(null);
    readReservation(reservation_id, abortController.signal)
      .then((data) =>
        setFormData({
          first_name: data.first_name,
          last_name: data.last_name,
          mobile_number: data.mobile_number,
          reservation_date: data.reservation_date,
          reservation_time: data.reservation_time,
          people: data.people,
          status: data.status,
        })
      )

      .catch(setReservationError);
    return () => abortController.abort();
  }

  //handlers

  const changeHandler = ({ target }) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [target.name]: target.value,
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setErrorAlert(null);
    const abortController = new AbortController();
    try {
      const response = await updateReservation(
        reservation_id,
        formData,
        abortController.signal
      );
      navigate(
        `/dashboard/?date=${response.reservation_date}`
      );
    } catch (error) {
      setErrorAlert(error);
    }
  };

  return (
    <main>
      <div>
        <h1>Edit Reservation</h1>
      </div>
      <div>
        <ErrorAlert error={errorAlert} /> 
        <ErrorAlert error={reservationError} />
      </div>
      <div>
        <ReservationForm
          formData={formData}
          changeHandler={changeHandler}
          submitHandler={submitHandler}
        />
      </div>
    </main>
  );
}

export default EditReservation;