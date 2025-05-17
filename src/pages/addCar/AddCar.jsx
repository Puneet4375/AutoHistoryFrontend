import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import { dbUrl } from "../../utils/variables";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";

const AddCar = () => {
  const [data, setdata] = useState();
  const [profile, setprofile] = useState();
  const [user, setuser] = useState();
  const navigate=useNavigate()
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    const usr = JSON.parse(localStorage.getItem("user"));
    if (usr) setuser(usr);
  }, []);

  // get profile
  useEffect(() => {
    const getProfile = async () => {
      let url = dbUrl;
      url += user?.userType == 2 ? "mechanic/single" : "customer/single";
      if (user) {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          url,
          { _id: user?._id },
          { headers: { Authorization: token } }
        );
        setprofile(res?.data?.data);
      }
    };

    getProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const res = await axios.post(
        dbUrl + "customer/vehicle/add",
        {
          ...data,
          userId: user?._id,
        },
        { headers: { Authorization: token } }
      );

      if (res.data?.success) {
        setLoading(false);
        toast.success(res?.data?.message);
        navigate("/vehicles");
      } else {
        setLoading(false);
        toast.error(res?.data?.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };
  return (
    <div>
       {loading && <Spinner/>}
      <Header></Header>
      <div
        className="container-fluid bg-secondary booking my-5 wow fadeInUp"
        data-wow-delay="0.1s"
      >
        <div className="container">
          <div className="row gx-5">
            <div className="col-lg-6 py-5">
              <div className="py-5">
                <h1 className="text-white mb-4">
                  Certified and Award Winning Car Repair Service Provider
                </h1>
                <p className="text-white mb-0"></p>
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className="bg-primary h-100 d-flex flex-column justify-content-center text-center p-5 wow zoomIn"
                data-wow-delay="0.6s"
              >
                <h1 className="text-white mb-4">Add Your Vehicle</h1>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <input
                        required
                        value={data?.manufacturingName}
                        onChange={(e) =>
                          setdata({
                            ...data,
                            manufacturingName: e.target.value,
                          })
                        }
                        type="text"
                        className="form-control border-0"
                        placeholder="Manufacturing Name"
                        style={{ height: 55 }}
                      />
                    </div>
                    <div className="col-12 col-sm-6">
                      <input
                        required
                        value={data?.modelName}
                        onChange={(e) =>
                          setdata({
                            ...data,
                            modelName: e.target.value,
                          })
                        }
                        type="text"
                        className="form-control border-0"
                        placeholder="Model Name"
                        style={{ height: 55 }}
                      />
                    </div>
                    <div className="col-12 col-sm-6">
                      <input
                        required
                        value={data?.modelYear}
                        onChange={(e) =>
                          setdata({
                            ...data,
                            modelYear: e.target.value,
                          })
                        }
                        type="Number"
                        className="form-control border-0"
                        placeholder="Model Year"
                        style={{ height: 55 }}
                      />
                    </div>
                    <div className="col-12 col-sm-6">
                      <input
                        required
                        value={data?.ownerName}
                        onChange={(e) =>
                          setdata({
                            ...data,
                            ownerName: e.target.value,
                          })
                        }
                        type="text"
                        className="form-control border-0"
                        placeholder="Owner Name"
                        style={{ height: 55 }}
                      />
                    </div>
                    <div className="col-12 col-sm-6">
                      <input
                        required
                        value={data?.RTONo}
                        onChange={(e) =>
                          setdata({
                            ...data,
                            RTONo: e.target.value,
                          })
                        }
                        type="text"
                        className="form-control border-0"
                        placeholder="RTO Name"
                        style={{ height: 55 }}
                      />
                    </div>
                    <div className="col-12 col-sm-6">
                      <select
                        value={data?.type}
                        onChange={(e) =>
                          setdata({
                            ...data,
                            type: e.target.value,
                          })
                        }
                        className="form-control border-0"
                        style={{ height: 55 }}
                      >
                        <option hidden value={""}>
                          Select vehicle type
                        </option>
                        <option value={"private"}>Private</option>
                        <option value={"commercial"}>Commercial</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <button
                        className="btn btn-secondary w-100 py-3"
                        type="submit"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default AddCar;
