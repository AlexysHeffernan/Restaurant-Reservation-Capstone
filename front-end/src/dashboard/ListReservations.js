import React from "react";
import { Link } from "react-router-dom"

function ListReservations({ reservations, date, cancelHandler }) {
  const displayReservations = reservations.map((reservation, index) => {
    if (
      reservation.reservation_date === date && 
      reservation.status !== "finished" &&
      reservation.status !== "cancelled"
    ) {
      return (
        <tr key={index} className="res-text table-row">
          <td>{reservation.reservation_id}</td>
          <td>{reservation.first_name}</td>
          <td>{reservation.last_name}</td>
          <td>{reservation.mobile_number}</td>
          <td>{reservation.reservation_date}</td>
          <td>{reservation.reservation_time}</td>
          <td>{reservation.people}</td>
          <td>
            <p data-reservation-id-status={reservation.reservation_id}>
              {reservation.status}
            </p>
          </td>
          <td>
            {reservation.status !== "booked" ? null : (
              <>
                
                <Link to={`/reservations/${reservation.reservation_id}/seat`} state={{ reservation }} className="btn btn-primary mx-1" >
                    Seat
                </Link>
                

                <Link to ={`/reservations/${reservation.reservation_id}/edit`} className="btn btn-secondary mx-1" >
                  Edit
                </Link>
                
                <button
                  data-reservation-id-cancel={reservation.reservation_id}
                  className="btn btn-danger mx-5 mt-2"
                  state={{ reservation }}
                  type="button"
                  onClick={() => cancelHandler(reservation.reservation_id)}
                >
                  Cancel
                </button>
              </>
            )}
          </td>
        </tr>
      );
    } 
    return null;
  });

  return (
    <div>
      <div>
        <table className="table table-striped table-bordered">
          <thead className="thread-dark">
            <tr>
              <th>Reservation ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Mobile Number</th>
              <th>Reservation Date</th>
              <th>Reservation Time</th>
              <th>People</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{displayReservations}</tbody>
        </table>
      </div>
    </div>
  );
}

export default ListReservations;