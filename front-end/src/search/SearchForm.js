import React from "react";
import { useNavigate } from "react-router-dom";

function SearchForm({ changeHandler, formData, submitHandler }) {
  const navigate = useNavigate();

  return (
    <>
      <form>
        <label htmlFor="mobile_number">Mobile Number</label>
        <div>
          <input
            className="form-control"
            type="text"
            name="mobile_number"
            id="mobile_number"
            placeholder="Enter a customer's mobile number"
            onChange={changeHandler}
            required="required"
            value={formData.mobile_number}
          />
        </div>
        <br />
        <div>
          <button
            className="btn btn-danger mr-2 mb-3"
            type="button"
            onClick={() => navigate(`/`)}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary mb-3"
            type="submit"
            onClick={(event) => submitHandler(event)}
          >
            Find
          </button>
        </div>
      </form>
    </>
  );
}

export default SearchForm;
