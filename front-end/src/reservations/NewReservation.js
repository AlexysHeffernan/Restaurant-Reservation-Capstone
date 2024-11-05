import React, { useState } from "react";
import ReservationForm from "./ReservationForm";
import { createReservation } from "../utils/api";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function NewReservation() {
  const navigate = useNavigate();
 

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "1",
    status: "booked",
  };
  const [formData, setFormData] = useState({ ...initialFormState });
  const [errorAlert, setErrorAlert] = useState(false);

  //Handlers
  const changeHandler = ({ target }) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [target.name]: target.value,
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      await createReservation(formData, abortController.signal)
      navigate(`/dashboard`);

    } catch (error) {
      setErrorAlert(error);
    }
    return () => abortController.abort();
  };
  return (
    <div>
      <div>
        <h1>New Reservation</h1>
      </div>
      <div>
       
        <ReservationForm
          formData={formData}
          changeHandler={changeHandler}
          submitHandler={submitHandler}
        />
         <ErrorAlert error={errorAlert} />
      </div>
    </div>
  );
}

export default NewReservation;