import React from "react";

const Footer = () => {
  return (
    <div
      className="container-fluid bg-dark text-light footer pt-5 wow fadeIn"
      data-wow-delay="0.1s"
    >
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-4 col-md-6">
            <h4 className="text-light mb-4">Address</h4>
            <p className="mb-2">
              <i className="fa fa-map-marker-alt me-3" />
              Sehjal Market
            </p>
            <p className="mb-2">
              <i className="fa fa-phone-alt me-3" />
              +91 62345 67890
            </p>
            <p className="mb-2">
              <i className="fa fa-envelope me-3" />
              info@Auto History.com
            </p>
            
          </div>
          <div className="col-lg-4 col-md-6">
            <h4 className="text-light mb-4">Opening Hours</h4>
            <h6 className="text-light">Monday - Friday:</h6>
            <p className="mb-4">09.00 AM - 09.00 PM</p>
            <h6 className="text-light">Saturday - Sunday:</h6>
            <p className="mb-0">09.00 AM - 12.00 PM</p>
          </div>
          <div className="col-lg-4 col-md-6">
            <h4 className="text-light mb-4">Services</h4>
            <a className="btn btn-link" href>
              Diagnostic Test
            </a>
            <a className="btn btn-link" href>
              Engine Servicing
            </a>
            <a className="btn btn-link" href>
              Tires Replacement
            </a>
            <a className="btn btn-link" href>
              Oil Changing
            </a>
            <a className="btn btn-link" href>
              Vacuam Cleaning
            </a>
          </div>
          
        </div>
      </div>
      <div className="container">
        <div className="copyright">
          <div className="row">
            <div className="col-md-12 text-center text-md-center mb-3 mb-md-0">
              ©{" "}
              <a className="border-bottom" href="#">
               Auto History
              </a>
              , All Right Reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
