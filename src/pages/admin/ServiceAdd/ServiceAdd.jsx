import React, { useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { dbUrl } from "../../../utils/variables";
import axios from "axios";
import { FaEye } from "react-icons/fa";

import { MdModeEdit } from "react-icons/md";

const ServiceAdd = () => {
  const navigate = useNavigate();

  const [data, setdata] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const res = await axios.post(dbUrl + "admin/service/add", data, {
      headers: { Authorization: token },
    });

    if (res.data?.success) {
      navigate("/admin/service-list");
    }
  };
  return (
    <>
      <Header />
      <div className="flex w-100 justify-content-center d-flex align-items-center">
        <div
          style={{ width: "800px" }}
          className="bg-primary my-5 h-100 d-flex flex-column justify-content-center text-center p-5 wow zoomIn"
          data-wow-delay="0.6s"
        >
          <h1 className="text-white mb-4">Create Service</h1>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-6 ">
                <div
                  style={{
                    textAlign: "start",
                    fontWeight: "500",
                    fontSize: 18,
                  }}
                  className="  text-white"
                >
                  Title
                </div>
                <input
                  value={data?.title}
                  onChange={(e) => {
                    setdata((p) => ({ ...p, title: e.target.value }));
                  }}
                  type="text"
                  className="form-control border-0"
                  placeholder="Enter Title"
                  style={{ height: 55 }}
                />
              </div>
              <div className="col-6 ">
                <div
                  style={{
                    textAlign: "start",
                    fontWeight: "500",
                    fontSize: 18,
                  }}
                  className="  text-white"
                >
                  Price
                </div>
                <input
                  value={data?.price}
                  onChange={(e) => {
                    setdata((p) => ({ ...p, price: e.target.value }));
                  }}
                  type="number"
                  className="form-control border-0"
                  placeholder="Enter Price"
                  style={{ height: 55 }}
                />
              </div>
              <div className="col-6 ">
                <div
                  style={{
                    textAlign: "start",
                    fontWeight: "500",
                    fontSize: 18,
                  }}
                  className="  text-white"
                >
                  Duration
                </div>
                <input
                  value={data?.duration}
                  onChange={(e) => {
                    setdata((p) => ({ ...p, duration: e.target.value }));
                  }}
                  type="number"
                  className="form-control border-0"
                  placeholder="Enter Duration (minutes)"
                  style={{ height: 55 }}
                />
              </div>
              <div className="col-6 ">
                <div
                  style={{
                    textAlign: "start",
                    fontWeight: "500",
                    fontSize: 18,
                  }}
                  className="  text-white"
                >
                  Select Type
                </div>
                <select
                  className="form-control border-0"
                  style={{ height: 55 }}
                  value={data?.type}
                  onChange={(e) => {
                    setdata((p) => ({ ...p, type: e.target.value }));
                  }}
                >
                  <option hidden value="Select type">
                    Select type
                  </option>
                  <option value="commercial">commercial</option>
                  <option value="private">private</option>
                </select>
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
                  Description
                </div>
                <textarea
                  value={data?.description}
                  onChange={(e) => {
                    setdata((p) => ({ ...p, description: e.target.value }));
                  }}
                  rows={5}
                  className="form-control border-0"
                  placeholder="Enter Description"
                ></textarea>
              </div>

              <div className="col-12">
                <button className="btn btn-secondary w-100 py-3" type="submit">
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ServiceAdd;
