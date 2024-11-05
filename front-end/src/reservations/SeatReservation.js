import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  listTables,
  readReservation,
  updateTableForSeating,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import SeatReservationForm from "./SeatReservationForm";

function SeatReservation() {
  const params = useParams();
  const reservation_id = params.reservation_id;
  const navigate = useNavigate();
  const location = useLocation();

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [formData, setFormData] = useState({});
  const [reservation, setReservation] = useState(
    location.state?.reservation || null
  );
  const [reservationError, setReservationError] = useState(null);

  //Handlers
  const changeHandler = ({ target }) => {
    setFormData(target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      const tableData = JSON.parse(formData);
      console.log("People", reservation.people);
      await updateTableForSeating(tableData.table_id, reservation_id);
      navigate("/");
    } catch (error) {
      setTablesError(error);
    }
    return () => abortController.abort();
  };

  // load tables
  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  //load reservation
  useEffect(() => {
    if (!reservation) {
      const abortController = new AbortController();
      setReservationError(null);
      readReservation(reservation_id, abortController.signal)
        .then((response) => setReservation(response.data))
        .catch(setReservationError);
      return () => abortController.abort();
    }
  }, [reservation, reservation_id]);

  if (tables && reservation) {
    return (
      <main>
        <h1>Seat Reservation</h1>
        <h3>
          Reservation ID: {reservation_id} Party Size:{" "}
          {reservation.people || "Loading..."}
        </h3>
        <div>
          <ErrorAlert error={tablesError} />
          <ErrorAlert error={reservationError} />
          <SeatReservationForm
            tables={tables}
            submitHandler={submitHandler}
            changeHandler={changeHandler}
          />
        </div>
      </main>
    );
  } else {
    return (
      <div>
        <h3>There are no tables available.</h3>
      </div>
    );
  }
}

export default SeatReservation;
