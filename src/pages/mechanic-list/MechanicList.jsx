import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { IoMdCall } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaAnchor, FaLink, FaLocationDot } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { dbUrl } from "../../utils/variables";
import Spinner from "../../components/Spinner";

const MechanicList = () => {
  const [user, setUser] = useState(null);
  const [allMechanic, setallMechanic] = useState([]);
  const [selectedMechanic, setselectedMechanic] = useState(null);
  const [loading,setLoading] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    getAllMechanics();
  }, []);

  const getAllMechanics = async () => {

    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await axios.post(
      dbUrl + "mechanic/all",
      {},
      { headers: { Authorization: token } }
    );
    setLoading(false);
    if (res.data?.success) {
      if(user?.userType==3) {
        let mechanic = res?.data?.data.filter((itr)=>{
            if(itr?.isApproved) {
              return itr;
            }
        })

        setallMechanic(mechanic);
      } else {
        setallMechanic(res?.data?.data);  
      }
    }
  };

  return (
    <>
     {loading && <Spinner/>}
      {/* mechanic view  */}
      {selectedMechanic && (
        <div className="authPopUp">
          <div
            style={{width: "80%", backgroundColor: "white" }}
            className="rounded-3 p-3"
          >
            {/* heading and cross button  */}
            <div className="d-flex justify-content-between  align-items-center">
              <h3 className="text-primary">{selectedMechanic?.shopName}</h3>
              <RxCross1
                onClick={() => setselectedMechanic(null)}
                size={25}
                style={{ cursor: "pointer" }}
              />
            </div>

            {/* details  */}
            <div
              style={{ width: "100%" }}
              className="d-flex overflow-hidden gap-2 rounded-3  border-2   w-100 border-primary "
            >
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ maxWidth: 200, height: "100%" }}
              >
               <img
                  src={selectedMechanic?.shopCertificate}
                  onError={(e) => {
                    e.target.onerror = null; // prevent infinite loop if fallback also fails
                    e.target.src = "car_mechanics_01.jpg"; // replace with your actual fallback image path
                  }}
                  style={{ height: "100%", width: "100%" }}
                  alt=""
                />
              </div>

                  <div className="d-flex flex-column w-100">

                                <table className="table table-bordered">
                                  <tbody>
                                    <tr>
                                      <th>Shop Name:</th>
                                      <td>{selectedMechanic?.shopName}</td>
                                      <th>Contact:</th>
                                      <td>{selectedMechanic?.contactNo}</td>
                                    </tr>
                                  <tr>
                                      <th>Type:</th>
                                      <td>{selectedMechanic?.type=='private'?'Private':'Public'}</td>
                                      <th>Owner Name:</th>
                                      <td>{selectedMechanic?.ownerName}</td>
                                  </tr>
                                  </tbody>
                                </table>
                                <table className="table table-bordered">
                                  <tbody>
                                    <tr>
                                        <th colSpan={2}>Specialization:</th>
                                        <td colSpan={2}>{selectedMechanic?.specialization}</td>
                                    </tr>
                                    <tr>
                                        <th colSpan={2}>Address:</th>
                                        <td colSpan={2}>{selectedMechanic?.address}</td>
                                    </tr>
                                  </tbody>
                                </table>
                               
                                <div style={{ maxHeight: '130px', overflowY: 'auto' }}>
                                  <table className="table table-bordered">
                                    <thead className="table-light" style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                                      <tr>
                                        <th>Service</th>
                                        <th>Price</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {selectedMechanic?.services.map((row, index) => (
                                        <tr key={index}>
                                          <td>{row?.serviceId?.title}</td>
                                          <td>{row?.price}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                  </div>
            </div>
          </div>
        </div>
      )}

      <Header />
      <div className="d-flex w-100 flex-column my-5  justify-content-center align-items-center ">
        <div
          style={{ maxWidth: 1000, width: "100%" }}
          className="w-full d-flex flex-column gap-4"
        >
          {/* cards  */}
          {allMechanic?.length &&
            allMechanic?.map((mechanic, i) => (
              <div
                key={i}
                style={{ width: "100%" }}
                className="d-flex overflow-hidden gap-2 rounded-3  border-2 shadow border w-100 border-primary "
              >
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ maxWidth: 300, height: "100%" }}
                >
                  <img
                    style={{ height: "100%", width: "100%" }}
                    src="car_mechanics_01.jpg"
                    alt=""
                  />
                </div>

                <div className="p-2 d-flex flex-column w-100">
                  <p
                    style={{ fontSize: 23, fontWeight: "600" }}
                    className="text-primary w-100 "
                  >
                    {mechanic?.shopName}
                  </p>

                  <div className="d-flex gap-2 ">
                    <p style={{ fontWeight: "500", fontSize: 18 }}>Owner:</p>
                    <p> {mechanic?.ownerName} </p>
                  </div>
                  <div className="d-flex gap-2 mt-1 ">
                    <p style={{ fontWeight: "500", fontSize: 18 }}>Services:</p>
                    {mechanic?.services?.map((service, inn) => (
                      <p
                        key={inn}
                        className=" bg-light px-2 rounded-3 border py-"
                      >
                        {service?.serviceId?.title}
                      </p>
                    ))}
                    {!mechanic?.services?.length && "Services not found!"}
                  </div>
                  <div className="d-flex gap-2 mt-1 align-items-center ">
                    <p
                      className="text-primary"
                      style={{ fontWeight: "500", fontSize: 18 }}
                    >
                      <IoMdCall />
                    </p>
                    <p>{mechanic?.contactNo}</p>
                  </div>
                  <div className="d-flex gap-2 mt-1 align-items-center ">
                    <p
                      className="text-primary"
                      style={{ fontWeight: "500", fontSize: 18 }}
                    >
                      <FaLocationDot />
                    </p>
                    <p>{mechanic?.address}</p>
                  </div>

                  <div className="d-flex gap-2 mt-1 align-items-center ">
                    <p
                      className="text-primary"
                      style={{ fontWeight: "500", fontSize: 18 }}
                    >
                      <FaAnchor />
                    </p>
                    <p>{mechanic?.specialization}</p>
                  </div>
                  <div className="d-flex gap-2 mt-1 align-items-center ">
                    <p
                      className="text-primary"
                      style={{ fontWeight: "500", fontSize: 18 }}
                    >
                      {mechanic.shopCertificate && < FaLink />}
                    </p>
                    <p> {mechanic.shopCertificate && <a href={mechanic?.shopCertificate} _target="blank">Link</a>}</p>
                  </div>
                 
                  <div className="d-flex mt-2 gap-2  mt-auto justify-content-end">
                    <div
                      onClick={() => setselectedMechanic(mechanic)}
                      className="btn text-white btn-info btn-sm"
                    >
                      View
                    </div>
                    {user?.userType == 3 && (
                      <Link
                        to={`/mechanic-book/${mechanic?.userId}/${mechanic?._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Book Mechanic
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MechanicList;
