/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import Tabletop from "../../EntryFile/tabletop"
import { Link } from "react-router-dom";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import Swal from "sweetalert2";
import {
  ClosesIcon,
  Excel,
  Filter,
  Pdf,
  PlusIcon,
  Printer,
  Search,
  EditIcon,
  DeleteIcon,
  Thomas,
  Benjamin,
  James,
  Bruklin,
  Beverly,
  search_whites,
  Avatar1,
} from "../../EntryFile/imagePath";
import axios from "axios";
import { peopleUrl, userUrl } from "../../Apis/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const UserLists = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState({})
  const [filteredData, setFilteredData] = useState([]);
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const clearFilters = () => {
    setUserName("");
    setPhone("");
    setEmail("");
  };

  const confirmText = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: !0,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      confirmButtonClass: "btn btn-primary",
      cancelButtonClass: "btn btn-danger ml-1",
      buttonsStyling: !1,
    }).then(function (t) {
      if (t.value) {
        // Perform delete action with the ID
        deleteUser(id);
      }
    });
  };

  const deleteUser = async (id) => {
    try {
      // Make DELETE request to backend to delete product with ID
      await axios.delete(`${peopleUrl}/delete-user/${id}`);
      // Optionally update state or fetch new data after deletion
      setFilteredData((prevData) => prevData.filter((item) => item._id !== id));
      Swal.fire({
        type: "success",
        title: "Deleted!",
        text: "Your file has been deleted.",
        confirmButtonClass: "btn btn-success",
      })
    } catch (error) {
      console.log(error);
      history.push('/error-500')
    }
  };

  const togglefilter = (value) => {
    setInputfilter(value);
  };
  const options = [
    { id: 1, text: "Disable", text: "Disable" },
    { id: 2, text: "Enable", text: "Enable" },
  ];

  const [data, setData] = useState([]);

  useEffect(() => {
    const salesList = async () => {
      try {
        await axios.get(`${peopleUrl}/user-list`).then((response) => {
          const datas = response.data
          setData(datas)
          setFilteredData(datas)
        })
      } catch (error) {
        console.log(error);
      }
    }
    salesList()
  }, [])

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.post(`${userUrl}/get-user-by-id`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setSelectedPermission(response.data.selectedPermissions[0])
      } catch (error) {
        console.log(error);
      }
    }
    checkPermission()
  }, [])

  const handleSearch = (data) => {
    setFilteredData(data);
  };
  
  const handleFilter = () => {
    let filteredProducts = data.slice();

    if (userName) {
      filteredProducts = filteredProducts.filter(
        (product) => product.userName.includes(userName)
      );
    }

    if (phone) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.phone &&
          product.phone.toString().includes(phone)
      );
    }

    if (email) {
      filteredProducts = filteredProducts.filter(
        (product) => product.email.includes(email)
      );
    }

    setFilteredData(filteredProducts);
  };

  useEffect(() => {
    handleFilter();
  }, [data, userName, phone, email]);


  const columns = [
    {
      title: "Profile",
      dataIndex: "image",
      render: (text, record) => (
        <div className="productimgname">
          {record.image ? (
          <Link to="#" style={{ width: "70%" }} className="product-img">
            <img alt="" src={record.image} />
          </Link>
          ) : (
            <Link to="#" style={{ width: "70%" }} className="product-img">
            <img alt="" src={Avatar1} />
          </Link>
          )}
        </div>
      ),
      // sorter: (a, b) => a.profile.length - b.profile.length,
      width: "80px",
      key: "image"
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      sorter: (a, b) => a.firstName.length - b.firstName.length,
      key: "firstName"
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      sorter: (a, b) => a.lastName.length - b.lastName.length,
      key: "lastName"
    },
    {
      title: "User Name",
      dataIndex: "userName",
      sorter: (a, b) => a.userName.length - b.userName.length,
      key: "userName"
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone - b.phone,
      key: "phone"
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      key: "firstName"
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (e, record) => (
    //     <div className="status-toggle d-flex justify-content-between align-items-center">
    //       <input
    //         type="checkbox"
    //         id="user2"
    //         className="check"
    //         defaultChecked={e}
    //       />
    //       <label htmlFor="user2" className="checktoggle">
    //         checkbox
    //       </label>
    //     </div>
    //   ),
    // },
    {
      title: "Action",
      render: (record) => (
        <>
          {selectedPermission.userEdit === true ? (
            <Link className="me-3" to={`/dream-pos/people/edituser-people/${record._id}`}>
              <img src={EditIcon} alt="img" />
            </Link>
          ) : (
            <div></div>
          )}
          {selectedPermission.userDelete === true ? (
            <Link className="confirm-text" to="#" onClick={() => confirmText(record._id)}>
              <img src={DeleteIcon} alt="img" />
            </Link>
          ) : (
            <div></div>
          )}
        </>
      ),
    },
  ];
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>User List</h4>
              <h6>Manage your User</h6>
            </div>
            {selectedPermission.userCreate === true ? (
            <div className="page-btn">
              <Link to="/dream-pos/people/adduser-people" className="btn btn-added">
                <img src={PlusIcon} alt="img" className="me-1" />
                Add User
              </Link>
            </div>
            ) : (
              <div></div>
            )}
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <Tabletop data={data} onFilter={handleSearch} inputfilter={inputfilter} togglefilter={togglefilter} />
              {/* /Filter */}
              <div
                className={`card mb-0 ${inputfilter ? "toggleCls" : ""}`}
                id="filter_inputs"
                style={{ display: inputfilter ? "block" : "none" }}
              >
                <div className="card-body pb-0">
                  <div className="row">
                  <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter User Name"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Phone Number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-1 col-sm-6 col-12 ms-auto">
                    <div className="form-group">
                        <button className="btn btn-filters ms-auto" onClick={() => clearFilters()}>
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Filter */}
              <div className="table-responsive">
                <Table columns={columns} dataSource={filteredData} />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
    </>
  );
};
export default UserLists;

