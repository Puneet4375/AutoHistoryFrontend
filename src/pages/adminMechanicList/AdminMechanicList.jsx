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

const AdminMechanicList = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [deleteMechanicId, setDeleteMechanicId] = useState("");
  const [allMechanics, setAllMechanics] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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

  const fetchMechanics = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(`${dbUrl}mechanic/all`,{},{headers:{Authorization:token}});
      setAllMechanics(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching mechanics:", error);
    }
  };

  useEffect(() => {
    fetchMechanics();
  }, []);

  async function updateStatus(id,status){
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(`${dbUrl}admin/mechanic/updateStatus`,{_id:id,approved:status},{headers:{Authorization:token}});
       fetchMechanics();
    } catch (error) {
      console.error("Error fetching mechanics:", error);
    }

  }

  const handleDeleteMechanic = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${dbUrl}admin/mechanic/delete`,
      { _id: deleteMechanicId },
      { headers: { Authorization: token } }
    );

    if (res.data?.success) {
      toast.success(res.data.message);
      fetchMechanics();
      setDeleteMechanicId("");
    } else {
      toast.error(res.data.message);
    }
  };

  return (
    <>
    
      {deleteMechanicId && (
        <ConfirmModel
          onCancel={() => setDeleteMechanicId("")}
          onConfirm={handleDeleteMechanic}
          title="Confirm to delete mechanic"
        />
      )}

      <Header />
      <div className="container my-5">
        <div className="d-flex justify-content-between mb-3">
          <h3>All Mechanics</h3>
          {/* <Link className="btn btn-primary btn-sm" to="/add-mechanic">
            Add Mechanic
          </Link> */}
        </div>

        {allMechanics.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Shop Name</th>
                <th>Owner Name</th>
                <th>Type</th>
                <th>Contact</th>
                <th>Approved</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allMechanics.map((mech, i) => (
                <tr key={mech._id}>
                  <td>{i + 1}</td>
                  <td>{mech.shopName}</td>
                  <td>{mech.ownerName}</td>
                  <td>{mech.type}</td>
                  <td>{mech.contactNo}</td>
                  <td>{mech.isApproved ?
                  <>
                  <button class="btn btn-danger btn-sm" type="button" onClick={()=>{ updateStatus(mech.userId,false)}} >Block</button>
                  </>:
                  <>
                  <button class="btn btn-success btn-sm" type="button" onClick={()=>{ updateStatus(mech.userId,true)}} >Approve</button>
                  </>}</td>
                  <td className="d-flex gap-2">
                    {/* <Link className="btn btn-info btn-sm" to={`/update-mechanic/${mech._id}`}>
                      <MdModeEdit />
                    </Link> */}
                    <Link
                      className="btn btn-success btn-sm"
                      to={'/mechanic-details'+"/"+mech?.userId+"/"+mech?._id}
                    >
                      <FaEye />
                    </Link>
                    <div
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteMechanicId(mech._id)}
                    >
                      <MdDelete />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No mechanics found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminMechanicList;
