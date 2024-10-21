/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import Tabletop from "../../EntryFile/tabletop";
import Swal from "sweetalert2";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { Link } from "react-router-dom";
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
  Calendar,
} from "../../EntryFile/imagePath";
import axios from "axios";
import { peopleUrl } from "../../Apis/Api";
import { DatePicker } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const TransferList = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedReference, setSelectedReference] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // const options = [
  //   { id: 1, text: "Choose Product", text: "Choose Product" },
  //   { id: 2, text: "Macbook pro", text: "Macbook pro" },
  //   { id: 3, text: "Orange", text: "Orange" },
  // ];
  // const options2 = [
  //   { id: 1, text: "Choose Category", text: "Choose Category" },
  //   { id: 2, text: "Computers", text: "Computers" },
  //   { id: 3, text: "Fruits", text: "Fruits" },
  // ];
  // const options3 = [
  //   { id: 1, text: "Choose Sub Category", text: "Choose Sub Category" },
  //   { id: 2, text: "Computers", text: "Computers" },
  // ];
  // const options4 = [
  //   { id: 1, text: "Brand", text: "Brand" },
  //   { id: 2, text: "N/D", text: "N/D" },
  // ];
  // const options5 = [
  //   { id: 1, text: "Price", text: "Price" },
  //   { id: 2, text: "150.00", text: "150.00" },
  // ];

  const clearFilters = () => {
    setStartDate("");
    setSelectedFrom("1")
    setSelectedReference("1");
    setSelectedStatus("1");
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
      await axios.delete(`${peopleUrl}/delete-transfer/${id}`);
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
  const [data, setData] = useState([]);

  useEffect(() => {
    const transferList = async () => {
      try {
        await axios.get(`${peopleUrl}/transfer-list`).then((response) => {
          const datas = response.data
          console.log('datas: ', datas);
          setData(datas)
          setFilteredData(datas)
        })
      } catch (error) {
        console.log(error);
      }
    }
    transferList()
  }, [])

  const optionsFrom = data.map(item => ({ id: item.from, text: item.from }));
  const optionsReference = data.map(item => ({ id: item.reference, text: item.reference }));
  const optionsStatus = data.map(item => ({ id: item.status, text: item.status }));

  const handleSearch = (data) => {
    setFilteredData(data);
  };

  const handleFilter = () => {
    let filteredProducts = data.slice();

    if (startDate && typeof startDate === 'object') {

      filteredProducts = filteredProducts.filter((purchase) => {
        const purchaseDate = purchase.startDate;

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


    if (selectedFrom && selectedFrom !== "1") {
      filteredProducts = filteredProducts.filter(
        (supplier) => supplier.from === selectedFrom
      );
    }

    if (selectedReference && selectedReference !== "1") {
      filteredProducts = filteredProducts.filter(
        (purchase) => purchase.reference === selectedReference
      );
    }

    if (selectedStatus && selectedStatus !== "1") {
      filteredProducts = filteredProducts.filter(
        (purchase) => purchase.status === selectedStatus
      );
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
  }, [data, startDate, selectedFrom, selectedReference, selectedStatus]);


  const columns = [
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
      title: "Reference",
      dataIndex: "reference",
      sorter: (a, b) => a.reference.length - b.reference.length,
      key: "reference"
    },
    {
      title: "From",
      dataIndex: "from",
      sorter: (a, b) => a.from.length - b.from.length,
      key: "from"
    },
    {
      title: "Paid",
      dataIndex: "to",
      sorter: (a, b) => a.to.length - b.to.length,
      key: "to"
    },
    {
      title: "Items",
      dataIndex: "items",
      sorter: (a, b) => a.items - b.items,
      key: "items"
    },
    {
      title: "Grand Total",
      dataIndex: "grandTotalNumber",
      sorter: (a, b) => a.grandTotalNumber - b.grandTotalNumber,
      key: "grandTotalNumber"
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
      title: "Action",
      render: (record) => (
        <>
          <Link className="me-3" to={`/dream-pos/transfer/edittransfer-transfer/${record._id}`}>
            <img src={EditIcon} alt="img" />
          </Link>
          <Link className="confirm-text" to="#" onClick={() => confirmText(record._id)}>
            <img src={DeleteIcon} alt="img" />
          </Link>
        </>
      ),
    },
  ];
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Transfer List</h4>
              <h6>Transfer your stocks to one store another store</h6>
            </div>
            <div className="page-btn">
              <Link
                to="/dream-pos/transfer/addtransfer-transfer"
                className="btn btn-added"
              >
                <img src={PlusIcon} alt="img" className="me-1" />
                Add Transfer
              </Link>
            </div>
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
                            <Select2
                              className="select"
                              data={optionsFrom}
                              options={{
                                placeholder: "Choose From",
                              }}
                              onSelect={(event) => {
                                const selectedFrom = event.params.data.id;
                                setSelectedFrom(selectedFrom);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg col-sm-6 col-12">
                          <div className="form-group">
                            <Select2
                              className="select"
                              data={optionsStatus}
                              options={{
                                placeholder: "Choose Status",
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
export default TransferList;
