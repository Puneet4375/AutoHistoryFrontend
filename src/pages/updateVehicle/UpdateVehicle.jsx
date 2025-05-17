import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { dbUrl } from "../../utils/variables";

import toast from "react-hot-toast";
const UpdateVehicle = () => {
  const [data, setdata] = useState();
  const navigate = useNavigate();
  const param = useParams();

  useEffect(() => {
    const getVehicle = async () => {
      const res = await axios.post(dbUrl + "vehicle/single", {
        _id: param?.id,
      });
      if (res.data?.success) {
        toast.success(res?.data?.message);
        setdata(res?.data?.data);
      } else {
        toast.error(res.data?.message);
      }
    };

    getVehicle();
  }, [param]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await axios.post(dbUrl + "customer/vehicle/update", data, {
      headers: { Authorization: token },
    });

    if (res.data?.success) {
      toast.success(res?.data?.message);
      navigate('/vehicles')
    } else {
      toast.error(res.data?.message);
    }
  };

  return (
    <>
      <Header />
      <div className="w-100 d-flex justify-content-center align-items-center my-5">
        {" "}
        <div className="col-lg-6">
          <div
            className="bg-primary h-100 d-flex flex-column justify-content-center text-center p-5 wow zoomIn"
            data-wow-delay="0.6s"
          >
            <h1 className="text-white mb-4">Update Vehicle</h1>
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
                    className="btn btn-secondary w-100  py-3"
                    type="submit"
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpdateVehicle;
