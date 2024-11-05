import React, { useState } from "react";
import TableForm from "./TableForm";
import { createTable } from "../utils/api";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function NewTable() {
  const navigate = useNavigate();

  const initialFormState = {
    table_name: "",
    capacity: "1",
  };
  const [formData, setFormData] = useState({ ...initialFormState });
  const [errorAlert, setErrorAlert] = useState(false);

  //Handlers
  const changeHandlerName = ({ target }) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [target.name]: target.value,
    }));
  };

  const changeHandlerCapacity = ({ target }) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [target.name]: Number(target.value),
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      await createTable(formData, abortController.signal);
      navigate(`/dashboard`);
    } catch (error) {
      setErrorAlert(error);
    }
  };
  return (
    <div>
      <div>
        <h1>New Table</h1>
      </div>
      <div>
        <ErrorAlert error={errorAlert} />
        <TableForm
          formData={formData}
          changeHandlerName={changeHandlerName}
          changeHandlerCapacity={changeHandlerCapacity}
          submitHandler={submitHandler}
        />
      </div>
    </div>
  );
}

export default NewTable;
