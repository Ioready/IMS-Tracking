/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import Tabletop from "../../EntryFile/tabletop"
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import {
  PlusIcon,
  MacbookIcon,
  IphoneIcon,
  search_whites,
  EarpodIcon,
  OrangeImage,
  StawberryImage,
  AvocatImage,
  EditIcon,
  DeleteIcon,
  UnpaidGray,
} from "../../EntryFile/imagePath";
import axios from "axios";
import { peopleUrl, productUrl, userUrl } from "../../Apis/Api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const QuotationList = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [loading, setLoading] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState({})
  const [filteredData, setFilteredData] = useState([]);
  const [productData, setProductData] = useState([])
  const [customerData, setCustomerData] = useState([])
  const history = useHistory()

  const options = [
    { id: "1", text: "Choose Product" },
    ...productData.map((product) => ({ id: product.productName, text: product.productName })),
  ];
  const options2 = [
    { id: 1, text: "Choose Category", text: "Choose Category" },
    { id: 2, text: "Computers", text: "Computers" },
    { id: 3, text: "Fruits", text: "Fruits" },
  ];
  const options3 = [
    { id: 1, text: "Choose Customers", text: "Choose Customers" },
    ...customerData.map((customer) => ({ id: customer.customerName, text: customer.customerName })),
  ];
  const options4 = [
    { id: "Choose Status", text: "Choose Status" },
    { id: "Pending", text: "Pending" },
    { id: "Received", text: "Received" },
  ];
  // const options5 = [
  //   { id: 1, text: "Price", text: "Price" },
  //   { id: 2, text: "150.00", text: "150.00" },
  // ];

  const [selectedProducts, setSelectedProducts] = useState("1");
  const [selectedCustomers, setSelectedCustomers] = useState("1");
  const [selectedStatus, setSelectedStatus] = useState("1");
  const [referenceFilter, setReferenceFilter] = useState("");
  const [grandTotalFilter, setGrandTotalFilter] = useState("");

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
        deleteQuotaion(id);
      }
    });
  };

  const deleteQuotaion = async (id) => {
    try {
      // Make DELETE request to backend to delete product with ID
      await axios.delete(`${peopleUrl}/delete-quotation/${id}`);
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

  const [data, setData] = useState([
    // {
    //   id: 1,
    //   image: MacbookIcon,
    //   productName: "Macbook Pro",
    //   reference: "PT001",
    //   customerName: "Thomas",
    //   status: "Sent",
    //   grandTotal: "550",
    // },
    // {
    //   id: 2,
    //   image: OrangeImage,
    //   productName: "Orange",
    //   reference: "PT002",
    //   customerName: "Raina",
    //   status: "Orderded",
    //   grandTotal: "789",
    // },
  ]);

  const clearFilters = () => {
    setSelectedProducts("1");
    setSelectedCustomers("1");
    setSelectedStatus("1");
    setReferenceFilter("");
    setGrandTotalFilter("");
  };

  useEffect(() => {
    const qoutationList = async () => {
      try {
        setLoading(true)
        await axios.get(`${peopleUrl}/quotation-list`).then((response) => {
          const datas = response.data
          setData(datas)
          setFilteredData(datas);
        })
        setLoading(false)
      } catch (error) {
        console.log(error);
        history.push('/error-500')
      }
    }
    qoutationList()
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


  const products = async () => {
    try {
      await axios.get(`${productUrl}`).then((response) => {
        const datas = response.data
        setProductData(datas)
      })
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    products()
  }, [])

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${peopleUrl}`);
        const categoryData = response.data;
        setCustomerData(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleSearch = (data) => {
    setFilteredData(data);
  };

  const handleFilter = () => {
    let filteredProducts = data.slice();

    if (selectedProducts && selectedProducts !== "1") {
      filteredProducts = filteredProducts.filter(
        (product) => product.selectedProducts[0].productName === selectedProducts
      );
    }

    if (selectedCustomers && selectedCustomers !== "1") {
      filteredProducts = filteredProducts.filter(
        (purchase) => purchase.customerName === selectedCustomers
      );
    }

    if (selectedStatus && selectedStatus !== "1") {
      filteredProducts = filteredProducts.filter(
        (purchase) => purchase.status === selectedStatus
      );
    }

    if (grandTotalFilter) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.grandTotalNumber &&
          product.grandTotalNumber.toString().includes(grandTotalFilter)
      );
    }
  
    if (referenceFilter) {
      filteredProducts = filteredProducts.filter(
        (product) => product.reference.includes(referenceFilter)
      );
    }
  

    setFilteredData(filteredProducts);
  };

  useEffect(() => {
    handleFilter();
  }, [data, selectedProducts, selectedCustomers, selectedStatus, grandTotalFilter, referenceFilter]);



  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      render: (text, record) => (
        <div className="productimgname">
          {record.selectedProducts && record.selectedProducts.length > 0 && (
            <>
              <Link to="#" className="product-img">
                <img alt="" src={record.selectedProducts[0].image} />
              </Link>
              <Link to="#" style={{ fontSize: "15px", marginLeft: "10px" }}>
                {record.selectedProducts[0].productName}
              </Link>
            </>
          )}
        </div>
      ),
      sorter: (a, b) => a.selectedProducts[0].productName.length - b.selectedProducts[0].productName.length,
      key: "productName"
    },
    {
      title: "Reference",
      dataIndex: "reference",
      sorter: (a, b) => a.reference.length - b.reference.length,
      key: "reference"
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      sorter: (a, b) => a.customerName.length - b.customerName.length,
      key: "customerName"
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <span
          className={
            text === "Received"
              ? "badges bg-lightgreen"
              : text === "Pending"
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
      title: "Grand Total",
      dataIndex: "grandTotalNumber",
      sorter: (a, b) => a.grandTotalNumber - b.grandTotalNumber,
      key: "grandTotalNumber"
    },
    {
      title: "Action",
      render: (record) => (
        <>
          {selectedPermission.quotationEdit === true ? (
            <Link className="me-3" to={`/dream-pos/quotation/editquotation-quotation/${record._id}`}>
              <img src={EditIcon} alt="img" />
            </Link>
          ) : (
            <div></div>
          )}
          {selectedPermission.quotationDelete === true ? (
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
  

  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Quotation List</h4>
              <h6>Manage your Quotations</h6>
            </div>
            {selectedPermission.quotationCreate === true ? (
              <div className="page-btn">
                <Link
                  to="/dream-pos/quotation/addquotation-quotation"
                  className="btn btn-added"
                >
                  <img src={PlusIcon} alt="img" className="me-1" />
                  Add New Quoation
                </Link>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <Tabletop data={data} inputfilter={inputfilter} togglefilter={togglefilter}  onFilter={handleSearch} />
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
                                placeholder: selectedProducts === "1" ? "Choose Product" : options.find(option => option.id === selectedProducts)?.text,
                              }}
                              onSelect={(event) => {
                                const selectedProducts = event.params.data.id;
                                setSelectedProducts(selectedProducts);
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
                            <Select2
                              className="select"
                              data={options3}
                              options={{
                                placeholder: selectedCustomers === "1" ? "Choose Customer" : options3.find(option => option.id === selectedCustomers)?.text,
                              }}
                              onSelect={(event) => {
                                const selectedCustomers = event.params.data.id;
                                setSelectedCustomers(selectedCustomers);
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
                                placeholder: selectedStatus === "1" ? "Choose Status" : options4.find(option => option.id === selectedStatus)?.text,
                              }}
                              onSelect={(event) => {
                                const selectedStatus = event.params.data.id;
                                setSelectedStatus(selectedStatus);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg col-sm-6 col-12 ">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Grand Total"
                                value={grandTotalFilter}
                                onChange={(e) => setGrandTotalFilter(e.target.value)}
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
export default QuotationList;
