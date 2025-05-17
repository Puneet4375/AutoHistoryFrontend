import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { dbUrl } from "../../utils/variables";
import { dateTime } from "../../utils/functions";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ReactMarkdowm from "react-markdown";
import Spinner from "../../components/Spinner";

const ViewSingleBooking = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responseTitle,setTitle] = useState('')
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${dbUrl}booking/single`,
          { _id: id },
          { headers: { Authorization: token } }
        );
        setBooking(res.data?.data);
      } catch (err) {
        console.error("Error fetching booking:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBooking();
    }
  }, [id]);


 

  const API_KEY = "AIzaSyAQFOglYQlotRhZ7-HB1V883HPI_yy8BDs"; 

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const result = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
          API_KEY,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      setResponse(result.data.candidates[0].content.parts[0].text);
      setTitle(prompt);
      setPrompt('');
    } catch (err) {
      console.error(err);
      setResponse("Error generating response");
    }
  };

  return (
    <>
    {loading && <Spinner/>}
      <Header />
      <div className="container my-5">
        <h3 className="mb-4">Booking Details</h3>

        {loading ? (
          <p>Loading booking information...</p>
        ) : booking ? (
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <div className="row g-4">
                <div className="col-md-6">
                  <strong>Status:</strong>
                  <div>{booking.bookingStatus}</div>
                </div>
                <div className="col-md-6">
                  <strong>Appointment Date:</strong>
                  <div>{dateTime(booking.appointmentDate)}</div>
                </div>

                <div className="col-md-6">
                  <strong>Total With GST:</strong>
                  <div>₹{booking.totalWithGST}</div>
                </div>

                <div className="col-md-6">
                  <strong>Created At:</strong>
                  <div>{dateTime(booking.createdAt)}</div>
                </div>

                <div className="col-md-6">
                  <strong>Customer:</strong>
                  <div>{booking.customerId?.name || "N/A"}</div>
                </div>

                <div className="col-md-6">
                  <strong>Vehicle RTO No:</strong>
                  <div>{booking.vehicleId?.RTONo || "N/A"}</div>
                </div>

                <div className="col-md-6">
                  <strong>Mechanic Shop:</strong>
                  <div>{booking.mechanicId?.shopName || "N/A"}</div>
                </div>
                <div className="col-md-12">
                  <strong>Mechanic Feedback & Servie Brief</strong>
                  <div>{booking?.mechanicFeedback || "N/A"}</div>
                </div>

                <div className="col-md-12">
                  <strong>Customer Feedback</strong>
                  <div>{booking?.customerFeedback || "N/A"}</div>
                </div>


                <div className="col-md-12">
                  <strong>Services:</strong>
                  <ul className="list-group">
                    {booking.allServices?.length > 0 ? (
                      booking.allServices.map((service, i) => (
                        <li
                          key={service._id || i}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <span>{service.title}</span>
                          {/* <span className="badge bg-secondary">
                            ₹{service.price}
                          </span> */}
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item">No services listed</li>
                    )}
                  </ul>
                </div>
                <div>
                  <div style={{ padding: 20 }}>
                    <h2>Mech AI</h2>
                    <textarea
                      rows="4"
                      className="form-control"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ask something..."
                    />
                    <br />
                    <div className="d-flex justify-content-center">
                      <button onClick={handleGenerate} className="btn btn-sm btn-primary">
                        Generate
                      </button>
                    </div>
                    <div className="card mt-3">
                      <div className="card-body">
                        <h3 className="font-underline">{responseTitle}</h3>
                        <h5 className="card-title">Response: </h5>
                        <ReactMarkdowm>{response}</ReactMarkdowm>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>No booking found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ViewSingleBooking;
