import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import Table from "../../EntryFile/datatable";
import axios from "axios";
import { productUrl } from "../../Apis/Api";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select2 from "react-select2-wrapper";
import { EditIcon, DeleteIcon, PlusIcon } from "../../EntryFile/imagePath";
import Tabletop from "../../EntryFile/tabletop";

const SubCategoryList = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const spinner = LoadingSpinner();
  const history = useHistory();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("1");
  
  const [selectedSubCategory, setSelectedSubCategory] = useState("1");
  const [selectedCategoryCode, setSelectedCategoryCode] = useState("1");
  console.log(setSelectedCategoryCode,"Selected code");

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(`${productUrl}/sub-category-list`);
        const subCategoryData = response.data.subCategoryData;
        setSubCategories(subCategoryData);
        setCategories(subCategoryData);
        setFilteredData(subCategoryData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setLoading(false);
      }
    };
  
    fetchSubCategories();
  }, []);

  const optionsCategory = [
    { id: "1", text: "Choose Category" },
    ...categories.map((category) => ({ id: category._id, text: category.parentCategory })),
  ];

  const optionsSubCategory = [
    { id: "1", text: "Choose Sub Category" },
    ...subCategories.map((subCategory) => ({ id: subCategory._id, text: subCategory.subCategoryName })),
  ];

  const optionsCategoryCode = [
    { id: "1", text: "Choose Category Code" },
    ...subCategories.map((subCategory) => ({ id: subCategory._id, text: subCategory.subCategoryCode })),
  ];

  const togglefilter = (value) => {
    setInputfilter(value);
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
        deleteSubCategory(id);
      }
    });
  };
  
  const deleteSubCategory = async (id) => {
    try {
      // Make DELETE request to backend to delete product with ID
      await axios.delete(`${productUrl}/delete-sub-category/${id}`);
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

  const clearFilters = () => {
    setSelectedCategory("1");
    setSelectedSubCategory("1");
    setSelectedCategoryCode("1");
  };

  const handleSearch = (data) => {
    setFilteredData(data);
  };

  const handleFilter = () => {
    let filteredSubCategories = subCategories.slice();
  
    if (selectedCategory && selectedCategory !== "1") {
      filteredSubCategories = filteredSubCategories.filter(
        (subCategory) => subCategory._id === selectedCategory
      );
    }
  
    if (selectedSubCategory && selectedSubCategory !== "1") {
      filteredSubCategories = filteredSubCategories.filter(
        (subCategory) => subCategory._id === selectedSubCategory
      );
    }
  
    if (selectedCategoryCode && selectedCategoryCode !== "1") {
      filteredSubCategories = filteredSubCategories.filter(
        (subCategory) => subCategory._id === selectedCategoryCode
      );
    }
  
    setFilteredData(filteredSubCategories);
  };
  
  useEffect(() => {
    handleFilter();
  }, [selectedCategory, selectedSubCategory, selectedCategoryCode]);

  const columns = [
    {
      title: "Category",
      dataIndex: "parentCategory",
      sorter: (a, b) => a.parentCategory.length - b.parentCategory.length,
      key: "parentCategory",
    },
    {
      title: "Sub Category",
      dataIndex: "subCategoryName",
      sorter: (a, b) => a.subCategoryName.length - b.subCategoryName.length,
      key: "subCategoryName",
    },
    {
      title: "Category Code",
      dataIndex: "subCategoryCode",
      sorter: (a, b) => a.subCategoryCode.length - b.subCategoryCode.length,
      key: "subCategoryCode",
    },
    {
      title: "Action",
      render: (record) => (
        <>
          <Link className="me-3" to={`/dream-pos/product/editsubcategory-product/${record._id}`}>
            <img src={EditIcon} alt="Edit Icon" />
          </Link>
          <Link className="confirm-text" to="#" onClick={() => confirmText(record._id)}>
            <img src={DeleteIcon} alt="Delete Icon" />
          </Link>
        </>
      ),
    },
  ];

  if (loading) {
    return spinner;
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Product Sub Category list</h4>
              <h6>View/Search product Category</h6>
            </div>
            <div className="page-btn">
              <Link
                to="/dream-pos/product/addsubcategory-product"
                className="btn btn-added"
              >
                <img src={PlusIcon} alt="Add Icon" className="me-1" />
                Add Sub Category
              </Link>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <Tabletop data={subCategories} inputfilter={inputfilter} togglefilter={togglefilter} onFilter={handleSearch} />
              <div
                className={`card mb-0 ${inputfilter ? "toggleCls" : ""}`}
                id="filter_inputs"
                style={{ display: inputfilter ? "block" : "none" }}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg col-sm-6 col-12">
                      <div className="form-group">
                        <label>Category</label>
                        <Select2
                          className="select"
                          data={optionsCategory}
                          options={{
                            placeholder: "Choose Category",
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
                        <label>Sub Category</label>
                        <Select2
                          className="select"
                          data={optionsSubCategory}
                          options={{
                            placeholder: "Choose Sub Category",
                          }}
                          onSelect={(event) => {
                            const selectedSubCategory = event.params.data.id;
                            setSelectedSubCategory(selectedSubCategory);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg col-sm-6 col-12">
                      <div className="form-group">
                        <label>Category Code</label>
                        <Select2
                          className="select"
                          data={optionsCategoryCode}
                          options={{
                            placeholder: "Choose Category Code",
                          }}
                          onSelect={(event) => {
                            const selectedCategoryCode = event.params.data.id;
                            setSelectedCategoryCode(selectedCategoryCode);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg col-sm-6 col-12">
                      <div className="form-group">
                        <label>&nbsp;</label>
                        <button
                          className="btn btn-filters"
                          onClick={() => clearFilters()}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-responsive" id="pdf-content">
                <Table columns={columns} dataSource={filteredData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubCategoryList;
