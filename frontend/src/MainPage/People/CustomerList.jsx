/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import Tabletop from "../../EntryFile/tabletop"
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  ClosesIcon,
  Excel,
  Filter,
  Pdf,
  PlusIcon,
  Printer,
  Search,
  search_whites,
  EditIcon,
  DeleteIcon,
  Thomas,
  Benjamin,
  James,
  Bruklin,
  Beverly,
} from "../../EntryFile/imagePath";
import axios from "axios";
import { peopleUrl, userUrl } from "../../Apis/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const CustomerList = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState({})
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([])
  const [customerCode, setCustomerCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const clearFilters = () => {
    setCustomerCode("1");
    setCustomerName("");
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
        deleteCustomer(id);
      }
    });
  };

  const deleteCustomer = async (id) => {
    try {
      // Make DELETE request to backend to delete product with ID
      await axios.delete(`${peopleUrl}/delete-customer/${id}`);
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

  const handleSearch = (data) => {
    setFilteredData(data);
  };

  const handleFilter = () => {
    let filteredProducts = data.slice();

    if (customerCode) {
      filteredProducts = filteredProducts.filter(
        (product) => product.code.includes(customerCode)
      );
    }

    if (customerName) {
      filteredProducts = filteredProducts.filter(
        (product) => product.customerName.includes(customerName)
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
  }, [data, customerCode, customerName, phone, email]);


  const columns = [
    {
      title: "Customer Name",
      dataIndex: "productName",
      render: (text, record) => (
        <div className="productimgname">
          <Link to="#" style={{ width: "30%" }} className="product-img">
            <img alt="" src={record.image} />
          </Link>
          <Link to="#" style={{ fontSize: "15px", marginLeft: "10px" }}>
            {record.customerName}
          </Link>
        </div>
      ),
      sorter: (a, b) => a.customerName.length - b.customerName.length,
      width: "170px",
      key: "customerName"
    },
    {
      title: "Code",
      dataIndex: "code",
      sorter: (a, b) => a.code - b.code,
      key: "code"
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      sorter: (a, b) => a.customerName.length - b.customerName.length,
      key: "customerName"
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
      key: "email"
    },
    {
      title: "Country",
      dataIndex: "country",
      sorter: (a, b) => a.country.length - b.country.length,
      key: "country"
    },
    {
      title: "Action",
      render: (record) => (
        <>
          {selectedPermission.customerListEdit === true ? (
            <Link className="me-3" to={`/dream-pos/people/editcustomer-people/${record._id}`}>
              <img src={EditIcon} alt="img" />
            </Link>
          ) : (
            <div></div>
          )}
          {selectedPermission.customerListDelete === true ? (
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

  useEffect(() => {
    const peoples = async () => {
      try {
        await axios.get(`${peopleUrl}`).then((response) => {
          const datas = response.data
          setData(datas)
          setFilteredData(datas)
        })
      } catch (error) {
        console.log(error);
      }
    }
    peoples()
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

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Customer List</h4>
              <h6>Manage your Customers</h6>
            </div>
            {selectedPermission.customerListCreate === true ? (
              <div className="page-btn">
                <Link
                  to="/dream-pos/people/addcustomer-people"
                  className="btn btn-added"
                >
                  <img src={PlusIcon} alt="img" className="me-1" />
                  Add Customer
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
                          placeholder="Enter Customer Code"
                          value={customerCode}
                          onChange={(e) => setCustomerCode(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Customer Name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Customer Phone"
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
                          placeholder="Enter Customer Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-1 col-sm-6 col-12  ms-auto">
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
              <div className="table-responsive" id="pdf-content">
                <Table
                  columns={columns}
                  dataSource={filteredData}
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
    </>
  );
};
export default CustomerList;
