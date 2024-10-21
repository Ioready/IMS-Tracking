import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Table from "../../EntryFile/datatable"
import Tabletop from "../../EntryFile/tabletop"
import {
  PlusIcon,
  EyeIcon,
  EditIcon,
  DeleteIcon,
} from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import axios from "axios";
import { productUrl, userUrl } from "../../Apis/Api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ProductList = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPermission, setSelectedPermission] = useState({})
  const spinner = LoadingSpinner()

  const [columnTitles] = useState([
    'Product Name', 'SKU', 'Category', 'Brand', 'Price', 'Unit', 'Qty', 'Created By', 'Action'
  ]);
  const history = useHistory()
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${productUrl}/category-list`);
        const categoryData = response.data.categoryData;
        setCategories(categoryData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const clearFilters = () => {
    setSelectedProduct("1");
    setSelectedCategory("1");
    setSelectedSubCategory("1");
    setSelectedBrand("1");
  };

  const [brands, setBrands] = useState([]);
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${productUrl}/brand-list`);
        const brandData = response.data.brandData;
        setBrands(brandData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const [subCategories, setSubCategories] = useState([]);
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(`${productUrl}/sub-category-list`);
        const subCategoryData = response.data.subCategoryData;
        setSubCategories(subCategoryData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, []);

  const [data, setData] = useState([]);

  const options = [
    { id: "1", text: "Choose Product" },
    ...data.map((product) => ({ id: product._id, text: product.productName })),
  ];

  const options2 = [
    { id: "1", text: "Choose Category" },
    ...categories.map((category) => ({
      id: category.categoryName,
      text: category.categoryName,
    })),
  ];

  const options3 = [
    { id: "1", text: "Choose Sub Category" },
    ...subCategories.map((subCategory) => ({
      id: subCategory.subCategoryName,
      text: subCategory.subCategoryName,
    })),
  ];

  const options4 = [
    { id: "1", text: "Brand" },
    ...brands.map((brand) => ({
      id: brand.brandName,
      text: brand.brandName,
    })),
  ];

  const [selectedProduct, setSelectedProduct] = useState("1");
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [selectedSubCategory, setSelectedSubCategory] = useState("1");
  const [selectedBrand, setSelectedBrand] = useState("1");

  const togglefilter = (value) => {
    setInputfilter(value);
  };

  const viewDetails = async (id) => {
    try {
      history.push(`/dream-pos/product/product-details/${id}`);
    } catch (error) {
      console.log(error);
      history.push('/error-500');
    }
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
        deleteProduct(id);
      }
    });
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${productUrl}/delete-product/${id}`);
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

  const handleSearch = (data) => {
    setFilteredData(data);
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      render: (text, record) => (
        <div className="productimgname">
          <Link to="#" className="product-img">
            <img alt="" src={record.image} />
          </Link>
          <Link to="#" style={{ fontSize: "15px", marginLeft: "10px" }}>
            {record.productName}
          </Link>
        </div>
      ),
      key: 'productName',
      sorter: (a, b) => a.productName.length - b.productName.length,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      sorter: (a, b) => a.sku.length - b.sku.length,
      key: 'sku',
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => a.category.length - b.category.length,
      key: 'category',
    },
    {
      title: "Brand",
      dataIndex: "brand",
      sorter: (a, b) => a.brand.length - b.brand.length,
      key: 'brand',
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      key: 'price',
      filters: [
        {
          text: 'Less than $50',
          value: 'lt50',
        },
        {
          text: '$50 - $100',
          value: '50-100',
        },
        {
          text: '$100 - $200',
          value: '100-200',
        },
        {
          text: 'More than $200',
          value: 'gt200',
        },
      ],
      onFilter: (value, record) => {
        const price = record.price;
        if (value === 'lt50') {
          return price < 50;
        } else if (value === '50-100') {
          return price >= 50 && price <= 100;
        } else if (value === '100-200') {
          return price > 100 && price <= 200;
        } else if (value === 'gt200') {
          return price > 200;
        }
        return false;
      },
    },
    {
      title: "Unit",
      dataIndex: "unit",
      sorter: (a, b) => a.unit.length - b.unit.length,
      key: 'unit',
    },
    {
      title: "Qty",
      dataIndex: "qty",
      sorter: (a, b) => a.qty - b.qty,
      key: 'qty',
      filters: [
        {
          text: 'Less than 10',
          value: 'lt10',
        },
        {
          text: '10 - 50',
          value: '10-50',
        },
        {
          text: '50 - 100',
          value: '50-100',
        },
        {
          text: 'More than 100',
          value: 'gt100',
        },
      ],
      onFilter: (value, record) => {
        const qty = record.qty;
        if (value === 'lt10') {
          return qty < 10;
        } else if (value === '10-50') {
          return qty >= 10 && qty <= 50;
        } else if (value === '50-100') {
          return qty > 50 && qty <= 100;
        } else if (value === 'gt100') {
          return qty > 100;
        }
        return false;
      },
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      sorter: (a, b) => a.createdBy.length - b.createdBy.length,
      key: 'createdBy',
    },
    {
      title: "Action",
      render: (record) => (
        <>
          {selectedPermission?.productView === true ? (
            <button
              className="confirm-text me-3"
              onClick={() => viewDetails(record._id)}
            >
              <img src={EyeIcon} alt="img" />
            </button>
          ) : (
            <div></div>
          )}
          {selectedPermission?.productEdit === true ? (
            <Link
              className="me-3"
              to={`/dream-pos/product/editproduct-product/${record._id}`}
            >
              <img src={EditIcon} alt="img" />
            </Link>
          ) : (
            <div></div>
          )}
          {selectedPermission?.productDelete === true ? (
            <button
              className="confirm-text"
              onClick={() => confirmText(record._id)}
            >
              <img src={DeleteIcon} alt="img" />
            </button>
          ) : (
            <div></div>
          )}
        </>
      ),
    },
  ];
  
  
  const products = async () => {
    try {
      await axios.get(`${productUrl}`).then((response) => {
        const datas = response.data
        setData(datas)
        setFilteredData(datas)
      })
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    products()
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
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    checkPermission()
  }, [])

  const handleFilter = () => {
    let filteredProducts = data.slice();

    if (selectedProduct && selectedProduct !== "1") {
      filteredProducts = filteredProducts.filter(
        (product) => product._id === selectedProduct
      );
    }

    if (selectedCategory && selectedCategory !== "1") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (selectedSubCategory && selectedSubCategory !== "1") {
      filteredProducts = filteredProducts.filter(
        (product) => product.subCategory === selectedSubCategory
      );
    }

    if (selectedBrand && selectedBrand !== "1") {
      filteredProducts = filteredProducts.filter(
        (product) => product.brand === selectedBrand
      );
    }
    setFilteredData(filteredProducts);
  };
  
  useEffect(() => {
    handleFilter();
  }, [data, selectedProduct, selectedCategory, selectedSubCategory, selectedBrand]);

  if (loading) {
    return spinner
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Product List</h4>
              <h6>Manage your products</h6>
            </div>
            {selectedPermission?.productCreate === true ? (
              <div className="page-btn">
                <Link
                  to="/dream-pos/product/addproduct-product"
                  className="btn btn-added"
                >
                  <img src={PlusIcon} alt="img" className="me-1" />
                  Add New Product
                </Link>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="card">
            <div className="card-body">
              <Tabletop
                data={data}
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
                        <div className="col-lg col-sm-6 col-12">
                          <div className="form-group">
                            <Select2
                              className="select"
                              data={options}
                              options={{
                                placeholder: selectedProduct === "1" ? "Choose Product" : options.find(option => option.id === selectedProduct)?.text,
                              }}
                              onSelect={(event) => {
                                const selectedProduct = event.params.data.id;
                                setSelectedProduct(selectedProduct);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg col-sm-6 col-12">
                          <div className="form-group">
                            <Select2
                              className="select"
                              data={options2}
                              options={{
                                placeholder: selectedCategory === "1" ? "Choose Category" : options2.find(option => option.id === selectedCategory)?.text,
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
                            <Select2
                              className="select"
                              data={options3}
                              options={{
                                placeholder: selectedSubCategory === "1" ? "Choose Sub Category" : options3.find(option => option.id === selectedSubCategory)?.text,
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
                            <Select2
                              className="select"
                              data={options4}
                              options={{
                                placeholder: selectedBrand === "1" ? "Brand" : options4.find(option => option.id === selectedBrand)?.text,
                              }}
                              onSelect={(event) => {
                                const selectedBrand = event.params.data.id;
                                setSelectedBrand(selectedBrand);
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

export default ProductList;
