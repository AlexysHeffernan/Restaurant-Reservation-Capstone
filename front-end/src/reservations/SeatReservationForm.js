import React from "react";
import { useNavigate } from "react-router-dom";

function SeatReservationForm({ tables, submitHandler, changeHandler }) {
  const navigate = useNavigate();

  return (
    <div>
      <form>
        <label>Select Table: </label>
        <select name="table_id" onChange={changeHandler}>
          <option value="">Table Name - Capacity </option>
          {tables.map((table) => (
            <option
              key={table.table_id}
              value={JSON.stringify(table)}
              required={true}
            >
              {table.table_name} - {table.capacity}
            </option>
          ))}
        </select>
        <div>
        <button
            className="btn btn-danger mr-2"
            type="button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            type="submit"
            onClick={(event) => submitHandler(event)}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default SeatReservationForm;