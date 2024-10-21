/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import DatePicker from "react-datepicker";
import * as XLSX from 'xlsx';
import { pdfjs } from 'react-pdf';
import html2canvas from 'html2canvas';
import "react-datepicker/dist/react-datepicker.css";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import {
  ClosesIcon,
  Excel,
  Filter,
  Pdf,
  Calendar,
  Printer,
  search_whites,
  Search,
  EyeIcon
} from "../../EntryFile/imagePath";
import axios from "axios";
import { peopleUrl } from "../../Apis/Api";
import jsPDF from "jspdf";
import { Link } from "feather-icons-react/build/IconComponents";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Costumer = () => {
  // const [startDate, setStartDate] = useState(new Date());
  // const [startDate1, setStartDate1] = useState(new Date());
  const [inputfilter, setInputfilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  // const [customerData, setCustomerData] = useState([])
  const history = useHistory()

  const togglefilter = (value) => {
    setInputfilter(value);
  };


  const [selectedCustomers, setSelectedCustomers] = useState("1");
  const [grandTotalFilter, setGrandTotalFilter] = useState("");
  const [data, setData] = useState([]);

  const options = [
    { id: "1", text: "Choose Customers" },
    ...data.map((product) => ({ id: product.customerName, text: product.customerName })),
  ];

  useEffect(() => {
    const customerReport = async () => {
      try {
        await axios.get(`${peopleUrl}/sales`).then((response) => {
          const datas = response.data
          setData(datas)
          // setFilteredData(datas);
        })
      } catch (error) {
        console.log(error);
        // history.push('/error-500')
      }
    }
    customerReport()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const filteredDatas = data.filter((item) => {
        return Object.values(item).some((value) =>
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      setFilteredData(filteredDatas)
    }
    
    fetchData()
  }, [data, searchTerm]);

  const clearFilters = () => {
    setSelectedCustomers("1");
    setGrandTotalFilter("");
  };

  const handleView = (id) => {
    history.push(`/dream-pos/report/customer-details/${id}`)
  }

  const handlePdfDownload = () => {
    const input = document.getElementById('pdf-content');

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', [canvas.width, canvas.height]);
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('customer_report.pdf');
    });
  };

  const handleExcelDownload = () => {
    // Sample data (replace this with your actual data)
    const datas = [
      ['Reference', 'Customer Name', 'Amount', 'Paid', 'Amount Due', 'Status', 'Payment Status'],
      ...data.map((item) => [
        item.reference,
        item.customerName,
        item.grandTotalNumber,
        item.receivedAmount,
        item.dueAmount,
        item.status,
        item.payment_status
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(datas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, 'customer_report.xlsx');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFilter = () => {
    let filteredProducts = data.slice();

    if (selectedCustomers && selectedCustomers !== "1") {
      filteredProducts = filteredProducts.filter(
        (product) => product.customerName === selectedCustomers
      );
    }

    if (grandTotalFilter) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.grandTotalNumber &&
          product.grandTotalNumber.toString().includes(grandTotalFilter)
      );
    }

    setFilteredData(filteredProducts);
  };

  useEffect(() => {
    handleFilter();
  }, [data, selectedCustomers, grandTotalFilter]);

  const columns = [
    {
      title: "Reference",
      dataIndex: "reference",
      sorter: (a, b) => a.reference.length - b.reference.length,
      key: 'reference'
    },
    {
      title: "Customer name",
      dataIndex: "customerName",
      sorter: (a, b) => a.customerName.length - b.customerName.length,
      key: 'customerName'
    },
    {
      title: "Amount",
      dataIndex: "grandTotalNumber",
      sorter: (a, b) => a.grandTotalNumber - b.grandTotalNumber,
      key: 'grandTotalNumber'
    },
    {
      title: "Paid",
      dataIndex: "receivedAmount",
      sorter: (a, b) => a.receivedAmount - b.receivedAmount,
      key: 'receivedAmount'
    },
    {
      title: "	Amount due",
      dataIndex: "dueAmount",
      sorter: (a, b) => a.dueAmount - b.dueAmount,
      key: 'dueAmount'
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
      key: 'status'
    },
    {
      title: "Payment Status",
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
      key: 'payment_status'
    },
    {
      title: "Action",
      render: (record) => (
        <>
            <button
              className="confirm-text me-3"
              // to={`/dream-pos/report/customer-details/${record._id}`}
              onClick={() => handleView(record._id)}
            >
              <img src={EyeIcon} alt="img" />
            </button>
        </>
      ),
    },
  ];
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Customer Report</h4>
            <h6>Manage your Customer Report</h6>
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
                    <a
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="pdf"
                      onClick={handlePdfDownload}
                    >
                      <img src={Pdf} alt="img" />
                    </a>
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
                      <Select2
                        className="select"
                        data={options}
                        options={{
                          placeholder: selectedCustomers === "1" ? "Choose Customer" : options.find(option => option.id === selectedCustomers)?.text,
                        }}
                        onSelect={(event) => {
                          const selectedProducts = event.params.data.id;
                          setSelectedCustomers(selectedProducts);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-6 col-12">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Amount"
                        value={grandTotalFilter}
                        onChange={(e) => setGrandTotalFilter(e.target.value)}
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
            <div className="table-responsive"  id="pdf-content">
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
  );
};

export default Costumer;
