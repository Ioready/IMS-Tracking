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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Taxrates = () => {
  const [taxName, setTaxName] = useState('')
  const [taxRate, setTaxRate] = useState('')
  const [taxStatus, setTaxStatus] = useState('')
  const [modalId, setModalId] = useState('')
  const [taxData, setTaxData] = useState({})
  const history = useHistory()

  const taxRateDatas = { taxName, taxRate, taxStatus }

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
      pdf.save('tax_rates.pdf');
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const [data, setData] = useState([]);

  console.log('data: ', data);

  const paymentSettingsList = async () => {
    try {
      await axios.get(`${settingsUrl}/taxrates`).then((response) => {
        const datas = response.data
        setData(datas)
      })
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    paymentSettingsList()
  }, [])

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(`${settingsUrl}/get-taxrates/${modalId}`);
        setTaxData(response.data);
      } catch (error) {
        console.log(error);
        // history.push('/error-500')
      }
    };
    fetchPaymentDetails();
  }, [modalId]);

  useEffect(() => {
    if (taxData) {
      setTaxName(taxData.taxName);
      setTaxRate(taxData.taxRate);
      setTaxStatus(taxData.taxStatus)
    }
  }, [taxData]);

  const addTax = async (e) => {
    try {
      e.preventDefault();
      await axios.post(`${settingsUrl}/taxrates`, taxRateDatas);
      // setSubmitCount((prevCount) => prevCount + 1);
      history.push('/dream-pos/settings/taxrates');
    } catch (error) {
      console.log(error);
    }
  }

  const editTax = async (e) => {
    try {
      e.preventDefault();
      await axios.put(`${settingsUrl}/taxrates/${modalId}`, taxRateDatas);
      // setSubmitCount((prevCount) => prevCount + 1);
      history.push('/dream-pos/settings/taxrates');
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
        deleteTax(id);
      }
    });
  };

  const deleteTax = async (id) => {
    try {
      // Make DELETE request to backend to delete product with ID
      await axios.delete(`${settingsUrl}/taxrates/${id}`);
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
      title: "Tax Name",
      className: "text-center",
      dataIndex: "taxName",
      render: (text, record) => <div className="text-center">{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Tax (%)",
      dataIndex: "taxRate",
      render: (text, record) => <div>{text}</div>,
      // sorter: (a, b) => a.Tax.length - b.Tax.length,
    },
    {
      title: "Status",
      dataIndex: "taxStatus",
      render: (text, record) => (
        <>
          <div className="status-toggle d-flex justify-content-between align-items-center">
            <input
              type="checkbox"
              id="user1"
              className="check"
              checked={record.taxStatus}
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

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {data.length === 0 ? (
            <div className="page-header">
              <div className="page-title">
                <h4>Tax Rates</h4>
                <h6>Manage Tax Rates</h6>
              </div>
              <div className="page-btn">
                <a
                  className="btn btn-added"
                  data-bs-toggle="modal"
                  data-bs-target="#addpayment"
                >
                  <img src={PlusIcon} alt="img" className="me-2" />
                  Add New Tax Rates
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
                <h5 className="modal-title">Add TAX </h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form action="" onSubmit={addTax}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          Tax Name<span className="manitory">*</span>
                        </label>
                        <input type="text" name="orderTax" value={taxName}
                          onChange={(e) => setTaxName(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          Tax Rate(%)<span className="manitory">*</span>
                        </label>
                        <input type="text" name="orderTax" value={taxRate}
                          onChange={(e) => setTaxRate(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group mb-0">
                        <label>Status</label>
                        <Select2
                          className="select"
                          data={options}
                          value={taxStatus}
                          onChange={(e) => setTaxStatus(e.target.value)}
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
                <h5 className="modal-title">Edit Tax</h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form action="" onSubmit={editTax}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          Tax Name<span className="manitory">*</span>
                        </label>
                        <input type="text" name="orderTax" value={taxName}
                          onChange={(e) => setTaxName(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          Tax Rate(%)<span className="manitory">*</span>
                        </label>
                        <input type="text" name="orderTax" value={taxRate}
                          onChange={(e) => setTaxRate(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group mb-0">
                        <label>Status</label>
                        <Select2
                          className="select"
                          data={options}
                          value={taxStatus}
                          onChange={(e) => setTaxStatus(e.target.value)}
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

export default Taxrates;
