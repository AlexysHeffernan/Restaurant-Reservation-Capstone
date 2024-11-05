import React from "react";

import { Routes, Route } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservation from "../reservations/NewReservation";
import NewTable from "../tables/NewTable";
import SeatReservation from "../reservations/SeatReservation";
import Search from "../search/Search";
import EditReservation from "../reservations/EditReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function RootRoutes() {
 
  return (
    
      <Routes>
      <Route path="/" element={<Dashboard date={today()}/>} />
      
      <Route exact path="/reservations/new" element={<NewReservation />} />
     
      <Route path="/reservations" element={<Dashboard date={today()}/>} />
     
      <Route path="/reservations/:reservation_id/seat" element={<SeatReservation />} />
    
      <Route path="/reservations/:reservation_id/edit" element={<EditReservation />} />
     
      <Route path="/dashboard" element={<Dashboard date={today()} />} />
     
      <Route path="/tables/new" element={<NewTable />} />
      
      <Route path="/search" element={<Search />} />
     
      <Route path="*" element={<NotFound />} />

      </Routes>
   
  );
}

export default RootRoutes;