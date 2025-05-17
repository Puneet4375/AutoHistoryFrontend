import axios from "axios";
import React, { useState } from "react";
import {RxCross1} from 'react-icons/rx'
import { dbUrl } from "../../utils/variables";
import toast from "react-hot-toast";

const Feedback = ({  userType,selectedBooking,setselectedBooking,setFeeback}) => {

  const [feedbackDesc,setDesc] = useState('');
  async function submit(){
      console.log(userType);
      console.log(feedbackDesc);
      console.log(selectedBooking);
      const token = localStorage.getItem("token");
            const res = await axios.post(
              dbUrl+"booking/updateFeedback",
              { _id: selectedBooking?._id,feedback:feedbackDesc,userType:userType },
              { headers: { Authorization: token } }
            );
      
            if (res.data?.success) {
                toast.success(res?.data?.message);
                setFeeback(false);
                setselectedBooking(null);
            } else {
                    toast.error(res.data?.message);
            }
  }

  return (
    <div className="authPopUp">
      <div style={{  width: "80%", backgroundColor: "white" }} className="rounded-3 p-3" >
        <div className="d-flex justify-content-between  align-items-center">
          <h4 className="text-primary">{userType==3?"Give Feedback about Mechanic":"Give Feeback On Car Condition After Service"}</h4>
          <RxCross1
            onClick={() => {setFeeback(false),setselectedBooking(false)}}
            size={25}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="d-flex flex-column">
          <label htmlFor="" className="my-2 fw-bold">Feedback</label>
          <textarea rows={3} placeholder="Type here..." class="form-control" onChange={(event)=>{ setDesc(event.target.value)}}></textarea>
          <div className="btn btn-sm btn-primary my-3" onClick={()=>{ submit()}}>Submit</div>
        </div>
    </div>
    </div>
  );
};

export default Feedback;
