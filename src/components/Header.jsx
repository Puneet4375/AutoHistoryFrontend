import React, { useEffect, useState } from "react";
import AuthPopUp from "./AuthPopUp";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [loginPopOpen, setloginPopOpen] = useState(false);
  const [user, setuser] = useState();
  const navigate = useNavigate();
  const [isLogged,setLooged] = useState(false);

  // useEffect(() => {
  //   const usr = JSON.parse(localStorage.getItem("user"));
  //   const token = localStorage.getItem("token");

  //   if (usr) setuser(usr);
  //   if(!!token && !!usr) {
  //     setLooged(true);
  //   }

  // }, []);
useEffect(() => {
  const userString = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  let usr = null;
  if (userString) {
    try {
      usr = JSON.parse(userString);
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
    }
  }

  if (usr) setuser(usr);
  if (token && usr) {
    setLooged(true);
  }
}, []);

  return (
    <>
      {loginPopOpen && <AuthPopUp setloginPopOpen={setloginPopOpen} />}

      {/* navbar  */}
      <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
        <a
          href="index.html"
          className="navbar-brand d-flex align-items-center px-4 px-lg-5"
        >
          <h2 className="m-0 text-primary">
            <i className="fa fa-car me-3" />
            Auto History
          </h2>
        </a>
        <button
          type="button"
          className="navbar-toggler me-4"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto p-4 p-lg-0">
          { user?.userType == 3 && <Link to="/mechAI" className="nav-item nav-link">
          <img src="/automation.png" alt="AI" style={{width:'25px',height:'25px'}}></img>
               &nbsp; MechAI
            </Link>}
          { user?.userType == 1 && <Link to="/admin/dashboard" className="nav-item nav-link">
                  Dashboard
            </Link>}
            { user?.userType == 2 && <Link to="/mechanic/dashboard" className="nav-item nav-link">
                  Dashboard
            </Link>}
            {!isLogged && <Link to="/" className="nav-item nav-link">
              Home
            </Link>}
            {user?.userType !== 1 && isLogged && (
              <Link to="/profile" className="nav-item nav-link">
                profile
              </Link>
            )}

            {isLogged && user?.userType==1 && <Link to="/vehicles" className="nav-item nav-link">
              Vehicles
            </Link>}
            { user?.userType == 3 && <Link to="/vehicles" className="nav-item nav-link">
              My Vehicles
            </Link>}
            {user?.userType !== 1 && isLogged && (
              <Link to="/mechanic-list" className="nav-item nav-link">
                Mechanics
              </Link>
            )}
            {user?.userType == 1 && (
              <Link to="/admin/service-list" className="nav-item nav-link">
                Services
              </Link>
            )}
           {isLogged &&  <Link to="/bookings" className="nav-item nav-link">
              Bookings
            </Link>}
            {user?.userType == 1 && (
              <Link to="/admin/mechanic-list" className="nav-item nav-link">
                All Mechanics
              </Link>
            )}
            {user?.userType == 1 && (
              <Link to="/admin/customer-list" className="nav-item nav-link">
                All Customers
              </Link>
            )}
          </div>
          {user ? (
            <a
              style={{ maxWidth: 150, minWidth: 150 }}
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                setuser(null);
                navigate("/");
              }}
              className="btn btn-primary py-4 justify-content-center d-none d-lg-block"
            >
              Logout
              <i className="fa-solid fa-arrow-right-to-bracket ms-3" />
            </a>
          ) : (
            <a
              style={{ maxWidth: 150, minWidth: 150 }}
              onClick={() => setloginPopOpen(true)}
              className="btn btn-primary py-4 px-lg-5 d-none d-lg-block"
            >
              Login
              <i className="fa-solid fa-arrow-right-to-bracket ms-3" />
            </a>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
