import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { dbUrl } from "../../utils/variables";
import axios from "axios";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";

const animatedComponents = makeAnimated();

const Profile = () => {
  const [user, setuser] = useState();
  const [profile, setprofile] = useState();
  const [options, setoptions] = useState([]);
  const [selectedServices, setselectedServices] = useState([]);
  const [selectedCertificate, setselectedCertificate] = useState(null);
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();

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
        setServiceRows(res?.data?.data?.services)
      }
    };

    getProfile();
  }, [user]);



  // on submit
  const handleSubmit = async (e) => {
    e.preventDefault();

  if(user?.userType==2) {
    if (
      !profile?.shopName?.trim() ||
      !profile?.ownerName?.trim() ||
      !profile?.address?.trim() ||
      !profile?.type?.trim() ||
      (profile?.contactNo==null || profile?.contactNo==undefined) ||
      !profile?.specialization?.trim()
    ) {
      return toast.error("All fields are required");
    }
  } else {
    if (!profile?.contactNo) {
      return toast.error("All fields are required");
    }
  }


    const token = localStorage.getItem("token");

    if (!user?.userType || !token) return;

    let url = dbUrl;
    url += user?.userType == 2 ? "mechanic/update-profile" : "customer/update";

    const formData = new FormData();

    formData.append("name", JSON.stringify(user?.name));

    formData.append("shopName", JSON.stringify(profile?.shopName));
    formData.append("ownerName", JSON.stringify(profile?.ownerName));
    formData.append("address", JSON.stringify(profile?.address));
    formData.append("type", JSON.stringify(profile?.type));
    if (selectedCertificate)
      formData.append("certificate", selectedCertificate);
    formData.append("contactNo", JSON.stringify(profile?.contactNo));
    formData.append("specialization", JSON.stringify(profile?.specialization));
    if(user?.userType==2){
      const validRows = serviceRows.filter(
        (row) => row.serviceId && row.price !== ""
      );
      console.log("Submitted data:", validRows);
      formData.append(
        "services",
        JSON.stringify(validRows)
      );
    }
    setLoading(true);
    const res = await axios.post(
      url,
      user?.userType == 2
        ? formData
        : { name: user?.name, contactNo: profile?.contactNo },
      {
        headers: { Authorization: token },
      }
    );

    if (res.data?.success) {
      setLoading(false);
      setprofile(res.data?.data);
      localStorage.setItem("user", JSON.stringify(user));
    }
    if (res.data?.success) {
      setLoading(false);
      toast.success(res?.data?.message);
      navigate("/");
    } else {
      setLoading(false);
      toast.error(res?.data?.message);
    }
  };


  const [serviceRows, setServiceRows] = useState([
    { serviceId: "", price: "" },
  ]);

  const handleServiceChange = (selectedOption, index) => {
    const updated = [...serviceRows];
    updated[index].serviceId = selectedOption?.value || "";
    setServiceRows(updated);
  };

  const handlePriceChange = (value, index) => {
    const updated = [...serviceRows];
    updated[index].price = value;
    setServiceRows(updated);
  };

  const handleAddRow = () => {
    setServiceRows([...serviceRows, { serviceId: "", price: "" }]);
  };

  const handleRemoveRow = (index) => {
    const updated = [...serviceRows];
    updated.splice(index, 1);
    setServiceRows(updated);
  };

  // const handleSubmitz = () => {
  //   const validRows = serviceRows.filter(
  //     (row) => row.serviceId && row.price !== ""
  //   );
  //   console.log("Submitted data:", validRows);
  //   // e.g. POST validRows to backend
  // };


  // get all services
  useEffect(() => {
    const getAllServices = async () => {
      const res = await axios.post(dbUrl + "service/all");

      if (res.data?.success) {
        const optns = res?.data?.data.map((servs) => {
          return {
            ...servs,
            value: servs?._id,
            label: servs?.title,
          };
        });
        setoptions(optns);
      }
    };

    getAllServices();
  }, []);
  return (
    <>
      {" "}
      {loading && <Spinner/>}
      <Header />
      <div className="flex w-100 justify-content-center d-flex align-items-center">
        <div
          style={{ width: "800px" }}
          className="bg-primary my-5 h-100 d-flex flex-column justify-content-center text-center p-5 wow zoomIn"
          data-wow-delay="0.6s"
        >
          <h1 className="text-white mb-4">Profile</h1>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* customer fields  */}
              <div className="col-6 ">
                <div
                  style={{
                    textAlign: "start",
                    fontWeight: "500",
                    fontSize: 18,
                  }}
                  className="  text-white"
                >
                  Name
                </div>
                <input
                  value={user?.name}
                  onChange={(e) => {
                    setuser({ ...user, name: e.target.value });
                  }}
                  type="text"
                  className="form-control boFrder-0"
                  placeholder="Name"
                  style={{ height: 55 }}
                />
              </div>
              {user?.userType == 3 && (
                <div className="col-6 ">
                  <div
                    style={{
                      textAlign: "start",
                      fontWeight: "500",
                      fontSize: 18,
                    }}
                    className="  text-white"
                  >
                    Phone Number
                  </div>
                  <input
                    value={profile?.contactNo}
                    onChange={(e) => {
                      setprofile({ ...profile, contactNo: e.target.value });
                    }}
                    type="text"
                    className="form-control border-0"
                    placeholder="Phone Number"
                    style={{ height: 55 }}
                  />
                </div>
              )}

              {/* mechanic fields  */}
              {user?.userType == 2 && (
                <div className="col-6 ">
                  <div
                    style={{
                      textAlign: "start",
                      fontWeight: "500",
                      fontSize: 18,
                    }}
                    className="  text-white"
                  >
                    Shop Name
                  </div>
                  <input
                    value={profile?.shopName}
                    onChange={(e) => {
                      setprofile({ ...profile, shopName: e.target.value });
                    }}
                    type="text"
                    className="form-control border-0"
                    placeholder="Shop Name"
                    style={{ height: 55 }}
                  />
                </div>
              )}
              {user?.userType == 2 && (
                <div className="col-6 ">
                  <div
                    style={{
                      textAlign: "start",
                      fontWeight: "500",
                      fontSize: 18,
                    }}
                    className="  text-white"
                  >
                    Owner Name
                  </div>
                  <input
                    value={profile?.ownerName}
                    onChange={(e) => {
                      setprofile({ ...profile, ownerName: e.target.value });
                    }}
                    type="text"
                    className="form-control border-0"
                    placeholder="Owner Name"
                    style={{ height: 55 }}
                  />
                </div>
              )}
              {user?.userType == 2 && (
                <div className="col-6 ">
                  <div
                    style={{
                      textAlign: "start",
                      fontWeight: "500",
                      fontSize: 18,
                    }}
                    className="  text-white"
                  >
                    Contact Number
                  </div>
                  <input
                    value={profile?.contactNo}
                    onChange={(e) => {
                      setprofile({ ...profile, contactNo: e.target.value });
                    }}
                    type="text"
                    className="form-control border-0"
                    placeholder="Contact Number"
                    style={{ height: 55 }}
                  />
                </div>
              )}
              {user?.userType == 2 && (
                <div className="col-6 ">
                  <div
                    style={{
                      textAlign: "start",
                      fontWeight: "500",
                      fontSize: 18,
                    }}
                    className="  text-white"
                  >
                    Shop Address
                  </div>
                  <input
                    value={profile?.address}
                    onChange={(e) => {
                      setprofile({ ...profile, address: e.target.value });
                    }}
                    type="text"
                    className="form-control border-0"
                    placeholder="Address"
                    style={{ height: 55 }}
                  />
                </div>
              )}

              {user?.userType == 2 && (
                <div className="col-6 ">
                  <div
                    style={{
                      textAlign: "start",
                      fontWeight: "500",
                      fontSize: 18,
                    }}
                    className="  text-white"
                  >
                    Select Type
                  </div>
                  <select
                    onChange={(e) =>
                      setprofile({ ...profile, type: e.target.value })
                    }
                    value={profile?.type}
                    className="form-control border-0"
                    style={{ height: 55 }}
                  >
                    <option hidden value="Select type">
                      Select type
                    </option>
                    <option hidden value="">Select Type</option>
                    <option value="commercial">commercial</option>
                    <option value="private">private</option>
                  </select>
                </div>
              )}

              {user?.userType == 2 && (
                <div className="col-12 ">
                  <div
                    style={{
                      textAlign: "start",
                      fontWeight: "500",
                      fontSize: 18,
                    }}
                    className="  text-white"
                  >
                    Specialization
                  </div>
                  <textarea
                    rows={5}
                    value={profile?.specialization}
                    onChange={(e) => {
                      setprofile({
                        ...profile,
                        specialization: e.target.value,
                      });
                    }}
                    className="form-control border-0"
                    placeholder="Specialization"
                    style={{ height: 55 }}
                  />
                </div>
              )}
              {user?.userType == 2 && (
                <div className="col-12  ">
                  <div
                    style={{
                      textAlign: "start",
                      fontWeight: "500",
                      fontSize: 18,
                    }}
                    className="  text-white"
                  >
                    Services / Price
                  </div>

                  <div>
                  {serviceRows.map((row, index) => (
                    <div className="row mb-2" key={index}>
                      <div className="col">
                        <Select
                          value={options.find((opt) => opt.value === row.serviceId._id) || null}
                          onChange={(selectedOption) => handleServiceChange(selectedOption, index)}
                          placeholder="Select Service"
                          components={animatedComponents}
                          options={options}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter Price"
                          value={row.price}
                          onChange={(e) => handlePriceChange(e.target.value, index)}
                        />
                      </div>
                      <div className="col-auto d-flex align-items-center">
                        {serviceRows.length > 1 && (
                          <button className="btn btn-danger" onClick={() => handleRemoveRow(index)}>
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="mb-3">
                    <button type="button" className="btn btn-warning me-2" onClick={handleAddRow}>
                      More Service
                    </button>
                    {/* <button type="button" className="btn btn-success" onClick={handleSubmitz}>
                      Submit
                    </button> */}
                  </div>
                </div>
                          
                  {/* <div className="row">
                    <div className="col">
                       <Select
                    onChange={(selects) => setselectedServices(selects)}
                    value={selectedServices}
                    placeholder="Select Sevices"
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    options={options}
                  />
                    </div>
                    <div className="col">
                      <input type="number" className="form-control" name="price"></input>
                    </div>
                  </div> */}
                </div>
              )}

              {user?.userType == 2 && (
                <div className="col-12 ">
                  <div
                    style={{
                      textAlign: "start",
                      fontWeight: "500",
                      fontSize: 18,
                    }}
                    className="  text-white"
                  >
                    Certificate
                  </div>
                  <div
                    className={`d-flex p-3 gap-3 flex-column justify-content-center align-items-center bg-white w-full`}
                  >
                    <img
                      style={{ height: 70, width: 120 }}
                      src={
                        (selectedCertificate &&
                          URL.createObjectURL(selectedCertificate)) ||
                        profile?.shopCertificate
                      }
                      alt=""
                    />
                    <label htmlFor="certificate" className="btn btn-primary">
                      {profile?.shopCertificate ? "Update" : "Upload"}
                    </label>

                    <input
                      onChange={(e) =>
                        setselectedCertificate(e.target.files[0])
                      }
                      id="certificate"
                      type="file"
                      accept=".png, .jpg, .jpeg, .gif"
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              )}

              <div className="col-12">
                <button className="btn btn-secondary w-100 py-3" type="submit">
                  Update Profile
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
