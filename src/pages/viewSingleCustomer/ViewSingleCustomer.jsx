import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import { dbUrl } from "../../utils/variables";
import { dateTime } from "../../utils/functions";
import EditBookingModal from "../bookings/EditBookingModal";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ViewSingleCustomer = () => {
  const { id, customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${dbUrl}customer/single`,
          { _id: id },
          { headers: { Authorization: token } }
        );
        setCustomer(res.data?.data);
      } catch (err) {
        console.error("Error fetching customer:", err);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await axios.post(`${dbUrl}booking/all`, {
          customerId: customerId,
        });
        setBookings(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    if (id) {
      fetchCustomer();
      fetchBookings();
    }
  }, [id]);

  return (
    <>
      {selectedBooking && (
        <EditBookingModal
          selectedBooking={selectedBooking}
          setselectedBooking={setSelectedBooking}
        />
      )}

      <Header />
      <div className="container my-5">
        <h3 className="mb-4">Customer Details</h3>

        {customer ? (
          <div className="card shadow-sm border-0 rounded-4 mb-5">
            <div className="card-body">
              <h5 className="card-title mb-4">👤 Customer Profile</h5>
              <div className="row g-4">
                <div className="col-md-6">
                  <p><strong>Name:</strong> {customer.name || "N/A"}</p>
                  <p><strong>Phone No:</strong> {customer.phoneNo || "N/A"}</p>
                  <p><strong>Joined At:</strong> {dateTime(customer.createdAt)}</p>

                </div>
                <div className="col-md-6">
                  {/* <p><strong>Status:</strong> {customer.status ? "Active" : "Inactive"}</p> */}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading customer details...</p>
        )}

        <h4 className="mb-3">Bookings</h4>
        {bookings.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Status</th>
                <th>Appointment Date</th>
                <th>Vehicle</th>
                {/* <th>Mechanic</th> */}
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{booking.bookingStatus}</td>
                  <td>{dateTime(booking.appointmentDate)}</td>
                  <td>{booking.vehicleId?.RTONo}</td>
                  <td>{booking.mechanicId?.ownerName}</td>
                  {/* <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <MdModeEdit />
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bookings found for this customer.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ViewSingleCustomer;
