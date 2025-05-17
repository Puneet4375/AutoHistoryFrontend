import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import { dbUrl } from "../../utils/variables";
import { dateTime } from "../../utils/functions";
import EditBookingModal from "../bookings/EditBookingModal";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";

const ViewSingleMechanic = () => {
  const { id, mechanicId } = useParams();
  const [mechanic, setMechanic] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    const fetchMechanic = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${dbUrl}mechanic/single`,
          { _id: id },
          { headers: { Authorization: token } }
        );
        setLoading(false);
        setMechanic(res.data?.data);
      } catch (err) {
        setLoading(false);
        console.error("Error fetching mechanic:", err);
      }
    };

    const fetchBookings = async () => {
      try {
        setLoading(true)
        const res = await axios.post(`${dbUrl}booking/all`, {
          mechanicId: mechanicId,
        });
        setLoading(false)
        setBookings(res.data?.data || []);
      } catch (err) {
        setLoading(false)
        console.error("Error fetching bookings:", err);
      }
    };

    if (id) {
      fetchMechanic();
      fetchBookings();
    }
  }, [id]);

  return (
    <>
     {loading && <Spinner/>}
      {selectedBooking && (
        <EditBookingModal
          selectedBooking={selectedBooking}
          setselectedBooking={setSelectedBooking}
        />
      )}

      <Header />
      <div className="container my-5 bg-light py-3">
        <h3 className="mb-4">Mechanic Details</h3>

        {mechanic ? (
          <div className="card shadow-md border-0 rounded-4 mb-5">
            <div className="card-body">
              <h5 className="card-title mb-4">🛠 Mechanic Profile</h5>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>Shop Name:</th>
                    <td>{mechanic?.shopName}</td>
                    <th>Contact:</th>
                    <td>{mechanic?.contactNo}</td>
                  </tr>
                <tr>
                    <th>Type:</th>
                    <td>{mechanic?.type=='private'?'Private':'Public'}</td>
                    <th>Owner Name:</th>
                    <td>{mechanic?.ownerName}</td>
                </tr>
                </tbody>
              </table>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                      <th colSpan={2}>Specialization:</th>
                      <td colSpan={2}>{mechanic?.specialization}</td>
                  </tr>
                  <tr>
                      <th colSpan={2}>Address:</th>
                      <td colSpan={2}>{mechanic?.address}</td>
                  </tr>
                </tbody>
              </table>

              <table className="table table-bordered">
                <thead>
                  <tr>
                      <th>Service:</th>
                      <th>Price:</th>
                  </tr>
                </thead>
                <tbody>
                {mechanic?.services.map((row, index) => (
                  <tr key={index}>
                    <td>{row?.serviceId?.title}</td>
                    <td>{row?.price}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p>Loading mechanic details...</p>
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
                <th>Customer</th>
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
                  <td>{booking.customerId?.name}</td>
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
          <p>No bookings found for this mechanic.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ViewSingleMechanic;
