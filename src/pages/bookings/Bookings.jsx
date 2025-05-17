import React, { useEffect, useState } from "react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { dbUrl } from "../../utils/variables";
import axios from "axios";
import { Link } from "react-router-dom";
import { Md18UpRating, MdFeedback, MdModeEdit, MdPayment } from "react-icons/md";
import { dateTime } from "../../utils/functions";
import EditBookingModal from "./EditBookingModal";
import { FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import Feedback from "./feedback";

const Bookings = () => {
  const [allBookings, setallBookings] = useState([]);
  const [selectedBooking, setselectedBooking] = useState();
  const [profile, setprofile] = useState();
  const [user, setuser] = useState();
  const [feedback,setFeedback] = useState(false);

  useEffect(() => {
    const usr = JSON.parse(localStorage.getItem("user"));
    setuser(usr);
  }, []);

  // get profile
  // useEffect(() => {
  //   getProfile();
  // }, [user]);
  useEffect(() => {
  if (user?._id) {
    getProfile();
  }
}, [user]);
const getProfile = async () => {
  if (!user) return;

  let url = dbUrl + (user.userType === 2 ? "mechanic/single" : "customer/single");
  const token = localStorage.getItem("token");

  try {
    const res = await axios.post(
      url,
      { _id: user._id },
      { headers: { Authorization: token } }
    );
    const profileData = res?.data?.data;
    setprofile(profileData);

    // Immediately fetch bookings after profile is set
    getAllServices(profileData);
  } catch (error) {
    toast.error("Failed to load profile");
  }
};

const getAllServices = async (profileData) => {

  let body = {};
  if (user.userType === 2) {
    body.mechanicId = profileData._id;
  } else if (user.userType === 3) {
    body.customerId = profileData._id;
  }

  try {
    const res = await axios.post(dbUrl + "booking/all", body);
    setallBookings(res.data?.data || []);
  } catch (error) {
    toast.error("Failed to load bookings");
  }
};

  // const getProfile = async () => {
  //   let url = dbUrl;
  //   url += user?.userType == 2 ? "mechanic/single" : "customer/single";
  //   if (user) {
  //     const token = localStorage.getItem("token");
  //     const res = await axios.post(
  //       url,
  //       { _id: user?._id },
  //       { headers: { Authorization: token } }
  //     );
  //     setprofile(res?.data?.data);
  //   }
  // };

  // // get all booking
  // useEffect(() => {
  //   if (!user) return;
  //   const getAllServices = async () => {
  //     let body = {};

  //     console.log(profile);

  //     if (user?.userType == 2) {
  //       body.mechanicId = profile?._id;
  //     } else if (user?.userType == 3) {
  //       body.customerId = profile?._id;
  //     }

  //     const res = await axios.post(dbUrl + "booking/all", body);

  //     setallBookings(res.data?.data);
  //   };

  //   getAllServices();
  // }, [user, profile]);

  
  const paymentHandler = (_id) => {
    const data = { _id };
    const token = localStorage.getItem("token");
    axios.post(dbUrl + "customer/request/pay", data,  { headers: { Authorization: token } }).then((res) => {
        if (res.data.success) {
          const order = res.data.order;
          const options = {
            key: "rzp_test_81m41n13O8OvjC",
            amount: order.amount,
            currency: "INR",
            name: "Acme Corp",
            description: "Test Transaction",
            image: "https://example.com/your_logo",
            order_id: order.id,

            handler: function (response) {
              console.log("✅ Payment Success:", response);
            },
            prefill: {
              name: "Mohit Kumar",
              email: "mohit@gmail.com",
              contact: "1234567890"
            },
            theme: {
              color: "#3399cc"
            }
          };
          const rzp1 = new window.Razorpay(options);
          rzp1.on("payment.failed", function (response) {
            toast.error(response);
          });

          rzp1.open();

        } 
      })
      .catch((err) => {
        toast.error(err);
      });
  };



  async function updateStatus(_id,status){
    if (user) {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        dbUrl+"mechanic/booking/update-status",
        { _id: _id,bookingStatus:status },
        { headers: { Authorization: token } }
      );

      if (res.data?.success) {
          toast.success(res?.data?.message);
          getProfile();
      } else {
              toast.error(res.data?.message);
      }
    }
  }
  return (
    <>
      {selectedBooking && !feedback &&  (
        <EditBookingModal
          selectedBooking={selectedBooking}
          setselectedBooking={setselectedBooking}
        />
      )}
      {feedback && (
        <Feedback
          userType={user?.userType}
          selectedBooking = {selectedBooking}
          setselectedBooking={setselectedBooking}
          setFeeback = {setFeedback}
        />
      )}
      <Header />
      <div className="d-flex my-5 justify-content-center">
        <div style={{ width: 1000 }}>
          <div className="d-flex justify-content-between">
            <h3 className="display-7 ">Bookings</h3>
            {user?.userType==3&& <Link
              className="btn btn-primary btn-sm d-flex justify-content-center align-items-center"
              to={"/mechanic-list"}
            >
              Add Booking
            </Link>}
          </div>
          <table class="table mt-3 table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Booking Status</th>
                <th scope="col">Appointment Date</th>
                <th scope="col">Mechanic</th>
                <th scope="col">Vehicle</th>
                {user?.userType==2 && <th scope="col">Status</th>}
                <th scope="col">Customer</th>
                <th scope="col">Payment</th>
                <th scope="col">Trans. Id</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allBookings?.map((booking, i) => (
                <tr key={i}>
                  <th scope="row">{i + 1}</th>
                  <td>{booking?.bookingStatus}</td>
                  <td>{dateTime(booking?.appointmentDate)}</td>
                  <td>{booking?.mechanicId?.shopName}</td>
                  <td>{booking?.vehicleId?.RTONo}</td>
                  {user?.userType==2 && <td>{booking?.bookingStatus=='pending'?<><button class='btn btn-sm btn-success' onClick={()=>{ updateStatus(booking._id,'approved')}}>Approved</button></>:<></>}
                      {booking?.bookingStatus=='pending'?<><button class='btn btn-sm btn-danger mx-2' onClick={()=>{ updateStatus(booking._id,'rejected')}}>Rejected</button></>:<></>}
                      {booking?.bookingStatus=='processing'?<><button class='btn btn-sm btn-warning' onClick={()=>{ updateStatus(booking._id,'completed')}}>Completed</button></>:<></>}
                      {booking?.bookingStatus=='approved'?<><button class='btn btn-sm btn-primary' onClick={()=>{ updateStatus(booking._id,'processing')}}>Processing</button></>:<></>}
                      {booking?.bookingStatus=='rejected'?<>-</>:<></>}
                      {booking?.bookingStatus=='completed'?<>-</>:<></>}
                     
                  </td>}
                  <td>{booking?.customerId?.userId?.name}</td>
                  <td>{booking?.paymentDone?'Done':'Pending'}</td>
                  <td>{booking?.transactionDetail??'-'}</td>
                  {/* ["pending", "approved", "processing", "rejected","completed"] */}


                  <td className="d-flex  gap-2">
                    <Link
                      to={`/booking-details/${booking?._id}`}
                      className={"btn btn-success  btn-sm"}
                    >
                    <FaEye />
                    </Link>
                    {/* <div
                      onClick={() => setselectedBooking(booking)}
                      className={"btn btn-info  btn-sm"}
                    >
                      <MdModeEdit />
                    </div> */}
                   {booking?.bookingStatus=='completed' && booking?.paymentDone && <div
                      onClick={() => {setselectedBooking(booking),setFeedback(true)}}
                      className={"btn btn-info  btn-sm"}
                    >
                      <MdFeedback />
                    </div>}
                    {user?.userType==3 && booking?.bookingStatus=='completed' &&  !booking?.paymentDone && <div
                      onClick={() => paymentHandler(booking._id)}
                      className={"btn btn-primary  btn-sm"}
                    >
                      <MdPayment></MdPayment>
                    </div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Bookings;
