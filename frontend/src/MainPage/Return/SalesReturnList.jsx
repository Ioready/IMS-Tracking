/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import Tabletop from "../../EntryFile/tabletop"
import { Link } from "react-router-dom";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import {
  ClosesIcon,
  Excel,
  Filter,
  Pdf,
  PlusIcon,
  Printer,
  Search,
  MacbookIcon,
  IphoneIcon,
  search_whites,
  EarpodIcon,
  OrangeImage,
  PineappleImage,
  StawberryImage,
  AvocatImage,
  EyeIcon,
  EditIcon,
  DeleteIcon,
  UnpaidGray,
} from "../../EntryFile/imagePath";
import Swal from "sweetalert2";
import axios from "axios";
import { peopleUrl, userUrl } from "../../Apis/Api";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";

const SalesReturnList = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState({})
  const [loading, setLoading] = useState(true)
  const spinner = LoadingSpinner()

  const togglefilter = (value) => {
    setInputfilter(value);
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
        deleteProduct(id);
      }
    });
  };

  const deleteProduct = async (id) => {
    try {
      // Make DELETE request to backend to delete product with ID
      await axios.delete(`${peopleUrl}/delete-return-sale/${id}`);
      // Optionally update state or fetch new data after deletion
      setData((prevData) => prevData.filter((item) => item._id !== id));
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
  const options = [
    { id: 1, text: "Choose Product", text: "Choose Product" },
    { id: 2, text: "Macbook pro", text: "Macbook pro" },
    { id: 3, text: "Orange", text: "Orange" },
  ];
  const options2 = [
    { id: 1, text: "Choose Category", text: "Choose Category" },
    { id: 2, text: "Computers", text: "Computers" },
    { id: 3, text: "Fruits", text: "Fruits" },
  ];
  const options3 = [
    { id: 1, text: "Choose Sub Category", text: "Choose Sub Category" },
    { id: 2, text: "Computers", text: "Computers" },
  ];
  const options4 = [
    { id: 1, text: "Brand", text: "Brand" },
    { id: 2, text: "N/D", text: "N/D" },
  ];
  const options5 = [
    { id: 1, text: "Price", text: "Price" },
    { id: 2, text: "150.00", text: "150.00" },
  ];

  const [data, setData] = useState([]);

  useEffect(() => {
    const salesList = async () => {
      try {
        await axios.get(`${peopleUrl}/sales-return-list`).then((response) => {
          const datas = response.data
          setData(datas)
          setFilteredData(datas)
        })
        setLoading(false)
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

  const handleFilter = (data) => {
    setFilteredData(data);
  };

  const columns = [
    // {
    //   title: "Product Name",
    //   dataIndex: "productName",
    //   render: (text, record) => (
    //     <div className="productimgname">
    //       <Link  to="#" className="product-img">
    //         <img alt="" src={record.image} />
    //       </Link>
    //       <Link to="#" style={{ fontSize: "15px", marginLeft: "10px" }}>
    //         {record.productName}
    //       </Link>
    //     </div>
    //   ),
    //   sorter: (a, b) => a.productName.length - b.productName.length,
    // },
    {
      title: "Date",
      dataIndex: "startDate",
      sorter: (a, b) => {
        // Function to parse the date string "DD-MM-YYYY" to a Date object
        const parseDate = (dateString) => {
          const parts = dateString.split("-");
          // Month is 0-indexed, so we subtract 1
          return new Date(parts[2], parts[1] - 1, parts[0]);
        };

        // Convert dates to Date objects
        const dateA = parseDate(a.startDate);
        const dateB = parseDate(b.startDate);

        // Compare the dates
        return dateA - dateB;
      },
      key: "startDate"
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      sorter: (a, b) => a.customerName.length - b.customerName.length,
      key: "customerName"
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <span
          className={
            text === "Received"
              ? "badges bg-lightgreen"
              : text == "Pending"
                ? "badges bg-lightred"
                : "badges bg-lightyellow"
          }
        >
          {text}
        </span>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
      key: "status"
    },
    {
      title: "Grand Total ($)",
      dataIndex: "grandTotalNumber",
      sorter: (a, b) => a.grandTotalNumber - b.grandTotalNumber,
      key: "grandTotalNumber"
    },
    {
      title: "Paid ($)",
      dataIndex: "paid",
      sorter: (a, b) => a.paid - b.paid,
      key: "paid"
    },
    {
      title: "Due ($)",
      dataIndex: "dueAmount",
      sorter: (a, b) => a.dueAmount - b.dueAmount,
      key: "dueAmount"
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      render: (text, record) => (
        <span
          className={
            text === "Paid"
              ? "badges bg-lightgreen"
              : text == "Due"
                ? "badges bg-lightred"
                : "badges bg-lightyellow"
          }
        >
          {text}
        </span>
      ),
      sorter: (a, b) => a.payment_status.length - b.payment_status.length,
    },
    {
      title: "Action",
      render: (record) => (
        <>
          {selectedPermission.salesReturnEdit === true ? (
            <Link className="me-3" to={`/dream-pos/return/editsalesreturn-return/${record._id}`}>
              <img src={EditIcon} alt="img" />
            </Link>
          ) : (
            <div></div>
          )}
          {selectedPermission.salesReturnDelete === true ? (
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

  if (loading) {
    return spinner
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Sales Return List</h4>
              <h6>Manage your Returns</h6>
            </div>
            {selectedPermission.salesReturnCreate === true ? (
              <div className="page-btn">
                <Link
                  to="/dream-pos/return/addsalesreturn-return"
                  className="btn btn-added"
                >
                  <img src={PlusIcon} alt="img" className="me-1" />
                  Add New Sales Return
                </Link>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <Tabletop data={data} inputfilter={inputfilter} togglefilter={togglefilter} onFilter={handleFilter} />
              {/* /Filter */}
              <div
                className={`card mb-0 ${inputfilter ? "toggleCls" : ""}`}
                id="filter_inputs"
                style={{ display: inputfilter ? "block" : "none" }}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg-12 col-sm-12">
                      <div className="row">
                        <div className="col-lg col-sm-6 col-12">
                          <div className="form-group">
                            <Select2
                              className="select"
                              data={options}
                              options={{
                                placeholder: "Choose Product",
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg col-sm-6 col-12">
                          <div className="form-group">
                            <Select2
                              className="select"
                              data={options2}
                              options={{
                                placeholder: "Choose Category",
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg col-sm-6 col-12">
                          <div className="form-group">
                            <Select2
                              className="select"
                              data={options3}
                              options={{
                                placeholder: "Choose sub Category",
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg col-sm-6 col-12">
                          <div className="form-group">
                            <Select2
                              className="select"
                              data={options4}
                              options={{
                                placeholder: "Brand",
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg col-sm-6 col-12 ">
                          <div className="form-group">
                            <Select2
                              className="select"
                              data={options5}
                              options={{
                                placeholder: "Price",
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-1 col-sm-6 col-12">
                          <div className="form-group">
                            <a className="btn btn-filters ms-auto">
                              <img src={search_whites} alt="img" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Filter */}
              <div className="table-responsive" id="pdf-content">
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
export default SalesReturnList;
