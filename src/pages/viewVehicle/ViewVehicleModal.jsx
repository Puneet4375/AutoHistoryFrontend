import React from "react";
import { dateTime } from "../../utils/functions";

const ViewVehicleModal = ({ vehicle, onClose }) => {
  if (!vehicle) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header bg-primary">
            <h4 className="modal-title  text-white">Vehicle Details</h4>
            <button
              type="button"
              className="btn-close text-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <strong>Owner Name:</strong> <div>{vehicle.ownerName}</div>
              </div>
              <div className="col-md-6">
                <strong>RTO Number:</strong> <div>{vehicle.RTONo}</div>
              </div>
              <div className="col-md-6">
                <strong>Manufacturing Name:</strong>{" "}
                <div>{vehicle.manufacturingName || "N/A"}</div>
              </div>
              <div className="col-md-6">
                <strong>Model Name:</strong> <div>{vehicle.modelName}</div>
              </div>
              <div className="col-md-6">
                <strong>Model Year:</strong> <div>{vehicle.modelYear}</div>
              </div>
              <div className="col-md-6">
                <strong>Type:</strong> <div>{vehicle.type}</div>
              </div>
              {/* <div className="col-md-6">
                <strong>Status:</strong>{" "}
                <div>{vehicle.status ? "Active" : "Inactive"}</div>
              </div> */}
              <div className="col-md-6">
                <strong>Created At:</strong>{" "}
                <div>{dateTime(vehicle.createdAt)}</div>
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

export default ViewVehicleModal;
