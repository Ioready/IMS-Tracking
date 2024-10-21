/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
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
  OrangeImage,
  PineappleImage,
  StawberryImage,
  Product1,
  EyeIcon,
} from "../../EntryFile/imagePath";
import axios from "axios";
import { purchaseUrl } from "../../Apis/Api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const supplier = () => {
  const [startDate, setStartDate] = useState('');
  const [startDate1, setStartDate1] = useState('');
  const [inputfilter, setInputfilter] = useState(false);
  const [filteredData1, setFilteredData1] = useState([]);
  const [filteredData2, setFilteredData2] = useState([]);
  const [filteredData3, setFilteredData3] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const history = useHistory()

  const togglefilter = (value) => {
    setInputfilter(value);
  };

  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  
  console.log('data1: ', data1);
  
  useEffect(() => {
    const parchaseReport = async () => {
      try {
        await axios.get(`${purchaseUrl}/get-purchase-report`).then((response) => {
          const datas = response.data
          setData1(datas)
          setData2(datas)
          setFilteredData1(datas);
          // setFilteredData2(datas);
        })
      } catch (error) {
        console.log(error);
        // history.push('/error-500')
      }
    }
    parchaseReport()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const filteredDatas = data1.filter((item) => {
        return Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      setFilteredData1(filteredDatas)
    }
    fetchData()
  }, [data1, searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      const filteredDatas = data2.filter((item) => {
        return Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      setFilteredData2(filteredDatas)
    }
    fetchData()
  }, [data2, searchTerm]);

  const clearFilters = () => {
    setStartDate("");
    setStartDate1("");
  };

  useEffect(() => {
    const fetchData = async () => {
      const filteredDatas = data3.filter((item) => {
        return Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      setFilteredData3(filteredDatas)
    }
    fetchData()
  }, [data3, searchTerm]);

  const handleFilter = () => {
    let filteredProducts1 = data1.slice();
    let filteredProducts2 = data2.slice();

    if (startDate && startDate1 && typeof startDate === 'object' && typeof startDate1 === 'object') {
      console.log("Formatted Start Date:", startDate);
      console.log("Formatted End Date:", startDate1);

      // Convert startDate and startDate1 to timestamps
      const startTimestamp = startDate.getTime();
      const endTimestamp = startDate1.getTime();

      filteredProducts1 = filteredProducts1.filter((purchase) => {
        // Convert purchase.dueDate to a Date object
        const parts = purchase.purchaseDate.split('-');
        const purchaseDate = new Date(parts[2], parts[1] - 1, parts[0]);

        // Check if the purchaseDate is a valid date
        if (isNaN(purchaseDate.getTime())) {
          console.log("Invalid purchaseDate:", purchase.purchaseDate);
          return false;
        }

        // Get the timestamp of purchaseDate
        const purchaseTimestamp = purchaseDate.getTime();

        // Compare the purchaseTimestamp within the range of startTimestamp and endTimestamp
        return purchaseTimestamp >= startTimestamp && purchaseTimestamp <= endTimestamp;
      });
    }

    if (startDate && startDate1 && typeof startDate === 'object' && typeof startDate1 === 'object') {
      console.log("Formatted Start Date:", startDate);
      console.log("Formatted End Date:", startDate1);

      // Convert startDate and startDate1 to timestamps
      const startTimestamp = startDate.getTime();
      const endTimestamp = startDate1.getTime();

      filteredProducts2 = filteredProducts2.filter((purchase) => {
        // Convert purchase.dueDate to a Date object
        const parts = purchase.purchaseDate.split('-');
        const purchaseDate = new Date(parts[2], parts[1] - 1, parts[0]);

        // Check if the purchaseDate is a valid date
        if (isNaN(purchaseDate.getTime())) {
          console.log("Invalid purchaseDate:", purchase.purchaseDate);
          return false;
        }

        // Get the timestamp of purchaseDate
        const purchaseTimestamp = purchaseDate.getTime();

        // Compare the purchaseTimestamp within the range of startTimestamp and endTimestamp
        return purchaseTimestamp >= startTimestamp && purchaseTimestamp <= endTimestamp;
      });
    }

    console.log("Filtered Products:", filteredProducts1);
    setFilteredData1(filteredProducts1);
    setFilteredData2(filteredProducts2);
  };
  
  
  useEffect(() => {
    handleFilter();
  }, [data1, startDate, startDate1]);
  
  useEffect(() => {
    handleFilter();
  }, [data1, startDate, startDate1]);
  

  const columns1 = [
    {
      title: "purchased Date",
      dataIndex: "purchaseDate",
      sorter: (a, b) => {
        // Function to parse the date string "DD-MM-YYYY" to a Date object
        const parseDate = (dateString) => {
          const parts = dateString.split("-");
          // Month is 0-indexed, so we subtract 1
          return new Date(parts[2], parts[1] - 1, parts[0]);
        };

        // Convert dates to Date objects
        const dateA = parseDate(a.purchaseDate);
        const dateB = parseDate(b.purchaseDate);

        // Compare the dates
        return dateA - dateB;
      },
      key: 'purchaseDate'
    },
    // {
    //   title: "Product Name",
    //   dataIndex: "productName",
    //   render: (text, record) => (
    //     <div className="productimgname">
    //       <Link to="#" className="product-img">
    //         <img src={record.image} alt="product" />
    //       </Link>
    //       <Link to="#">{text}</Link>
    //     </div>
    //   ),
    //   sorter: (a, b) => a.Name.length - b.Name.length,
    // },
    {
      title: "Purchased amount",
      dataIndex: "grandTotalNumber",
      sorter: (a, b) => a.grandTotalNumber - b.grandTotalNumber,
      key: 'grandTotalNumber'
    },
    {
      title: "purchased QTY",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      key: 'quantity'
    },
    // {
    //   title: "Paid",
    //   dataIndex: "grandTotalNumber",
    //   sorter: (a, b) => a.Brand.length - b.Brand.length,
    // },
    // {
    //   title: "balance",
    //   dataIndex: "balance",
    //   sorter: (a, b) => a.Price.length - b.Price.length,
    // },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <>
          {text === "Received" && (
            <span className="badges bg-lightgreen">{text}</span>
          )}
          {text === "Pending" && (
            <span className="badges bg-lightred">{text}</span>
          )}
        </>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
      key: 'status'
    },
    {
      title: "Action",
      render: (record) => (
        <>
          <Link
            className="confirm-text me-3"
            to={`/dream-pos/report/supplier-details/${record.purchaseDate}/${record.grandTotalNumber}/${record.quantity}/${record.status}`}
          >
            <img src={EyeIcon} alt="img" />
          </Link>
        </>
      ),
    },
  ];

  const columns2 = [
    {
      title: "Date",
      dataIndex: "purchaseDate",
      sorter: (a, b) => {
        // Function to parse the date string "DD-MM-YYYY" to a Date object
        const parseDate = (dateString) => {
          const parts = dateString.split("-");
          // Month is 0-indexed, so we subtract 1
          return new Date(parts[2], parts[1] - 1, parts[0]);
        };

        // Convert dates to Date objects
        const dateA = parseDate(a.purchaseDate);
        const dateB = parseDate(b.purchaseDate);

        // Compare the dates
        return dateA - dateB;
      },
      key: 'purchaseDate'
    },
    // {
    //   title: "Purchase",
    //   dataIndex: "Purchase",
    //   sorter: (a, b) => a.Purchase.length - b.Purchase.length,
    // },
    {
      title: "Reference",
      dataIndex: "referenceNumber",
      sorter: (a, b) => a.referenceNumber.length - b.referenceNumber.length,
      key: 'referenceNumber'
    },
    {
      title: "Supplier name",
      dataIndex: "supplierName",
      sorter: (a, b) => a.supplierName.length - b.supplierName.length,
      key: 'supplierName'
    },
    {
      title: "Amount",
      dataIndex: "grandTotalNumber",
      sorter: (a, b) => a.grandTotalNumber - b.grandTotalNumber,
      key: 'grandTotalNumber'
    },
    {
      title: "Action",
      render: (record) => (
        <>
          <Link
            className="confirm-text me-3"
            to={`/dream-pos/report/payment-details/${record.purchaseDate}/${record.referenceNumber}/${record.supplierName}/${record.grandTotalNumber}`}
          >
            <img src={EyeIcon} alt="img" />
          </Link>
        </>
      ),
    },
    // {
    //   title: "Paid",
    //   dataIndex: "grandTotalNumber",
    //   sorter: (a, b) => a.Paid.length - b.Paid.length,
    // },
    // {
    //   title: "paid by",
    //   dataIndex: "paymentType",
    //   sorter: (a, b) => a.by.length - b.by.length,
    // },
  ];

  useEffect(() => {
    const parchaseReport = async () => {
      try {
        await axios.get(`${purchaseUrl}/return`).then((response) => {
          const datas = response.data.purchase
          setData3(datas)
          setFilteredData3(datas);
        })
      } catch (error) {
        console.log(error);
        // history.push('/error-500')
      }
    }
    parchaseReport()
  }, [])

  const columns3 = [
    {
      title: "Reference",
      dataIndex: "referenceNumber",
      sorter: (a, b) => a.referenceNumber.length - b.referenceNumber.length,
      key: 'referenceNumber'
    },
    {
      title: "Supplier name",
      dataIndex: "supplier",
      sorter: (a, b) => a.supplier.length - b.supplier.length,
      key: 'supplier'
    },
    {
      title: "Amount",
      dataIndex: "grandTotalNumber",
      sorter: (a, b) => a.grandTotalNumber - b.grandTotalNumber,
      key: 'grandTotalNumber'
    },
    // {
    //   title: "Paid",
    //   dataIndex: "grandTotalNumber",
    //   sorter: (a, b) => a.Paid.length - b.Paid.length,
    // },
    // {
    //   title: "	Amount due",
    //   dataIndex: "due",
    //   sorter: (a, b) => a.due.length - b.due.length,
    // },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <>
          <span className="badges bg-lightgreen">{text}</span>
        </>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
      key: 'status'
    },
    {
      title: "Action",
      render: (record) => (
        <>
          <Link
            className="confirm-text me-3"
            to={`/dream-pos/report/return-details/${record.referenceNumber}/${record.supplier}/${record.grandTotalNumber}/${record.status}`}
          >
            <img src={EyeIcon} alt="img" />
          </Link>
        </>
      ),
    },
    // {
    //   title: "Payment Status",
    //   dataIndex: "Payment",
    //   render: (text, record) => (
    //     <>
    //       {text === "Paid" && (
    //         <span className="badges bg-lightgreen">{text}</span>
    //       )}
    //       {text === "Unpaid" && (
    //         <span className="badges bg-lightgrey">{text}</span>
    //       )}
    //       {text === "Overdue" && (
    //         <span className="badges bg-lightred">{text}</span>
    //       )}
    //     </>
    //   ),
    //   sorter: (a, b) => a.Payment.length - b.Payment.length,
    // },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Supplier Report</h4>
            <h6>Manage your Supplier Report</h6>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-body">
            <div className="tabs-set">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="purchase-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#purchase"
                    type="button"
                    role="tab"
                    aria-controls="purchase"
                    aria-selected="true"
                  >
                    Purchase
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="payment-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#payment"
                    type="button"
                    role="tab"
                    aria-controls="payment"
                    aria-selected="false"
                  >
                    Payment
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="return-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#return"
                    type="button"
                    role="tab"
                    aria-controls="return"
                    aria-selected="false"
                  >
                    Return
                  </button>
                </li>
              </ul>
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
                      >
                        <img src={Pdf} alt="img" />
                      </a>
                    </li>
                    <li>
                      <a
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="excel"
                      >
                        <img src={Excel} alt="img" />
                      </a>
                    </li>
                    <li>
                      <a
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="print"
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
              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="purchase"
                  role="tabpanel"
                  aria-labelledby="purchase-tab"
                >
                  <div className="table-responsive">
                    <Table
                      columns={columns1}
                      dataSource={filteredData1}
                      rowKey={(record) => record.id}
                    />
                  </div>
                </div>
                <div className="tab-pane fade" id="payment" role="tabpanel">
                  <div className="table-responsive">
                    <Table
                      columns={columns2}
                      dataSource={filteredData2}
                      rowKey={(record) => record.id}
                    />
                  </div>
                </div>
                <div className="tab-pane fade" id="return" role="tabpanel">
                  <div className="table-responsive">
                    <Table
                      columns={columns3}
                      dataSource={filteredData3}
                      rowKey={(record) => record.id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
    </div>
  );
};

export default supplier;
