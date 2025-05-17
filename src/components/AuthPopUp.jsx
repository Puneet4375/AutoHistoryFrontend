import React, { useState } from "react";
import { dbUrl } from "../utils/variables";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import toast from "react-hot-toast";
import Spinner from "./Spinner";
const AuthPopUp = ({ setloginPopOpen }) => {
  const [page, setpage] = useState("login");
  const [data, setdata] = useState({});
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data?.accountType && page == "register") alert("Select account type");
    let url = dbUrl;
    url += `${data?.accountType || "customer"}/${
      page == "register" ? "register" : "login"
    }`;
    console.log(url);
    try {
      setLoading(true);
      const res = await axios.post(url, data);

      if (url.includes("login")) {
        localStorage.setItem("token", res.data?.token);
        localStorage.setItem("user", JSON.stringify(res.data?.data));
        if(res.data?.success) {
          setLoading(false);
          toast.success(res?.data?.message);
          setloginPopOpen(false);
          window.location.reload()
          if(res?.data?.data?.userType==2) {
            navigate("/mechanic/dashboard");  
            setloginPopOpen(false);
          } else if(res?.data?.data?.userType==1) {
            navigate("/admin/dashboard");
            setloginPopOpen(false);
          } 
          else if(res?.data?.data?.userType==3) {
            setloginPopOpen(false);
            navigate("/");
          } 
          else {
            navigate("/vehicles");
          }
        } else {
          // setLoading(false);
          toast.error(res?.data?.message);
        }
      } else {
        if (res.data?.success) {
          navigate('/');
          setLoading(false);
          setloginPopOpen(false);
          toast.success(res?.data?.message);
        } else {
          navigate('/');
          setLoading(false);
          setloginPopOpen(false);
          toast.error(res?.data?.message);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
    {loading && <Spinner/>}
    <div onClick={() => setloginPopOpen(false)} className=" authPopUp">
      <div onClick={(e) => e.stopPropagation()} className="col-lg-6">
        <div
          className="bg-primary h-100 d-flex flex-column justify-content-center text-center p-5 wow zoomIn"
          data-wow-delay="0.6s"
        >
          <h1 className="text-white mb-4">
            {page == "login" ? "Login" : "Register"}
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {page == "register" && (
                <div className="col-12 ">
                  <input
                    value={data?.name}
                    onChange={(e) => {
                      setdata({ ...data, name: e.target.value });
                    }}
                    type="text"
                    className="form-control border-0"
                    placeholder=" Name"
                    style={{ height: 55 }}
                  />
                </div>
              )}
              <div className="col-12 ">
                <input
                  value={data?.email}
                  onChange={(e) => {
                    setdata({ ...data, email: e.target.value });
                  }}
                  type="email"
                  className="form-control border-0"
                  placeholder=" Email"
                  style={{ height: 55 }}
                />
              </div>
              <div className="col-12 ">
                <input
                  value={data?.password}
                  onChange={(e) => {
                    setdata({ ...data, password: e.target.value });
                  }}
                  type="password"
                  className="form-control border-0"
                  placeholder="Password"
                  style={{ height: 55 }}
                />
              </div>
              {page == "register" && (
                <div className="col-12 ">
                  <input
                    value={data?.confirmPassword}
                    onChange={(e) => {
                      setdata({ ...data, confirmPassword: e.target.value });
                    }}
                    type="password"
                    className="form-control border-0"
                    placeholder="Confirm Password"
                    style={{ height: 55 }}
                  />
                </div>
              )}

              {page == "register" && (
                <div className="col-12 ">
                  <select
                    onChange={(e) =>
                      setdata({ ...data, accountType: e.target.value })
                    }
                    value={data?.accountType}
                    className="form-control border-0"
                    style={{ height: 55 }}
                  >
                    <option hidden value="Select account type">
                      Select account type
                    </option>
                    <option value="customer">Customer</option>
                    <option value="mechanic">Mechanic</option>
                  </select>
                </div>
              )}

              <div className="col-12">
                <button className="btn btn-secondary w-100 py-3" type="submit">
                  {page}
                </button>
              </div>

              {page == "register" ? (
                <p
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setpage("login");
                  }}
                  className="text-white "
                >
                  Already have an account? Login
                </p>
              ) : (
                <p
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setpage("register");
                  }}
                  className="text-white "
                >
                  Not have an account? Register
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default AuthPopUp;
