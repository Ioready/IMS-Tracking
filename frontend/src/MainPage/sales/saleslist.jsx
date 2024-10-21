/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import Tabletop from "../../EntryFile/tabletop";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import {
  ClosesIcon,
  Excel,
  Filter,
  Pdf,
  Eye1,
  Calendar,
  Printer,
  search_whites,
  Search,
  PlusIcon,
  EditIcon,
  Dollar1,
  plusCircle,
  Download,
  delete1,
  DeleteIcon,
  datepicker,
} from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import axios from "axios";
import { peopleUrl, settingsUrl, userUrl } from "../../Apis/Api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const SalesList = (props) => {
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [reference, setReference] = useState('')
  const [receivedAmount, setreceivedAmount] = useState('')
  const [payingAmount, setPayingAmount] = useState('')
  const [paymentType, setPaymentType] = useState('')
  const [note, setNote] = useState('')
  const [modalId, setModalId] = useState(null);
  const [getPaymentDetails, setGetPaymentDetails] = useState({})
  const [inputfilter, setInputfilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [options1, setOptions1] = useState([])
  const [selectedPermission, setSelectedPermission] = useState({})
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [selectedReference, setSelectedReference] = useState(null);
  const [selectedBiller, setSelectedBiller] = useState(null);

  const history = useHistory()
  const spinner = LoadingSpinner()

  const paymentDetails = { paymentDate, reference, receivedAmount, payingAmount, paymentType, note }

  const togglefilter = (value) => {
    setInputfilter(value);
  };

  const clearFilters = () => {
    setSelectedCreator("1");
    setSelectedReference("1");
    setSelectedBiller("1");
  };


  const [data, setData] = useState([]);
  console.log(data, "Dataas of sale");
  const salesList = async () => {
    try {
      await axios.get(`${peopleUrl}/sales`).then((response) => {
        const datas = response.data
        setData(datas)
        setFilteredData(datas)
      })
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    salesList()
  }, [])


  const optionsCreator = data.map(item => ({ id: item.customerName, text: item.customerName }));
  const optionsReference = data.map(item => ({ id: item.reference, text: item.reference }));
  const optionsBiller = data.map(item => ({ id: item.biller, text: item.biller }));

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        await axios.get(`${settingsUrl}/get-payment-settings`).then((response) => {
          const datas = response.data
            .filter(payment => payment.paymentStatus === true)
            .map((payment) => ({
              id: payment._id,
              text: payment.paymentType
            }));
          setOptions1(datas)
        })
      } catch (error) {
        console.log(error);
      }
    }
    fetchOptions()
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

  const createPayment = async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      await axios.put(`${peopleUrl}/create-payment/${modalId}`, paymentDetails);
      setLoading(false)
      salesList()
    } catch (error) {
      console.log(error);
    }
  };

  const editPayment = async () => {
    setReference(getPaymentDetails.reference);
    setreceivedAmount(getPaymentDetails.receivedAmount);
    setPayingAmount(getPaymentDetails.payingAmount);
    setPaymentType(getPaymentDetails.paymentType);
    setNote(getPaymentDetails.note);

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
      await axios.delete(`${peopleUrl}/delete-sale/${id}`);
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

  const confirmText2 = (id) => {
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
        deletePayment(id);
      }
    });
  };

  const deletePayment = async (id) => {
    try {
      // Make DELETE request to backend to delete product with ID
      await axios.delete(`${peopleUrl}/delete-payment/${id}`);
      // Optionally update state or fetch new data after deletion
      setData((prevData) => prevData.filter((item) => item._id !== id));
      Swal.fire({
        type: "success",
        title: "Deleted!",
        text: "Your file has been deleted.",
        confirmButtonClass: "btn btn-success",
      })
      history.push('/dream-pos/sales/saleslist')
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

    if (selectedCreator && selectedCreator !== "1") {
      filteredProducts = filteredProducts.filter(
        (supplier) => supplier.customerName === selectedCreator
      );
    }

    if (selectedReference && selectedReference !== "1") {
      filteredProducts = filteredProducts.filter(
        (purchase) => purchase.reference === selectedReference
      );
    }

    if (selectedBiller && selectedBiller !== "1") {
      filteredProducts = filteredProducts.filter(
        (purchase) => purchase.biller === selectedBiller
      );
    }

    setFilteredData(filteredProducts);
  };

  useEffect(() => {
    handleFilter();
  }, [data, selectedCreator, selectedReference, selectedBiller]);



  const columns = [
    {
      title: "Customer name",
      dataIndex: "customerName",
      sorter: (a, b) => a.customerName.length - b.customerName.length,
      key: "customerName",
    },
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
      key: "startDate",
    },
    {
      title: "Reference",
      dataIndex: "reference",
      sorter: (a, b) => a.reference.length - b.reference.length,
      key: "reference",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <>
          {text === "Pending" && (
            <span className="badges bg-lightred">{text}</span>
          )}
          {text === "Inprogress" && (
            <span className="badges" style={{ backgroundColor: '#40A2E3' }}>{text}</span>
          )}
          {text === "Completed" && (
            <span className="badges bg-lightgreen">{text}</span>
          )}
        </>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
      key: "status",
    },
    {
      title: "Payment",
      dataIndex: "payment_status",
      render: (text, record) => (
        <>
          {text === "Paid" && (
            <span className="badges bg-lightgreen">{text}</span>
          )}
          {text === "Due" && <span className="badges bg-lightred">{text}</span>}
        </>
      ),
      sorter: (a, b) => a.payment_status.length - b.payment_status.length,
      key: "payment_status",
    },
    {
      title: "Total",
      dataIndex: "grandTotalNumber",
      sorter: (a, b) => a.grandTotalNumber - b.grandTotalNumber,
      key: "grandTotalNumber",
    },
    {
      title: "Paid",
      dataIndex: "payingAmount",
      render: (text, record) => (
        <>
          {text > 0 && <div className="text-green">{text}</div>}
          {text === 0 && <div>{text}</div>}
        </>
      ),
      sorter: (a, b) => a.payingAmount - b.payingAmount,
      key: "payingAmount",
    },
    {
      title: "Due",
      dataIndex: "dueAmount",
      render: (text, record) => (
        <>
          {text > 0 && <div className="text-red">{text}</div>}
          {text === 0 && <div>{text}</div>}
        </>
      ),
      sorter: (a, b) => a.dueAmount - b.dueAmount,
      key: "dueAmount",
    },
    {
      title: "Biller",
      dataIndex: "biller",
      sorter: (a, b) => a.biller.length - b.biller.length,
      key: "biller",
    },
    {
      title: "Action",
      render: (text, record) => (
        <>
          <div className="text-center">
            <Link
              className="action-set"
              to="#"
              data-bs-toggle="dropdown"
              aria-expanded="true"
              onClick={() => setModalId(record._id)}
            >
              <i className="fa fa-ellipsis-v" aria-hidden="true" />
            </Link>
            <ul className="dropdown-menu">
              <li>
                <Link
                  to={`/dream-pos/sales/sales-details/${record._id}`}
                  className="dropdown-item"
                >
                  <img src={Eye1} className="me-2" alt="img" />
                  Sale Detail
                </Link>
              </li>
              {selectedPermission.saleEdit === true ? (
                <li>
                  <Link
                    to={`/dream-pos/sales/edit-sales/${record._id}`}
                    className="dropdown-item"
                  >
                    <img src={EditIcon} className="me-2" alt="img" />
                    Edit Sale
                  </Link>
                </li>
              ) : (
                <div></div>
              )}
              <li>
                <Link
                  to="#"
                  className="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#showpayment"
                  onClick={() => setGetPaymentDetails(record)}
                >
                  <img src={Dollar1} className="me-2" alt="img" />
                  Show Payments
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#createpayment"
                  onClick={() => setModalId(record._id)}
                >
                  <img src={plusCircle} className="me-2" alt="img" />
                  Create Payment
                </Link>
              </li>
              {/* <li>
                <Link to="#" className="dropdown-item">
                  <img src={Download} className="me-2" alt="img" />
                  Download pdf
                </Link>
              </li> */}
              {selectedPermission.saleDelete === true ? (
                <li>
                  <Link
                    to="#"
                    className="dropdown-item confirm-text"
                    onClick={() => confirmText(record._id)}
                  >
                    <img src={delete1} className="me-2" alt="img" />
                    Delete Sale
                  </Link>
                </li>
              ) : (
                <div></div>
              )}
            </ul>
          </div>
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
              <h4>Sales List</h4>
              <h6>Manage your Sales</h6>
            </div>
            {selectedPermission.saleCreate === true ? (
              <div className="page-btn">
                <Link to="/dream-pos/sales/add-sales" className="btn btn-added">
                  <img src={PlusIcon} alt="img" className="me-1" />
                  Add Sales
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
                    <div className="col-lg col-sm-6 col-12">
                      <div className="form-group">
                        <label>Creator</label>
                        <Select2
                          className="select"
                          data={optionsCreator}
                          options={{
                            placeholder: "Choose Creator",
                          }}
                          onSelect={(event) => {
                            const selectedCreator = event.params.data.id;
                            setSelectedCreator(selectedCreator);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg col-sm-6 col-12">
                      <div className="form-group">
                        <label>Reference</label>
                        <Select2
                          className="select"
                          data={optionsReference}
                          options={{
                            placeholder: "Choose Reference",
                          }}
                          onSelect={(event) => {
                            const selectedReference = event.params.data.id;
                            setSelectedReference(selectedReference);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg col-sm-6 col-12">
                      <div className="form-group">
                        <label>Biller</label>
                        <Select2
                          className="select"
                          data={optionsBiller}
                          options={{
                            placeholder: "Choose Biller",
                          }}
                          onSelect={(event) => {
                            const selectedBiller = event.params.data.id;
                            setSelectedBiller(selectedBiller);
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
              {/* /Filter */}
              <div className="table-responsive" id="pdf-content">
                <Table
                  props={props} columns={columns}
                  dataSource={filteredData}
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
      <>
        <div
          className="modal fade"
          id="showpayment"
          tabIndex={-1}
          aria-labelledby="showpayment"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Show Payments</h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Reference</th>
                        <th>Amount </th>
                        <th>Paid By </th>
                        <th>Paid By </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bor-b1">
                        <td>{getPaymentDetails.paymentDate}</td>
                        <td>{getPaymentDetails.reference}</td>
                        <td>${getPaymentDetails.grandTotalNumber}</td>
                        <td>{getPaymentDetails.payingAmount}</td>
                        <td>
                          {/* <Link className="me-2" to="#">
                            <img src={Printer} alt="img" />
                          </Link> */}
                          <Link
                            className="me-2"
                            to="#"
                            data-bs-target="#editpayment"
                            data-bs-toggle="modal"
                            data-bs-dismiss="modal"
                          >
                            <img src={EditIcon} alt="img" onClick={editPayment} />
                          </Link>
                          <Link className="me-2 confirm-text" onClick={() => confirmText2(modalId)} to="#">
                            <img src={DeleteIcon} alt="img" />
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* show payment Modal */}
        {/* show payment Modal */}
        <div
          className="modal fade"
          id="createpayment"
          tabIndex={-1}
          aria-labelledby="createpayment"
          aria-hidden="true"
        >
          <form action="" onSubmit={createPayment}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create Payment</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Customer</label>
                        <div className="input-groupicon">
                          <DatePicker
                            selected={paymentDate}
                            onChange={(date) => setPaymentDate(date)}
                          />
                          <div className="addonset">
                            <img src={Calendar} alt="img" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Reference</label>
                        <input type="text" name="reference" value={reference}
                          onChange={(e) => setReference(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Received Amount</label>
                        <input type="text" name="receivedAmount" value={receivedAmount}
                          onChange={(e) => setreceivedAmount(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Paying Amount</label>
                        <input type="text" name="payingAmount" value={payingAmount}
                          onChange={(e) => setPayingAmount(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Payment type</label>
                        <Select2
                          className="select"
                          data={options1}
                          value={paymentType}
                          onChange={(e) => setPaymentType(e.target.value)}
                          options={{
                            placeholder: "Choose",
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group mb-0">
                        <label>Note</label>
                        <textarea value={note} defaultValue={''}
                          onChange={(e) => setNote(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-submit" data-bs-dismiss="modal">
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-cancel"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        {/* show payment Modal */}
        {/* edit payment Modal */}
        <div
          className="modal fade"
          id="editpayment"
          tabIndex={-1}
          aria-labelledby="editpayment"
          aria-hidden="true"
        >
          <form action="" onSubmit={createPayment}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Payment</h5>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Customer</label>
                        <div className="input-groupicon">
                          <DatePicker
                            selected={paymentDate}
                            onChange={(date) => setPaymentDate(date)}
                          />
                          <div className="addonset">
                            <img src={datepicker} alt="img" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Reference No</label>
                        <input type="text" name="reference" value={reference}
                          onChange={(e) => setReference(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Received Amount</label>
                        <input type="text" name="receivedAmount" value={receivedAmount}
                          onChange={(e) => setreceivedAmount(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Paying Amount</label>
                        <input type="text" name="payingAmount" value={payingAmount}
                          onChange={(e) => setPayingAmount(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="form-group">
                        <label>Payment type</label>
                        <Select2
                          className="select"
                          data={options1}
                          value={paymentType}
                          onChange={(e) => setPaymentType(e.target.value)}
                          options={{
                            placeholder: "Choose",
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group mb-0">
                        <label>Note</label>
                        <textarea value={note} defaultValue={''}
                          onChange={(e) => setNote(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-submit" data-bs-dismiss="modal">
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-cancel"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </>
    </>
  );
};

export default SalesList;
