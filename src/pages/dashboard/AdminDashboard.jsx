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

const AdminDashboard = () => {
  const [data, setData] = useState({});
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [deleteVehicleId, setdeleteVehicleId] = useState("");

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
  const handleDashboard = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      dbUrl + "admin/dashboard", {},
      { headers: { Authorization: token } }
    );

    if (res.data?.success) {
      // toast.success(res?.data?.message);
      setData(res.data);
    } else {
      // toast.error(res?.data?.message);
    }
  };

  // Fetch all vehicles


  useEffect(() => {
    handleDashboard();
  }, [user, profile]);
  return (
    <>

      <Header />
      <div className="d-flex my-5 justify-content-center">
        <div style={{ width: '1200px' }}>
          <div className="row justify-content-between mb-3">
            {user?.userType==1 && <div class="card col-4 ">
              <div class="card-body">
                <h5 class="card-title">Total Mechanics</h5>
                <h3 class="card-text">{data?.totalMechanics}</h3>
              </div>
            </div>}
           {user?.userType==1 &&  <div class="card col-4">
              <div class="card-body">
                <h5 class="card-title">Total Bookings</h5>
                <h3 class="card-text">{data?.totalBookings}</h3>
              </div>
            </div>}
            <div class="card col-4">
              <div class="card-body">
                <h5 class="card-title">Total Customers</h5>
                <h3 class="card-text">{data?.totalCustomers}</h3>
              </div>
            </div>

            <div class="card col-4">
              <div class="card-body">
                <h5 class="card-title">Total Services</h5>
                <h3 class="card-text">{data?.totalServices}</h3>
              </div>
            </div>

            <div class="card col-4">
              <div class="card-body">
                <h5 class="card-title">Total Vehicles</h5>
                <h3 class="card-text">{data?.totalVehicles}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
