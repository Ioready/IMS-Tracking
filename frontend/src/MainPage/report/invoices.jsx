/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
// import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import * as XLSX from 'xlsx';
import { pdfjs } from 'react-pdf';
import html2canvas from 'html2canvas';
import "react-datepicker/dist/react-datepicker.css";
import {
  ClosesIcon,
  Excel,
  Filter,
  Pdf,
  Calendar,
  Printer,
  search_whites,
  Search,
  PlusIcon,
  EditIcon,
  DeleteIcon
} from "../../EntryFile/imagePath";
import axios from "axios";
import { peopleUrl } from "../../Apis/Api";
import jsPDF from "jspdf";
import Swal from "sweetalert2";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { Link } from "feather-icons-react/build/IconComponents";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Sales = () => {
  const [startDate, setStartDate] = useState('');
  const [startDate1, setStartDate1] = useState('');
  const [inputfilter, setInputfilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true)
  const spinner = LoadingSpinner()
  const history = useHistory()
  // const [numPages, setNumPages] = useState(null);
  // const [pageNumber, setPageNumber] = useState(1);

  // const onDocumentLoadSuccess = ({ numPages }) => {
  //   setNumPages(numPages);
  // };

  const togglefilter = (value) => {
    setInputfilter(value);
  };
  const [data, setData] = useState([]);

  useEffect(() => {
    const invoivceList = async () => {
      try {
        await axios.get(`${peopleUrl}/invoices-report`).then((response) => {
          const datas = response.data
          setData(datas)
        })
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    }
    invoivceList()
  }, [])

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


  const handlePdfDownload = () => {
    const input = document.getElementById('pdf-content');

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', [canvas.width, canvas.height]);
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('invoice_report.pdf');
    });
  };

  const handleExcelDownload = () => {
    // Sample data (replace this with your actual data)
    const datas = [
      ['Invoice Number', 'Customer Name', 'Due Date', 'Amount', 'Paid', 'Amount Due', 'Status'],
      ...data.map((item) => [
        item.invoice_number,
        item.customerName,
        item.dueDate,
        item.grandTotalNumber,
        item.paid,
        item.dueAmount,
        item.invoice_status
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(datas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, 'invoice_report.xlsx');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleInvoice = () => {
    history.push('/dream-pos/report/addinvoicereport')
  }

  const handleEdit = (id) => {
    history.push(`/dream-pos/report/editinvoicereport/${id}`)
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
        deleteProduct(id);
      }
    });
  };

  const deleteProduct = async (id) => {
    try {
      // Make DELETE request to backend to delete product with ID
      await axios.delete(`${peopleUrl}/delete-invoice/${id}`);
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

  const clearFilters = () => {
    setStartDate("");
    setStartDate1("");
  };

  const handleFilter = () => {
    let filteredProducts = data.slice();

    if (startDate && startDate1 && typeof startDate === 'object' && typeof startDate1 === 'object') {
      console.log("Formatted Start Date:", startDate);
      console.log("Formatted End Date:", startDate1);

      // Convert startDate and startDate1 to timestamps
      const startTimestamp = startDate.getTime();
      const endTimestamp = startDate1.getTime();

      filteredProducts = filteredProducts.filter((purchase) => {
        // Convert purchase.dueDate to a Date object
        const parts = purchase.dueDate.split('-');
        const purchaseDate = new Date(parts[2], parts[1] - 1, parts[0]);

        // Check if the purchaseDate is a valid date
        if (isNaN(purchaseDate.getTime())) {
          console.log("Invalid purchaseDate:", purchase.dueDate);
          return false;
        }

        // Get the timestamp of purchaseDate
        const purchaseTimestamp = purchaseDate.getTime();

        // Compare the purchaseTimestamp within the range of startTimestamp and endTimestamp
        return purchaseTimestamp >= startTimestamp && purchaseTimestamp <= endTimestamp;
      });
    }

    console.log("Filtered Products:", filteredProducts);
    setFilteredData(filteredProducts);
  };



  // Function to check if a date is valid
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
  }, [data, startDate, startDate1]);


  const columns = [
    {
      title: "Invoice number",
      dataIndex: "invoice_number",
      sorter: (a, b) => a.invoice_number.length - b.invoice_number.length,
      key: "invoice_number"
    },
    {
      title: "Customer name",
      dataIndex: "customerName",
      sorter: (a, b) => a.customerName.length - b.customerName.length,
      key: "customerName"
    },
    {
      title: "Due date",
      dataIndex: "dueDate",
      sorter: (a, b) => {
        // Function to parse the date string "DD-MM-YYYY" to a Date object
        const parseDate = (dateString) => {
          const parts = dateString.split("-");
          // Month is 0-indexed, so we subtract 1
          return new Date(parts[2], parts[1] - 1, parts[0]);
        };

        // Convert dates to Date objects
        const dateA = parseDate(a.dueDate);
        const dateB = parseDate(b.dueDate);

        // Compare the dates
        return dateA - dateB;
      },
      key: "dueDate"
    },
    {
      title: "Amount",
      dataIndex: "grandTotalNumber",
      sorter: (a, b) => a.grandTotalNumber.length - b.grandTotalNumber.length,
      key: "grandTotalNumber"
    },
    {
      title: "Paid",
      dataIndex: "paid",
      sorter: (a, b) => a.paid.length - b.paid.length,
      key: "paid"
    },
    {
      title: "Amount due",
      dataIndex: "dueAmount",
      sorter: (a, b) => a.dueAmount.length - b.dueAmount.length,
      key: "dueAmount"
    },
    {
      title: "Status",
      dataIndex: "invoice_status",
      render: (text, record) => (
        <>
          {text === "Paid" && (
            <span className="badges bg-lightgreen">{text}</span>
          )}
          {text === "Unpaid" && (
            <span className="badges bg-lightgrey">{text}</span>
          )}
          {text === "Overdue" && (
            <span className="badges bg-lightred">{text}</span>
          )}
        </>
      ),
      sorter: (a, b) => a.invoice_status.length - b.invoice_status.length,
      key: "invoice_status"
    },
    {
      title: "Action",
      render: (record) => (
        <>
          <button className="confirm-text me-3" onClick={() => handleEdit(record._id)} to={`/dream-pos/report/editinvoicereport/${record._id}`}>
            <img src={EditIcon} alt="img" />
          </button>
          <button className="confirm-text" to="#" onClick={() => confirmText(record._id)}>
            <img src={DeleteIcon} alt="img" />
          </button>
        </>
      ),
    },
  ];

  if (loading) {
    return spinner
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Invoices Report</h4>
            <h6>Manage your Invoices Report</h6>
          </div>
          <div className="page-btn">
            <button
              // to="/dream-pos/quotation/addquotation-quotation"
              className="btn btn-added"
              onClick={handleInvoice}
            >
              <img src={PlusIcon} alt="img" className="me-1" />
              Add Invoice
            </button>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-body">
            <div className="table-top">
              <div className="search-set">
                <div className="search-path">
                  <a
                    className={` btn ${inputfilter ? "btn-filter setclose" : "btn-filter"
                      } `}
                    id="filter_search"
                    onClick={() => togglefilter(!inputfilter)}
                  >
                    <img src={Filter} alt="img" />
                    <span>
                      <img src={ClosesIcon} alt="img" />
                    </span>
                  </a>
                </div>
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
                    <button
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="pdf"
                      className="confirm-text"
                      onClick={handlePdfDownload}
                    >
                      <img src={Pdf} alt="img" />
                    </button>
                  </li>
                  <li>
                    <a
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="excel"
                      onClick={handleExcelDownload}
                    >
                      <img src={Excel} alt="img" />
                    </a>
                  </li>
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
                  <div className="col-lg-2 col-sm-6 col-12">
                    <div className="form-group">
                      <div className="input-groupicon">
                        <DatePicker
                          selected={startDate1}
                          onChange={(date) => setStartDate1(date)}
                        />
                        <div className="addonset">
                          <img src={Calendar} alt="img" />
                        </div>
                      </div>
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
            <div id="pdf-content" className="table-responsive">
              <Table
                columns={columns}
                dataSource={filteredData}
                rowKey={(record) => record.id}
              />
              {/* <Document file="somefile.pdf" onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
              </Document> */}
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
    </div>
  );
};

export default Sales;
