import React from "react";
import {RxCross1} from 'react-icons/rx'

const EditBookingModal = ({ selectedBooking, setselectedBooking }) => {
  return (
    <div className="authPopUp">
      <div
        style={{ height: "90%", width: "80%", backgroundColor: "white" }}
        className="rounded-3 p-3"
      >
        {/* heading and cross button  */}
        <div className="d-flex justify-content-between  align-items-center">
          <h3 className="text-primary">{selectedBooking?.shopName}</h3>
          <RxCross1
            onClick={() => setselectedBooking(null)}
            size={25}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;
