import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddCar from "./pages/addCar/AddCar";
import Profile from "./pages/profile/Profile";
import ServiceUpdate from "./pages/admin/ServiceUpdate/ServiceUpdate";
import ServiceList from "./pages/admin/ServiceList/ServiceList";
import ServiceAdd from "./pages/admin/ServiceAdd/ServiceAdd";
import MechanicList from "./pages/mechanic-list/MechanicList";
import BookMechanic from "./pages/BookMechanic/BookMechanic";
import Bookings from "./pages/Bookings/Bookings";
import ViewVehicle from "./pages/ViewVehicle/ViewVehicle";
import UpdateVehicle from "./pages/UpdateVehicle/UpdateVehicle";

import { Toaster } from "react-hot-toast";
import AdminMechanicList from "./pages/AdminMechanicList/AdminMechanicList";
import ViewSingleMechanic from "./pages/ViewSingleMechanic/ViewSingleMechanic";
import AdminCustomerList from "./pages/AdminCustomerList/AdminCustomerList";
import ViewSingleCustomer from "./pages/ViewSingleCustomer/ViewSingleCustomer";
import ViewSingleBooking from "./pages/ViewSingleBooking/ViewSingleBooking";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import MechAI from "./pages/mechAI/MechAI";
const App = () => {
  return (
    <>
      <Toaster position="top-right"/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/car" element={<AddCar />}></Route>
          <Route path="/profile" element={<Profile />}></Route>

          {/* services for admin */}
          <Route path="/admin/service-list" element={<ServiceList />}></Route>
          <Route path="/admin/service-add" element={<ServiceAdd />}></Route>
          <Route
            path="/admin/service-update/:id"
            element={<ServiceUpdate />}
          ></Route>

          {/* mechanics  */}
          <Route path="/mechanic-list" element={<MechanicList />}></Route>
          <Route path="/mechanic-book/:id/:_id" element={<BookMechanic />}></Route>

          {/* booking  */}
          <Route path="/bookings" element={<Bookings />}></Route>

          <Route path="/vehicles" element={<ViewVehicle />}></Route>
          <Route path="/update-vehicle/:id" element={<UpdateVehicle />}></Route>

          <Route
            path="/admin/mechanic-list"
            element={<AdminMechanicList />}
          ></Route>
          <Route
            path="/mechanic-details/:id/:mechanicId"
            element={<ViewSingleMechanic />}
          ></Route>

          <Route
            path="/admin/customer-list"
            element={<AdminCustomerList />}
          ></Route>
          <Route
            path="/customer-details/:id/:customerId"
            element={<ViewSingleCustomer />}
          ></Route>
          <Route
            path="/booking-details/:id"
            element={<ViewSingleBooking />}
          ></Route>

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          ></Route>

          <Route
            path="/mechanic/dashboard"
            element={<AdminDashboard />}
          ></Route>

          <Route
            path="/mechAI"
            element={<MechAI />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
