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
  Filter,
  ClosesIcon,
} from "../../EntryFile/imagePath";
import Table from "../../EntryFile/datatable";
import Select2 from "react-select2-wrapper";
import Swal from "sweetalert2";
import "react-select2-wrapper/css/select2.css";
import axios from "axios";
import { settingsUrl } from "../../Apis/Api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PaymentSettings = () => {
  const [paymentType, setPaymentType] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [modalId, setModalId] = useState('')
  const [data, setData] = useState([]);
  const [paymentData, setPaymentData] = useState({});
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const history = useHistory()

  const settingsDatas = { paymentType, paymentStatus }

  const options = [
    { id: true, text: "Active" },
    { id: false, text: "Inactive" },
  ];

  const handlePdfDownload = () => {
    const input = document.getElementById('pdf-content');

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', [canvas.width, canvas.height]);
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('payment.pdf');
    });
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const paymentSettingsList = async () => {
      try {
        await axios.get(`${settingsUrl}/get-payment-settings`).then((response) => {
          const datas = response.data
          setData(datas)
          setFilteredData(datas);
        })
      } catch (error) {
        console.log(error);
      }
    }
    paymentSettingsList()
  }, [data])
  
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(`${settingsUrl}/get-payment-settings-by-id/${modalId}`);
        setPaymentData(response.data);
      } catch (error) {
        console.log(error);
        // history.push('/error-500')
      }
    };
    fetchPaymentDetails();
  }, [modalId]);

  useEffect(() => {
    if (paymentData) {
      setPaymentType(paymentData.paymentType);
      setPaymentStatus(paymentData.paymentStatus);
    }
  }, [paymentData]);

  const addPayment = async (e) => {
    try {
      e.preventDefault();
      await axios.post(`${settingsUrl}/add-payment-settings`, settingsDatas);
      history.push('/dream-pos/settings/paymentsettings');
    } catch (error) {
      console.log(error);
    }
  }

  const editPayment = async (e) => {
    try {
      e.preventDefault();
      await axios.put(`${settingsUrl}/edit-payment-settings/${modalId}`, settingsDatas);
      history.push('/dream-pos/settings/paymentsettings');
    } catch (error) {
      console.log(error);
    }
  }

  // const handleToggle = async (id) => {
  //   const newStatus = !paymentStatus;
  //   setPaymentStatus(newStatus);
  //   await axios.put(`${settingsUrl}/edit-payment-settings/${id}`, settingsDatas);
  //   // Call backend API to update database
  //   // updateDatabase(newStatus);
  // };

  
  useEffect(() => {
    const fetchData = async () => {
      const filteredDatas = data.filter((item) => {
        return Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      setFilteredData(filteredDatas)
    }
    fetchData()
  }, [data, searchTerm]);


  const columns = [
    {
      title: "Payment Type Name",
      dataIndex: "paymentType",
      className: "text-center",
      render: (text, record) => <div className="text-center">{text}</div>,
      sorter: (a, b) => a.paymentType.length - b.paymentType.length,
      key: "paymentType"
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      render: (text, record) => (
        <>
          <div className="status-toggle d-flex justify-content-between align-items-center">
            <input
              type="checkbox"
              id="user1"
              className="check"
              checked={record.paymentStatus}
            />
            <label htmlFor="user1" className="checktoggle">
              checkbox
            </label>
          </div>
        </>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
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
            onClick={()=> setModalId(record._id)}
          >
            <img src={EditIcon} alt="img" />
          </a>
          {/* <Link className="me-3 confirm-text" to="#" onClick={confirmText}>
            <img src={DeleteIcon} alt="img" />
          </Link> */}
        </div>
      ),
      // sorter: (a, b) => a.Amount.length - b.Amount.length,
    },
  ];
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Payment Settings</h4>
              <h6>Manage Payment Settings</h6>
            </div>
            <div className="page-btn">
              <a
                className="btn btn-added"
                data-bs-toggle="modal"
                data-bs-target="#addpayment"
              >
                <img src={PlusIcon} alt="img" className="me-2" />
                Add Payment Settings
              </a>
            </div>
          </div>
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
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                  dataSource={filteredData}
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
      {/* add Modal */}
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
              <h5 className="modal-title">Add payment type</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <form action="" onSubmit={addPayment}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label>Payment Name</label>
                      <input type="text" name="orderTax" value={paymentType}
                        onChange={(e) => setPaymentType(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group mb-0">
                      <label>Status</label>
                      <Select2
                        className="select"
                        data={options}
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        options={{
                          placeholder: "Choose Status",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer ">
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
              <h5 className="modal-title">Edit payment type</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <form action="" onSubmit={editPayment}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label>Payment Name</label>
                      <input type="text" name="orderTax" value={paymentType}
                        onChange={(e) => setPaymentType(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group mb-0">
                      <label>Status</label>
                      <Select2
                        className="select"
                        data={options}
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
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
  );
};

export default PaymentSettings;
