import React from "react";
import { dateTime } from "../../utils/functions";

const ViewServiceModal = ({ service, onClose }) => {
  if (!service) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header bg-primary">
            <h4 className="modal-title text-white">Service Details</h4>
            <button
              type="button"
              className="btn-close text-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <strong>Title:</strong> <div>{service.title}</div>
              </div>
              <div className="col-md-6">
                <strong>Type:</strong> <div>{service.type}</div>
              </div>
              <div className="col-md-12">
                <strong>Description:</strong>
                <div>{service.description}</div>
              </div>
              <div className="col-md-6">
                <strong>Price:</strong> <div>₹{service.price}</div>
              </div>
              <div className="col-md-6">
                <strong>Duration (in minutes):</strong> <div>{service.duration}</div>
              </div>
              <div className="col-md-6">
                <strong>Created At:</strong>
                <div>{dateTime(service.createdAt)}</div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewServiceModal;
