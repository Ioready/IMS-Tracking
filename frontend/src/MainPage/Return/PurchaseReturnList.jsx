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
  Calendar,
} from "../../EntryFile/imagePath";
import axios from "axios";
import { peopleUrl, purchaseUrl, userUrl } from "../../Apis/Api";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { DatePicker } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const PurchaseReturnList = () => {
  const [startDate, setStartDate] = useState("");
  const [inputfilter, setInputfilter] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState({})
  const [filteredData, setFilteredData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true)
  const spinner = LoadingSpinner()

  console.log('start: ', startDate);

  const togglefilter = (value) => {
    setInputfilter(value);
  };

  const options = [
    { id: 1, text: "Choose Supplier" },
    ...suppliers.map((supplier) => ({
      id: supplier.supplierName,
      text: supplier.supplierName,
    })),
  ];
  const options2 = [
    { id: "Choose Status", text: "Choose Status" },
    { id: "Pending", text: "Pending" },
    { id: "Received", text: "Received" },
  ];

  const [selectedSupplier, setSelectedSupplier] = useState("1");
  const [selectedStatus, setSelectedStatus] = useState("1");
  const [referenceFilter, setReferenceFilter] = useState("");
  const [data, setData] = useState([]);

  const clearFilters = () => {
    setSelectedSupplier("1");
    setSelectedStatus("1");
    setReferenceFilter("");
    setStartDate("");
  };

  useEffect(() => {
    const purchaseReturnList = async () => {
      try {
        await axios.get(`${purchaseUrl}/return`).then((response) => {
          const datas = response.data.purchase
          setData(datas)
          setFilteredData(datas)
        })
        setLoading(false)
      } catch (error) {
        console.log(error);
        // history.push('/error-500')
      }
    }
    purchaseReturnList()
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

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        await axios.get(`${peopleUrl}/suppliers`).then((response) => {
          const datas = response.data
          setSuppliers(datas)
        })
      } catch (error) {
        console.log(error);
      }
    }
    fetchSuppliers()
  }, [])

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
      await axios.delete(`${purchaseUrl}/return/delete-purchase/${id}`);
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

  const handleSearch = (data) => {
    setFilteredData(data);
  };

  const handleFilter = () => {
    let filteredProducts = data.slice();

    if (selectedSupplier && selectedSupplier !== "1") {
      filteredProducts = filteredProducts.filter(
        (supplier) => supplier.supplier === selectedSupplier
      );
    }

    if (selectedStatus && selectedStatus !== "1") {
      filteredProducts = filteredProducts.filter(
        (purchase) => purchase.status === selectedStatus
      );
    }

    if (referenceFilter) {
      filteredProducts = filteredProducts.filter(
        (product) => product.referenceNumber.includes(referenceFilter)
      );
    }

    if (startDate && typeof startDate === 'object') {

      filteredProducts = filteredProducts.filter((purchase) => {
        const purchaseDate = purchase.quotationDate;

        // Check if the purchaseDate is a valid date in "DD-MM-YYYY" format
        if (!isValidDate(purchaseDate)) {
          return false;
        }

        // Convert startDate to "DD-MM-YYYY" format
        const formattedStartDate = formatDate(startDate);

        // Compare the dates
        return purchaseDate === formattedStartDate;
      });
    }

    setFilteredData(filteredProducts);
  };

  // Function to check if a date is valid in "DD-MM-YYYY" format
  const isValidDate = (dateString) => {
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    return regex.test(dateString);
  };

  // Function to format date to "DD-MM-YYYY"
  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);

    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    handleFilter();
  }, [data, selectedSupplier, selectedStatus, referenceFilter, startDate]);



  const columns = [
    // {
    //   title: "Image",
    //   dataIndex: "image",
    //   render: (text, record) => (
    //     <div className="productimgname">
    //       <Link to="#" className="product-img">
    //         <img alt="" src={record.image} />
    //       </Link>
    //     </div>
    //   ),
    //   sorter: (a, b) => a.productName.length - b.productName.length,
    // },
    {
      title: "Date",
      dataIndex: "quotationDate",
      sorter: (a, b) => {
        // Function to parse the date string "DD-MM-YYYY" to a Date object
        const parseDate = (dateString) => {
          const parts = dateString.split("-");
          // Month is 0-indexed, so we subtract 1
          return new Date(parts[2], parts[1] - 1, parts[0]);
        };

        // Convert dates to Date objects
        const dateA = parseDate(a.quotationDate);
        const dateB = parseDate(b.quotationDate);

        // Compare the dates
        return dateA - dateB;
      },
      key: "quotationDate"
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
      sorter: (a, b) => a.supplier.length - b.supplier.length,
      key: "supplier"
    },
    {
      title: "Reference",
      dataIndex: "referenceNumber",
      sorter: (a, b) => a.referenceNumber.length - b.referenceNumber.length,
      key: "referenceNumber"
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
    // {
    //   title: "Paid ($)",
    //   dataIndex: "paid",
    //   sorter: (a, b) => a.paid.length - b.paid.length,
    // },
    // {
    //   title: "Due ($)",
    //   dataIndex: "dueAmount",
    //   sorter: (a, b) => a.due.length - b.due.length,
    // },
    // {
    //   title: "Payment Status",
    //   dataIndex: "payment_status",
    //   render: (text, record) => (
    //     <span
    //       className={
    //         text === "Paid"
    //           ? "badges bg-lightgreen"
    //           : text == "Received"
    //           ? "badges bg-lightred"
    //           : "badges bg-lightyellow"
    //       }
    //     >
    //       {text}
    //     </span>
    //   ),
    //   sorter: (a, b) => a.paymentStatus.length - b.paymentStatus.length,
    // },
    {
      title: "Action",
      render: (record) => (
        <>
          {selectedPermission.purchaseReturnEdit === true ? (
            <Link className="me-3" to={`/dream-pos/return/editpurchasereturn-return/${record._id}`}>
              <img src={EditIcon} alt="img" />
            </Link>
          ) : (
            <div></div>
          )}
          {selectedPermission.purchaseReturnDelete === true ? (
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
              <h4>Purchase Return List</h4>
              <h6>Manage your Returns</h6>
            </div>
            {selectedPermission.purchaseReturnCreate === true ? (
              <div className="page-btn">
                <Link
                  to="/dream-pos/return/addpurchasereturn-return"
                  className="btn btn-added"
                >
                  <img src={PlusIcon} alt="img" className="me-1" />
                  Add Purchase Return
                </Link>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <Tabletop data={data} inputfilter={inputfilter} togglefilter={togglefilter} onFilter={handleSearch} />
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
                            <div className="input-groupicon">
                              <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                              />
                              <div className="addonset">
                                <img src={Calendar} alt="img" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg col-sm-6 col-12">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Reference"
                              value={referenceFilter}
                              onChange={(e) => setReferenceFilter(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-lg col-sm-6 col-12">
                          <div className="form-group">
                            <Select2
                              className="select"
                              data={options}
                              options={{
                                placeholder: selectedSupplier === "1" ? "Choose Supplier" : options.find(option => option.id === selectedSupplier)?.text,
                              }}
                              onSelect={(event) => {
                                const selectedSupplier = event.params.data.id;
                                setSelectedSupplier(selectedSupplier);
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
                                placeholder: selectedStatus === "1" ? "Choose Status" : options2.find(option => option.id === selectedStatus)?.text,
                              }}
                              onSelect={(event) => {
                                const selectedStatus = event.params.data.id;
                                setSelectedStatus(selectedStatus);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-1 col-sm-6 col-12">
                          <div className="form-group">
                            <button className="btn btn-filters ms-auto" onClick={() => clearFilters()}>
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
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
export default PurchaseReturnList;
