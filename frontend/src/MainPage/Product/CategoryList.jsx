import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Table from "../../EntryFile/datatable";
import Tabletop from "../../EntryFile/tabletop";
import {
  PlusIcon,
  // EyeIcon,
  EditIcon,
  DeleteIcon,
} from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import axios from "axios";
import { productUrl } from "../../Apis/Api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CategoryList = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const spinner = LoadingSpinner();

  const [columnTitles] = useState([
    "Category Name",
    "Description",
    "Created By",
    "Action",
  ]);
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${productUrl}/category-list`);
        const categoryData = response.data.categoryData;
        setCategories(categoryData);
        setFilteredData(categoryData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const options = [
    { id: "1", text: "Choose Category" },
    ...categories.map((category) => ({
      id: category.categoryName,
      text: category.categoryName,
    })),
  ];

  const clearFilters = () => {
    setSelectedCategory("1");
    setSelectedCreator("1");
  };

  const [selectedCategory, setSelectedCategory] = useState("1");
  const [selectedCreator, setSelectedCreator] = useState("1");

  const togglefilter = (value) => {
    setInputfilter(value);
  };

  // const viewDetails = async (id) => {
  //   try {
  //     history.push(`/dream-pos/category/category-details/${id}`);
  //   } catch (error) {
  //     console.log(error);
  //     history.push("/error-500");
  //   }
  // };

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
        deleteCategory(id);
      }
    });
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${productUrl}/delete-category/${id}`);
      setFilteredData((prevData) => prevData.filter((item) => item._id !== id));
      Swal.fire({
        type: "success",
        title: "Deleted!",
        text: "Your file has been deleted.",
        confirmButtonClass: "btn btn-success",
      });
    } catch (error) {
      console.log(error);
      history.push("/error-500");
    }
  };

  const handleSearch = (data) => {
    setFilteredData(data);
  };

  const getUniqueCreators = () => {
    const uniqueCreators = new Set();
    categories.forEach((category) => {
      uniqueCreators.add(category.createdBy);
    });
    return Array.from(uniqueCreators);
  };

  const columns = [
    {
      title: "Category Name",
      dataIndex: "categoryName",
      render: (text, record) => (
        <div className="productimgname">
          <Link to="#" className="product-img">
            <img alt="" src={record.image} />
          </Link>
          <Link to="#" style={{ fontSize: "15px", marginLeft: "10px" }}>
            {record.categoryName}
          </Link>
        </div>
      ),
      sorter: (a, b) => a.categoryName.length - b.categoryName.length,
      key: "categoryName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Action",
      render: (record) => (
        <>
          {/* <button
            className="confirm-text me-3"
            onClick={() => viewDetails(record._id)}
          >
            <img src={EyeIcon} alt="img" />
          </button> */}
          <Link
            className="me-3"
            to={`/dream-pos/product/editcategory-product/${record._id}`}
          >
            <img src={EditIcon} alt="img" />
          </Link>
          <button
            className="confirm-text"
            onClick={() => confirmText(record._id)}
          >
            <img src={DeleteIcon} alt="img" />
          </button>
        </>
      ),
    },
  ];

  useEffect(() => {
    handleFilter();
  }, [selectedCategory, selectedCreator]);

  const handleFilter = () => {
    let filteredCategories = categories.slice();
  
    if (selectedCreator && selectedCreator !== "1") {
      filteredCategories = filteredCategories.filter(
        (category) => category.createdBy === selectedCreator
      );
    } else if (selectedCategory && selectedCategory !== "1") {
      filteredCategories = filteredCategories.filter(
        (category) => category.categoryName === selectedCategory
      );
    }
  
    setFilteredData(filteredCategories);
  };

  if (loading) {
    return spinner;
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Category List</h4>
              <h6>Manage your categories</h6>
            </div>
            <div className="page-btn">
              <Link
                to="/dream-pos/product/addcategory-product"
                className="btn btn-added"
              >
                <img src={PlusIcon} alt="img" className="me-1" />
                Add New Category
              </Link>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <Tabletop
                data={categories}
                columnTitles={columnTitles}
                inputfilter={inputfilter}
                togglefilter={togglefilter}
                onFilter={handleSearch}
                filtering={true}
              />
              <div
                className={`card mb-0 ${inputfilter ? "toggleCls" : ""}`}
                id="filter_inputs"
                style={{
                  display: inputfilter ? "block" : "none",
                }}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg-12 col-sm-12">
                      <div className="row">
                        <div className="col-lg-2 col-sm-6 col-12">
                          <div className="form-group">
                            <Select2
                              className="select"
                              data={options}
                              options={{
                                placeholder:
                                  selectedCategory === "1"
                                    ? "Choose Category"
                                    : options.find(
                                        (option) =>
                                          option.id === selectedCategory
                                      )?.text,
                              }}
                              onSelect={(event) => {
                                const selectedCategory =
                                  event.params.data.id;
                                setSelectedCategory(selectedCategory);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-2 col-sm-6 col-12">
                          <div className="form-group">
                            <Select2
                              className="select"
                              data={getUniqueCreators()}
                              options={{
                                placeholder: "Choose Creator",
                              }}
                              onSelect={(event) => {
                                const selectedCreator =
                                  event.params.data.id;
                                setSelectedCreator(selectedCreator);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-1 col-sm-6 col-12">
                          <div className="form-group">
                            <button
                              className="btn btn-filters ms-auto"
                              onClick={() => clearFilters()}
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-responsive" id="pdf-content">
                <Table
                  columns={columns}
                  dataSource={filteredData}
                  // rowKey={(record) => record._id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryList;
