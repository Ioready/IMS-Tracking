/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PlusIcon,
  Search,
  Excel,
  Printer,
  Pdf,
  DeleteIcon,
  EditIcon,
} from "../../EntryFile/imagePath";
import Table from "../../EntryFile/datatable";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import Swal from "sweetalert2";
import axios from "axios";
import { settingsUrl } from "../../Apis/Api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CurrencySettings = () => {
  const [currencyName, setCurrencyName] = useState('')
  const [currencyCode, setCurrencyCode] = useState('')
  const [currencySymbol, setCurrencySymbol] = useState('')
  const [currencyStatus, setCurrencyStatus] = useState('')
  // const [submitCount, setSubmitCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalId, setModalId] = useState('')
  const [currencyData, setCurrencyData] = useState({})
  const history = useHistory()
  const spinner = LoadingSpinner()

  const currencyDatas = { currencyName, currencyCode, currencySymbol, currencyStatus }

  const options = [
    { id: true, text: "Active" },
    { id: false, text: "Inactive" },
  ];
  const [data, setData] = useState([
    {
      id: 1,
      name: "India - Indian rupee",
      code: "INR",
      symbol: "₹",
      Status: "checkbox",
    },
    {
      id: 2,
      name: "US dollar",
      code: "USD",
      symbol: "$",
      Status: "checkbox",
    },
  ]);

    const handlePdfDownload = () => {
    const input = document.getElementById('pdf-content');

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', [canvas.width, canvas.height]);
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('currency.pdf');
    });
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const paymentSettingsList = async () => {
      try {
        setLoading(true);
        await axios.get(`${settingsUrl}/get-currency`).then((response) => {
          const datas = response.data
          setData(datas)
        })
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
    paymentSettingsList()
  }, [])

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(`${settingsUrl}/get-currency-by-id/${modalId}`);
        setCurrencyData(response.data);
      } catch (error) {
        console.log(error);
        // history.push('/error-500')
      }
    };
    fetchPaymentDetails();
  }, [modalId]);

  useEffect(() => {
    if (currencyData) {
      setCurrencyName(currencyData.currencyName);
      setCurrencyCode(currencyData.currencyCode);
      setCurrencySymbol(currencyData.currencySymbol);
      setCurrencyStatus(currencyData.currencyStatus);
    }
  }, [currencyData]);

  const addCurrency = async (e) => {
    try {
      e.preventDefault();
      await axios.post(`${settingsUrl}/add-currency`, currencyDatas);
      // setSubmitCount((prevCount) => prevCount + 1);
      history.push('/dream-pos/settings/currencysettings');
    } catch (error) {
      console.log(error);
    }
  }

  const editCurrency = async (e) => {
    try {
      e.preventDefault();
      await axios.put(`${settingsUrl}/edit-currency/${modalId}`, currencyDatas);
      // setSubmitCount((prevCount) => prevCount + 1);
      history.push('/dream-pos/settings/currencysettings');
    } catch (error) {
      console.log(error);
    }
  }

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
        deleteCurrency(id);
      }
    });
  };

  const deleteCurrency = async (id) => {
    try {
      // Make DELETE request to backend to delete product with ID
      await axios.delete(`${settingsUrl}/delete-currency/${id}`);
      // Optionally update state or fetch new data after deletion
      setData((prevData) => prevData.filter((item) => item._id !== id));
      Swal.fire({
        type: "success",
        title: "Deleted!",
        text: "Your file has been deleted.",
        confirmButtonClass: "btn btn-success",
      })
      // history.push('/dream-pos/settings/currencysettings')
    } catch (error) {
      console.log(error);
      history.push('/error-500')
    }
  };


  const columns = [
    {
      title: "Currency Name",
      dataIndex: "currencyName",
      render: (text, record) => <>{text}</>,
      // sorter: (a, b) => a.currencyName.length - b.currencyName.length,
      // key: "currencyName"
    },
    {
      title: "Currency Code",
      dataIndex: "currencyCode",
      render: (text, record) => <div className="text-center">{text}</div>,
      // sorter: (a, b) => a.Code.length - b.Code.length,
      // key: "currencyName"
    },
    {
      title: "Currency Symbol",
      dataIndex: "currencySymbol",
      render: (text, record) => <div className="text-center">{text}</div>,
      // sorter: (a, b) => a.Symbol.length - b.Symbol.length,
    },
    {
      title: "Status",
      dataIndex: "currencyStatus",
      render: (text, record) => (
        <>
          <div className="status-toggle d-flex justify-content-between align-items-center">
            <input
              type="checkbox"
              id="user1"
              className="check"
              checked={record.currencyStatus}
            />
            <label htmlFor="user1" className="checktoggle">
              checkbox
            </label>
          </div>
        </>
      ),
      // sorter: (a, b) => a.Status.length - b.Status.length,
    },
    {
      title: "Action",
      className: "text-end",
      render: (text, record) => (
        <div className="text-end">
          <a
            className="me-3"
            href="#"
            data-bs-toggle="modal"
            data-bs-target="#editpayment"
            onClick={() => setModalId(record._id)}
          >
            <img src={EditIcon} alt="img" />
          </a>
          <Link className="me-3 confirm-text" to="#" onClick={() => confirmText(record._id)}>
            <img src={DeleteIcon} alt="img" />
          </Link>
        </div>
      ),
      // sorter: (a, b) => a.Amount.length - b.Amount.length,
    },
  ];

  if (loading) {
    return spinner
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {data.length === 0 ? (
            <div className="page-header">
              <div className="page-title">
                <h4>Currency Settings</h4>
                <h6>Manage Currency Settings</h6>
              </div>
              <div className="page-btn">
                <a
                  className="btn btn-added"
                  data-bs-toggle="modal"
                  data-bs-target="#addpayment"
                >
                  <img src={PlusIcon} alt="img" className="me-2" />
                  Add New Currency
                </a>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <div className="table-top">
                <div className="search-set">
                  <div className="search-input">
                    <input
                      className="form-control form-control-sm search-icon"
                      type="search"
                      placeholder="Search..."
                    />
                    <a className="btn btn-searchset">
                      <img src={Search} alt="img" />
                    </a>
                  </div>
                </div>
                <div className="wordset">
                  <ul>
                    <li>
                      <a
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="pdf"
                        onClick={handlePdfDownload}
                      >
                        <img src={Pdf} alt="img" />
                      </a>
                    </li>
                    {/* <li>
                      <a
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="excel"
                      >
                        <img src={Excel} alt="img" />
                      </a>
                    </li> */}
                    <li>
                      <a
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="print"
                        onClick={handlePrint}
                      >
                        <img src={Printer} alt="img" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="table-responsive" id="pdf-content">
                <Table
                  columns={columns}
                  dataSource={data}
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
      {/* add Modal */}
      <>
        <div
          className="modal fade"
          id="addpayment"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Currency </h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form action="" onSubmit={addCurrency}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          Currency Name<span className="manitory">*</span>
                        </label>
                        <input type="text" name="orderTax" value={currencyName}
                          onChange={(e) => setCurrencyName(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label>Currency Code</label>
                        <input type="text" name="orderTax" value={currencyCode}
                          onChange={(e) => setCurrencyCode(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          Currency Symbol<span className="manitory">*</span>
                        </label>
                        <input type="text" name="orderTax" value={currencySymbol}
                          onChange={(e) => setCurrencySymbol(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group mb-0">
                        <label>Status</label>
                        <Select2
                          className="select"
                          data={options}
                          value={currencyStatus}
                          onChange={(e) => setCurrencyStatus(e.target.value)}
                          options={{
                            placeholder: "Choose Status",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-submit" data-bs-dismiss="modal">
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="btn btn-cancel"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* edit Modal */}
        <div
          className="modal fade"
          id="editpayment"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Currency</h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form action="" onSubmit={editCurrency}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          Currency Name<span className="manitory">*</span>
                        </label>
                        <input type="text" name="orderTax" value={currencyName}
                          onChange={(e) => setCurrencyName(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          Currency Code<span className="manitory">*</span>
                        </label>
                        <input type="text" name="orderTax" value={currencyCode}
                          onChange={(e) => setCurrencyCode(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          Currency Symbol<span className="manitory">*</span>
                        </label>
                        <input type="text" name="orderTax" value={currencySymbol}
                          onChange={(e) => setCurrencySymbol(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group mb-0">
                        <label>Status</label>
                        <Select2
                          className="select"
                          data={options}
                          value={currencyStatus}
                          onChange={(e) => setCurrencyStatus(e.target.value)}
                          options={{
                            placeholder: "Choose Status",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-submit" data-bs-dismiss="modal">
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-cancel"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default CurrencySettings;
