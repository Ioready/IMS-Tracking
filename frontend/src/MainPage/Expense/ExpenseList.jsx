/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import { Link } from "react-router-dom";
import Tabletop from "../../EntryFile/tabletop"
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
  search_whites,
  EditIcon,
  DeleteIcon,
  Calendar,
} from "../../EntryFile/imagePath";
import Swal from "sweetalert2";
import axios from "axios";
import { expenseUrl, userUrl } from "../../Apis/Api";
import { DatePicker } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ExpenseList = () => {
  const [startDate, setStartDate] = useState("");
  const [inputfilter, setInputfilter] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState({})
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);

  console.log('data: ', data);

  const options = [
    { id: 1, text: "Choose Categories" },
    ...categories.map((expense) => ({
      id: expense.categoryName,
      text: expense.categoryName,
    })),
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

  const [selectedCategory, setSelectedCategory] = useState("1");
  const [referenceFilter, setReferenceFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");

  const clearFilters = () => {
    setSelectedCategory("1");
    setReferenceFilter("");
    setAmountFilter("");
  };

  useEffect(() => {
    const expenseList = async () => {
      try {
        await axios.get(`${expenseUrl}`).then((response) => {
          const datas = response.data
          setData(datas.expense)
          setFilteredData(datas.expense)
        })
      } catch (error) {
        console.log(error);
      }
    }
    expenseList()
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
    const fetchCategories = async () => {
      try {
        await axios.get(`${expenseUrl}/get-expenses-category`).then((response) => {
          const datas = response.data.expensesCat
          setCategories(datas)
        })
      } catch (error) {
        console.log(error);
      }
    }
    fetchCategories()
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
      await axios.delete(`${expenseUrl}/delete-expenses/${id}`);
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


  const handleSearch = (data) => {
    setFilteredData(data);
  };

  const handleFilter = () => {
    let filteredProducts = data.slice();

    if (selectedCategory && selectedCategory !== "1") {
      filteredProducts = filteredProducts.filter(
        (category) => category.categoryName === selectedCategory
      );
    }

    if (referenceFilter) {
      filteredProducts = filteredProducts.filter(
        (product) => product.referenceNumber.includes(referenceFilter)
      );
    }

    if (amountFilter) {
      filteredProducts = filteredProducts.filter(
        (product) =>
        product.amount &&
        product.amount.toString().includes(amountFilter)
      );
    }

    if (startDate) {
      filteredProducts = filteredProducts.filter((purchase) => {
        const expensesDate = new Date(purchase.expensesDate);
        // Check if expensesDate is a valid Date object
        if (isNaN(expensesDate.getTime())) {
          // Attempt to parse the date manually
          const parsedDate = parseCustomDate(purchase.expensesDate);
          if (parsedDate) {
            return parsedDate >= startDate;
          } else {
            console.log("Invalid expensesDate:", purchase.expensesDate);
            return false;
          }
        }
        return expensesDate >= startDate;
      });
    }

    // Function to parse custom date format
    function parseCustomDate(dateString) {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      const parts = dateString.split(" ");
      if (parts.length === 6) {
        const year = parts[5];
        const monthIndex = months.indexOf(parts[1]);
        const day = parts[2];
        const time = parts[3];
        const utc = parts[4];

        return new Date(`${year}-${monthIndex + 1}-${day}T${time}${utc}`);
      } else {
        return null;
      }
    }

    setFilteredData(filteredProducts);
  };

  useEffect(() => {
    handleFilter();
  }, [data, selectedCategory, referenceFilter, startDate, amountFilter]);


  const columns = [
    {
      title: "Category Name",
      dataIndex: "categoryName",
      sorter: (a, b) => a.categoryName.length - b.categoryName.length,
      key: "categoryName"
    },
    {
      title: "Reference",
      dataIndex: "referenceNumber",
      sorter: (a, b) => a.referenceNumber.length - b.referenceNumber.length,
      key: "referenceNumber"
    },
    {
      title: "Date",
      dataIndex: "expensesDate",
      sorter: (a, b) => {
        // Function to parse the date string "DD-MM-YYYY" to a Date object
        const parseDate = (dateString) => {
          const parts = dateString.split("-");
          // Month is 0-indexed, so we subtract 1
          return new Date(parts[2], parts[1] - 1, parts[0]);
        };

        // Convert dates to Date objects
        const dateA = parseDate(a.expensesDate);
        const dateB = parseDate(b.expensesDate);

        // Compare the dates
        return dateA - dateB;
      },
      key: "expensesDate"
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   render: (text, record) => (
    //     <span
    //       className={
    //         text === "Active" ? "badges bg-lightgreen" : "badges bg-lightred"
    //       }
    //     >
    //       {text}
    //     </span>
    //   ),
    //   sorter: (a, b) => a.status.length - b.status.length,
    // },
    {
      title: "Amount",
      dataIndex: "amount",
      sorter: (a, b) => a.amount - b.amount,
      width: "125px",
      key: "amount"
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: (a, b) => a.description.length - b.description.length,
      key: "description"
    },
    {
      title: "Action",
      render: (record) => (
        <>
          {selectedPermission.expenseEdit === true ? (
            <Link className="me-3" to={`/dream-pos/expense/editexpense-expense/${record._id}`}>
              <img src={EditIcon} alt="img" />
            </Link>
          ) : (
            <div></div>
          )}
          {selectedPermission.expenseDelete === true ? (
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

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Expense List</h4>
              <h6>Manage your Expenses</h6>
            </div>
            {selectedPermission.expenseCreate === true ? (
              <div className="page-btn">
                <Link
                  to="/dream-pos/expense/addexpense-expense"
                  className="btn btn-added"
                >
                  <img src={PlusIcon} alt="img" className="me-1" />
                  Add New Expense
                </Link>
              </div>
            ) : (
              <div></div>
            )}
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
                            <Select2
                              className="select"
                              data={options}
                              options={{
                                placeholder: selectedCategory === "1" ? "Choose Category" : options.find(option => option.id === selectedCategory)?.text,
                              }}
                              onSelect={(event) => {
                                const selectedCategory = event.params.data.id;
                                setSelectedCategory(selectedCategory);
                              }}
                            />
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
                              placeholder="Amount"
                              value={amountFilter}
                              onChange={(e) => setAmountFilter(e.target.value)}
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
              <div className="table-responsive " id="pdf-content">
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
export default ExpenseList;
