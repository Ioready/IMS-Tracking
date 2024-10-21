/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import Tabletop from "../../EntryFile/tabletop";
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
  search_whites,
  EditIcon,
  DeleteIcon,
} from "../../EntryFile/imagePath";
import axios from "axios";
import { expenseUrl } from "../../Apis/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ExpenseCategory = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);

  const options = [
    { id: 1, text: "Choose Categories" },
    ...categories.map((expense) => ({
      id: expense.categoryName,
      text: expense.categoryName,
    })),
  ];

  const [selectedCategory, setSelectedCategory] = useState("1");

  const clearFilters = () => {
    setSelectedCategory("1");
  };

  const togglefilter = (value) => {
    setInputfilter(value);
  };

  // const handleFilter = (data) => {
  //   setFilteredData(data);
  // };

  const [data, setData] = useState([]);

  useEffect(() => {
    const expenseList = async () => {
      try {
        await axios.get(`${expenseUrl}/get-expenses-category`).then((response) => {
          const datas = response.data
          setData(datas.expensesCat)
          setFilteredData(datas.expensesCat)
        })
      } catch (error) {
        console.log(error);
      }
    }
    expenseList()
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
      await axios.delete(`${expenseUrl}/delete-expenses-category/${id}`);
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

  const handleFilter = () => {
    let filteredProducts = data.slice();

    if (selectedCategory && selectedCategory !== "1") {
      filteredProducts = filteredProducts.filter(
        (category) => category.categoryName === selectedCategory
      );
    }

    setFilteredData(filteredProducts);
  };

  useEffect(() => {
    handleFilter();
  }, [data, selectedCategory]);


  const columns = [
    // {
    //   title: "Date",
    //   dataIndex: "date",
    //   sorter: (a, b) => a.date.length - b.date.length,
    // },

    {
      title: "Category Name",
      dataIndex: "categoryName",
      sorter: (a, b) => a.categoryName.length - b.categoryName.length,
      key: "categoryName"
    },
    // {
    //   title: "Reference",
    //   dataIndex: "reference",
    //   sorter: (a, b) => a.reference.length - b.reference.length,
    // },
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
    // {
    //   title: "Amount",
    //   dataIndex: "amount",
    //   sorter: (a, b) => a.amount.length - b.amount.length,
    //   width: "125px",
    // },
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
          <Link className="me-3" to={`/dream-pos/expense/editexpensecategory-expense/${record._id}`}>
            <img src={EditIcon} alt="img" />
          </Link>
          <Link className="confirm-text" to="#" onClick={()=> confirmText(record._id)}>
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
              <h4>Expense Category</h4>
              <h6>Manage your Purchases</h6>
            </div>
            <div className="page-btn">
              <Link
                to="/dream-pos/expense/addexpensecategory-expense"
                className="btn btn-added"
              >
                <img src={PlusIcon} alt="img" className="me-1" />
                Add Expenses Category
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <Tabletop data={data} onFilter={handleFilter} inputfilter={inputfilter} togglefilter={togglefilter} />
              {/* /Filter */}
              <div
                className={`card mb-0 ${ inputfilter ? "toggleCls" : ""}`}
                id="filter_inputs"
                style={{ display: inputfilter ? "block" :"none"}}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg-12 col-sm-12">
                      <div className="row">
                        <div className="col-lg-3 col-sm-6 col-12">
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
export default ExpenseCategory;
