import { useEffect, useState } from "react";
import axios from "axios";
import { dbUrl } from "../../utils/variables";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { MdDelete, MdModeEdit } from "react-icons/md";
import ConfirmModel from "../../components/ConfirmModel";
import toast from "react-hot-toast";
import { FaEye } from "react-icons/fa";
import ViewVehicleModal from "./ViewVehicleModal";
import Spinner from "../../components/Spinner";

const ViewVehicle = () => {
  const [allVehicles, setAllVehicles] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [deleteVehicleId, setdeleteVehicleId] = useState("");
  const [loading,setLoading] = useState(false);

  const [viewVehicleData, setviewVehicleData] = useState();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch profile based on user type
  useEffect(() => {
    const getProfile = async () => {
      if (!user) return;

      try {
        const endpoint =
          user.userType === 2 ? "mechanic/single" : "customer/single";
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${dbUrl}${endpoint}`,
          { _id: user._id },
          { headers: { Authorization: token } }
        );
        setProfile(response.data?.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    getProfile();
  }, [user]);

  // delete vehicle
  const handleDeleteVehicle = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      dbUrl + "customer/vehicle/delete",
      { _id: deleteVehicleId },
      { headers: { Authorization: token } }
    );

    if (res.data?.success) {
      toast.success(res?.data?.message);
      fetchVehicles();
      setdeleteVehicleId("");
    } else {
      toast.error(res?.data?.message);
    }
  };

  // Fetch all vehicles
  const fetchVehicles = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const body = user.userType === 3 ? { addedById: user._id } : {};
      const response = await axios.post(`${dbUrl}vehicle/all`, body);
      setLoading(false);
      setAllVehicles(response.data?.data || []);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching vehicles:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [user, profile]);

  return (
    <>
     {loading && <Spinner/>}
      {viewVehicleData && (
        <ViewVehicleModal
          onClose={() => setviewVehicleData(null)}
          vehicle={viewVehicleData}
        />
      )}
      {deleteVehicleId && (
        <ConfirmModel
          onCancel={() => setdeleteVehicleId("")}
          onConfirm={() => handleDeleteVehicle()}
          title={"Confirm to delete vehicle"}
        />
      )}
      <Header />
      <div className="d-flex my-5 justify-content-center">
        <div style={{ width: '1200px'}}>
          <div className="d-flex justify-content-between mb-3">
            <h3>Vehicles</h3>
            {user?.userType == 3 && (
              <Link
                className="btn d-flex justify-content-center align-items-center btn-primary btn-sm"
                to="/car"
              >
                Add Vehicle
              </Link>
            )}
          </div>

          {allVehicles.length > 0 ? (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Manufacturing Name</th>
                  <th>Model Name</th>
                  <th>Model Year</th>
                  <th>Owner Name</th>
                  <th>RTO No.</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allVehicles.map((vehicle, i) => (
                  <tr key={vehicle._id}>
                    <td>{i + 1}</td>
                    <td>{vehicle.manufacturingName}</td>
                    <td>{vehicle.modelName}</td>
                    <td>{vehicle.modelYear}</td>
                    <td>{vehicle.ownerName}</td>
                    <td>{vehicle.RTONo}</td>
                    <td className="d-flex gap-2">
                      {user?.userType == 3 && (
                        <Link
                          className="btn btn-info btn-sm"
                          to={`/update-vehicle/${vehicle._id}`}
                        >
                          <MdModeEdit />
                        </Link>
                      )}
                      <div
                        onClick={() => setviewVehicleData(vehicle)}
                        className="btn  btn-success btn-sm"
                      >
                        <FaEye />
                      </div>
                      {(user?.userType == 1 || user?.userType == 3) && (
                        <div
                          onClick={() => setdeleteVehicleId(vehicle?._id)}
                          className="btn  btn-danger btn-sm"
                        >
                          <MdDelete />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No vehicles found.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ViewVehicle;
