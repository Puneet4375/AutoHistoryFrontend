import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { dbUrl } from "../../utils/variables";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { IoAddOutline } from "react-icons/io5";
import { IoIosRemove } from "react-icons/io";
import { dateTime } from "../../utils/functions";
import toast from "react-hot-toast";

const BookMechanic = () => {
  const [mechanic, setmechanic] = useState();
  const param = useParams();
  const [selectedServices, setselectedServices] = useState([]);
  const [selectedVehicle, setselectedVehicle] = useState();
  const [customerVehicles, setcustomerVehicles] = useState([]);
  const [appointmentDate, setappointmentDate] = useState();
  const [profile, setprofile] = useState();
  const navigate=useNavigate()

  const [user, setuser] = useState();

  // get profile
  useEffect(() => {
    const getProfile = async () => {
      let url = dbUrl;
      url += user?.userType == 2 ? "mechanic/single" : "customer/single";
      if (user) {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          url,
          { _id: user?._id },
          { headers: { Authorization: token } }
        );
        setprofile(res?.data?.data);
      }
    };

    getProfile();
  }, [user]);

  // set user
  useEffect(() => {
    const usr = JSON.parse(localStorage.getItem("user"));
    if (usr) setuser(usr);
  }, []);

  // get mechanic
  useEffect(() => {
    const getAllMechanics = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        dbUrl + "mechanic/single",
        { _id: param?.id },
        { headers: { Authorization: token } }
      );

      if (res.data?.success) {
        setmechanic(res?.data?.data);
      }
    };

    getAllMechanics();
  }, [param]);

  // get customer vehicle
  useEffect(() => {
    const getCustomerVehicle = async () => {
      const res = await axios.post(dbUrl + "vehicle/all", {
        addedById: user?._id,
      });

      if (res.data?.success) {
        setcustomerVehicles(res?.data?.data);
      }
    };

    if (user) getCustomerVehicle();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedServices?.length ||
      !appointmentDate ||
      !param?.id ||
      !selectedVehicle ||
      !profile?._id
    ) {
      alert("All fild are required");
    }
    console.log(selectedServices);
    const apiData = {
      services: selectedServices?.map(s=>s?.serviceId?._id),
      appointmentDate: appointmentDate,
      mechanicId: param?._id,
      vehicleId: selectedVehicle,
      customerId: profile?._id,
    };

    const token = localStorage.getItem("token");

    const res = await axios.post(dbUrl + "customer/booking/add", apiData, {
      headers: { Authorization: token },
    });

    if (res.data?.success) {
      toast.success(res?.data?.message);
      navigate("/bookings");
    } else {
      toast.error(res?.data?.message);
    }
  };
  return (
    <div>
      <Header />
      <div className="flex my-5 w-100 justify-content-center d-flex align-items-center">
        <div
          style={{ width: "800px" }}
          className="bg-primary h-100 d-flex flex-column justify-content-center text-center p-5 wow zoomIn"
          data-wow-delay="0.6s"
        >
          <h1 className="text-white mb-4">Book Mechanic</h1>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 ">
                <div
                  style={{
                    textAlign: "start",
                    fontWeight: "500",
                    fontSize: 18,
                  }}
                  className="  text-white"
                >
                  Appointment Date Time
                </div>
                <input
                  value={appointmentDate}
                  onChange={(e) => setappointmentDate(e.target.value)}
                  type="datetime-local"
                  className="form-control boFrder-0"
                  placeholder="Name"
                  style={{ height: 55 }}
                />
              </div>
              <div className="col-12 ">
                <div
                  style={{
                    textAlign: "start",
                    fontWeight: "500",
                    fontSize: 18,
                  }}
                  className="  text-white"
                >
                  Select vehicle
                </div>
                <select
                  onChange={(e) =>
                    setselectedVehicle(e.target.value)
                  }
                  value={selectedVehicle}
                  className="form-control border-0"
                  style={{ height: 55 }}
                >
                  <option hidden value="Select vehicle">
                    Select vehicle
                  </option>
                  {customerVehicles?.map((vehicle, i) => (
                    <option key={i} value={vehicle?._id}>
                      {vehicle?.RTONo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12  ">
                <div
                  style={{
                    textAlign: "start",
                    fontWeight: "500",
                    fontSize: 18,
                  }}
                  className=" justify-content-between d-flex align-items-center  text-white"
                >
                  <p>Services</p>
                  <p>
                    ₹{" "}
                    {selectedServices?.reduce(
                      (total, service) => service?.price + total,
                      0
                    )}
                  </p>
                </div>

                <div className="d-flex flex-column gap-2">
                  {mechanic?.services?.map((service, i) => (
                    <div
                      key={i}
                      className="rounded-3 align-items-center  px-2 py-2 bg-white d-flex justify-content-between"
                    >
                      <div className="flex gap-2 align-items-center d-flex">
                        <p>{service?.serviceId?.title}</p>
                        <p>₹{service?.price}</p>
                      </div>
                      {!selectedServices?.includes(service) && (
                        <IoAddOutline
                          onClick={() =>
                            setselectedServices((p) => [...p, service])
                          }
                          style={{ cursor: "pointer" }}
                          size={30}
                          className="bg-success text-white p-1 rounded-3 "
                        />
                      )}
                      {selectedServices?.includes(service) && (
                        <IoIosRemove
                          onClick={() =>
                            setselectedServices((p) =>
                              p.filter((s) => s?._id !== service?._id)
                            )
                          }
                          style={{ cursor: "pointer" }}
                          size={30}
                          className="bg-danger text-white p-1 rounded-3 "
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* overview  */}
                <div className="mt-5 mb-2 ">
                  <div className="rounded-3 d-flex flex-column align-items-start p-2 bg-white">
                    <h3 className="d-flex justify-content-center w-100">
                      Overview
                    </h3>
                    <div className="my-2 w-100">
                      <div
                        style={{ borderBottom: "1px solid #001" }}
                        className="d-flex w-100 p-2 justify-content-between  align-items-center "
                      >
                        <div style={{ fontWeight: "600", color: "black" }}>
                          Shop Name{" "}
                        </div>
                        <div>{mechanic?.shopName}</div>
                      </div>
                      <div
                        style={{ borderBottom: "1px solid #001" }}
                        className="d-flex w-100 mt-2 p-2 justify-content-between  align-items-center "
                      >
                        <div style={{ fontWeight: "600", color: "black" }}>
                          Vehicle{" "}
                        </div>
                        <div>{customerVehicles?.find(v=>v?._id==selectedVehicle)?.RTONo}</div>
                      </div>

                      <div
                        style={{ borderBottom: "1px solid #001" }}
                        className="d-flex w-100 mt-2 p-2 justify-content-between  align-items-center "
                      >
                        <div style={{ fontWeight: "600", color: "black" }}>
                          Type{" "}
                        </div>
                        <div>{mechanic?.type}</div>
                      </div>
                      <div
                        style={{ borderBottom: "1px solid #001" }}
                        className="d-flex w-100 mt-2 p-2 justify-content-between  align-items-center "
                      >
                        <div style={{ fontWeight: "600", color: "black" }}>
                          Appointment Date
                        </div>
                        <div>
                         {dateTime(appointmentDate)}
                        </div>
                      </div>
                      <div
                        style={{ borderBottom: "1px solid #001" }}
                        className="d-flex w-100 mt-2 p-2 justify-content-between  align-items-center "
                      >
                        <div style={{ fontWeight: "600", color: "black" }}>
                          Total Without (GST){" "}
                        </div>
                        <div>
                          {selectedServices?.reduce(
                            (total, service) => total + service?.price,
                            0
                          )}
                        </div>
                      </div>
                      <div
                        style={{ borderBottom: "1px solid #001" }}
                        className="d-flex w-100 mt-2 p-2 justify-content-between  align-items-center "
                      >
                        <div style={{ fontWeight: "600", color: "black" }}>
                          Total With (GST){" "}
                        </div>
                        <div>
                          {selectedServices?.reduce((total, service) => {
                            return (
                              total + (service?.price + service?.price * 0.18)
                            );
                          }, 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <button className="btn btn-secondary w-100 py-3" type="submit">
                  Book
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookMechanic;
