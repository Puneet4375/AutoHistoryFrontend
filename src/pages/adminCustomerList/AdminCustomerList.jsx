import { useEffect, useState } from "react";
import axios from "axios";
import { dbUrl } from "../../utils/variables";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { MdDelete } from "react-icons/md";
import ConfirmModel from "../../components/ConfirmModel";
import toast from "react-hot-toast";
import { FaEye } from "react-icons/fa";

const AdminCustomerList = () => {
  const [user, setUser] = useState(null);
  const [deleteCustomerId, setDeleteCustomerId] = useState("");
  const [allCustomers, setAllCustomers] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${dbUrl}customer/all`,
        {},
        { headers: { Authorization: token } }
      );
      setAllCustomers(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${dbUrl}admin/customer/delete`,
        { _id: deleteCustomerId },
        { headers: { Authorization: token } }
      );

      if (res.data?.success) {
        toast.success(res.data.message);
        fetchCustomers();
        setDeleteCustomerId("");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Error deleting customer:", err);
      toast.error("Failed to delete customer.");
    }
  };

  return (
    <>
      {deleteCustomerId && (
        <ConfirmModel
          onCancel={() => setDeleteCustomerId("")}
          onConfirm={handleDeleteCustomer}
          title="Confirm to delete customer"
        />
      )}

      <Header />
      <div className="container my-5">
        <div className="d-flex justify-content-between mb-3">
          <h3>All Customers</h3>
        </div>

        {allCustomers.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                {/* <th>Status</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allCustomers.map((cust, i) => (
                <tr key={cust._id}>
                  <td>{i + 1}</td>
                  <td>{cust.name}</td>
                  <td>{cust.userId?.email}</td>
                  <td>{cust.phoneNo||'-'}</td>
                  {/* <td>{cust.status ? "Active" : "Inactive"}</td> */}
                  <td className="d-flex gap-2">
                    <Link
                      className="btn btn-success btn-sm"
                      to={`/customer-details/${cust.userId?._id}/${cust._id}`}
                    >
                      <FaEye />
                    </Link>
                    <div
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteCustomerId(cust._id)}
                    >
                      <MdDelete />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No customers found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminCustomerList;
