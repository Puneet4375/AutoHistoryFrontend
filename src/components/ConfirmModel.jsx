import React from "react";

const ConfirmModel = ({ title, onConfirm, onCancel }) => {
  return (
    <div className="authPopUp">
      <div className="d-flex flex-column p-4 px-5 rounded-3 bg-white">
        {" "}
        <h4>{title}</h4>
        <div className="d-flex gap-3 justify-content-end  mt-2 ">
          <div onClick={onConfirm} className="btn btn-info text-white  ">Confirm</div>
          <div onClick={onCancel} className="btn btn-danger  ">Cancel</div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModel;
