import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { Link } from "react-router-dom";
import { dbUrl } from "../../../utils/variables";
import axios from "axios";
import { FaEye } from "react-icons/fa";

import { MdDelete, MdModeEdit } from "react-icons/md";
import toast from "react-hot-toast";
import ConfirmModel from "../../../components/ConfirmModel";
import ViewServiceModal from "../../viewService/ViewServiceModal";

const ServiceList = () => {
  const [allServices, setallServices] = useState([]);
  const [deleteServiceId, setdeleteServiceId] = useState();
  const [viewServiceData, setviewServiceData] = useState();
  const getAllServices = async () => {
    const res = await axios.post(dbUrl + "service/all");

    setallServices(res.data?.data);
  };
  // get all services
  useEffect(() => {
    getAllServices();
  }, []);

  const handleDeleteMechanic = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${dbUrl}admin/service/delete`,
      { _id: deleteServiceId },
      { headers: { Authorization: token } }
    );

    if (res.data?.success) {
      toast.success(res.data.message);
      getAllServices();
      setdeleteServiceId("");
    } else {
      toast.error(res.data.message);
    }
  };

  return (
    <>
      {deleteServiceId && (
        <ConfirmModel
          onCancel={() => setdeleteServiceId("")}
          onConfirm={handleDeleteMechanic}
          title="Confirm to delete mechanic"
        />
      )}

      {viewServiceData && (
        <ViewServiceModal
          service={viewServiceData}
          onClose={() => setviewServiceData(null)}
        />
      )}
      <Header />
      <div className="d-flex my-5 justify-content-center">
        <div style={{ width: 1000 }}>
          <div className="d-flex justify-content-between">
            <h3 className="display-7 ">Services</h3>
            <Link
              className="btn btn-primary btn-sm d-flex justify-content-center align-items-center"
              to={"/admin/service-add"}
            >
              Add Service
            </Link>
          </div>
          <table class="table mt-3 table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Price</th>
                <th scope="col">Duration</th>
                <th scope="col">Type</th>
                <th scope="col">Description</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allServices?.map((service, i) => (
                <tr key={i}>
                  <th scope="row">{i + 1}</th>
                  <td>{service?.title}</td>
                  <td>{service?.price}</td>
                  <td>{service?.duration}</td>
                  <td>{service?.type}</td>
                  <td>
                    {service?.description?.slice(0, 15)}
                    {service?.description?.length > 15 && "..."}
                  </td>
                  <td className="d-flex  gap-2">
                    <Link
                      className={"btn btn-info  btn-sm"}
                      to={`/admin/service-update/${service?._id}`}
                    >
                      <MdModeEdit />
                    </Link>
                    <div
                      className={"btn btn-success  btn-sm"}
                      onClick={() => setviewServiceData(service)}
                    >
                      <FaEye />
                    </div>
                    <div
                      className="btn btn-danger btn-sm"
                      onClick={() => setdeleteServiceId(service?._id)}
                    >
                      <MdDelete />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ServiceList;
