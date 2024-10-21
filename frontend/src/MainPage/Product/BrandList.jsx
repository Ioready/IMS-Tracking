import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Table from "../../EntryFile/datatable";
import Tabletop from "../../EntryFile/tabletop";
import { PlusIcon, EditIcon, DeleteIcon } from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import axios from "axios";
import { productUrl } from "../../Apis/Api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BrandList = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const spinner = LoadingSpinner();

  const [columnTitles] = useState([
    "Brand Name",
    "Brand Description",
    "Action",
  ]);
  const history = useHistory();
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${productUrl}/brand-list`);
        const brandData = response.data.brandData;
        setBrands(brandData);
        setFilteredData(brandData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const options = [
    { id: "1", text: "Choose Brand" },
    ...brands.map((brand) => ({
      id: brand.brandName,
      text: brand.brandName,
    })),
  ];

  const clearFilters = () => {
    setSelectedBrand("1");
    setSelectedDescription("");
  };

  const [selectedBrand, setSelectedBrand] = useState("1");
  const [selectedDescription, setSelectedDescription] = useState("");

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
        deleteBrand(id);
      }
    });
  };

  const deleteBrand = async (id) => {
    try {
      await axios.delete(`${productUrl}/delete-brand/${id}`);
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

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      className: "text-center",
      render: (text, record) => (
        <Link to="#" className="product-img text-center">
          <img
            alt=""
            src={record.image}
            style={{ height: "40px", width: "40px" }}
          />
        </Link>
      ),
      sorter: (a, b) => a.image.length - b.image.length,
      width: "150px",
      key: "image",
    },
    {
      title: "Brand Name",
      dataIndex: "brandName",
      sorter: (a, b) => a.brandName.length - b.brandName.length,
      key: "brandName",
    },
    {
      title: "Brand Description",
      dataIndex: "description",
      sorter: (a, b) => a.brandDescription.length - b.brandDescription.length,
      key: "description",
    },
    {
      title: "Action",
      render: (record) => (
        <>
          <>
            <Link className="me-3" to={`/dream-pos/product/editbrand-product/${record._id}`}>
              <img src={EditIcon} alt="img" />
            </Link>
            <Link className="confirm-text" to="#" onClick={() => confirmText(record._id)}>
              <img src={DeleteIcon} alt="img" />
            </Link>
          </>
        </>
      ),
    },
  ];

  useEffect(() => {
    handleFilter();
  }, [selectedBrand, selectedDescription]);

  const handleFilter = () => {
    let filteredBrands = brands.slice();

    if (selectedBrand && selectedBrand !== "1") {
      filteredBrands = filteredBrands.filter(
        (brand) => brand.brandName === selectedBrand
      );
    }

    if (selectedDescription) {
      filteredBrands = filteredBrands.filter((brand) =>
        brand.description.toLowerCase().includes(selectedDescription.toLowerCase())
      );
    }

    setFilteredData(filteredBrands);
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
              <h4>Brand List</h4>
              <h6>Manage your Brand</h6>
            </div>
            <div className="page-btn">
              <Link
                to="/dream-pos/product/addbrand-product"
                className="btn btn-added"
              >
                <img src={PlusIcon} alt="img" className="me-1" />
                Add Brand
              </Link>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <Tabletop
                data={brands}
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
                        <div className="col-lg-3 col-sm-6 col-12">
                          <div className="form-group">
                            <Select2
                              className="select"
                              data={options}
                              options={{
                                placeholder:
                                  selectedBrand === "1"
                                    ? "Choose Brand"
                                    : options.find(
                                        (option) =>
                                          option.id === selectedBrand
                                      )?.text,
                              }}
                              onSelect={(event) => {
                                const selectedBrand =
                                  event.params.data.id;
                                setSelectedBrand(selectedBrand);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-12">
                          <div className="form-group">
                            <input
                              type="text"
                              placeholder="Enter Brand Description"
                              className="form-control"
                              value={selectedDescription}
                              onChange={(e) =>
                                setSelectedDescription(e.target.value)
                              }
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
                <Table columns={columns} dataSource={filteredData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandList;
