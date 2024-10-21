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

const WareHouseList = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const spinner = LoadingSpinner();
  const history = useHistory();

  const [data, setData] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("1");
  const [selectedWarehouseCode, setSelectedWarehouseCode] = useState("1");
  const [selectedCreator, setSelectedCreator] = useState("1");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${productUrl}/ware-house-list`);
        const wareHouseData = response.data.wareHouseData;
        setData(wareHouseData);
        setFilteredData(wareHouseData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching warehouse data:", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const optionsWarehouse = [
    { id: "1", text: "Choose Warehouse" },
    ...data.map((warehouse) => ({ id: warehouse._id, text: warehouse.wareHouseName })),
  ];

  const optionsWarehouseCode = [
    { id: "1", text: "Choose Warehouse Code" },
    ...data.map((warehouse) => ({ id: warehouse._id, text: warehouse.wareHouseCode })),
  ];

  const optionsCreator = [
    { id: "1", text: "Choose Creator" },
    ...data.map((warehouse) => ({ id: warehouse._id, text: warehouse.createdBy })),
  ];

  const togglefilter = (value) => {
    setInputfilter(value);
  };
  
  const confirmText = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      confirmButtonClass: "btn btn-primary",
      cancelButtonClass: "btn btn-danger ml-1",
      buttonsStyling: false,
    }).then(function (t) {
      if (t.value) {
        deleteWareHouse(id);
      }
    });
  };
  
  const deleteWareHouse = async (id) => {
    try {
      await axios.delete(`${productUrl}/delete-ware-house/${id}`);
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
    setSelectedWarehouse("1");
    setSelectedWarehouseCode("1");
    setSelectedCreator("1");
  };

  const handleSearch = (data) => {
    setFilteredData(data);
  };

  const handleFilter = () => {
    let filteredWarehouses = data.slice();
  
    if (selectedWarehouse && selectedWarehouse !== "1") {
      filteredWarehouses = filteredWarehouses.filter(
        (warehouse) => warehouse._id === selectedWarehouse
      );
    }
  
    if (selectedWarehouseCode && selectedWarehouseCode !== "1") {
      filteredWarehouses = filteredWarehouses.filter(
        (warehouse) => warehouse._id === selectedWarehouseCode
      );
    }

    if (selectedCreator && selectedCreator !== "1") {
      filteredWarehouses = filteredWarehouses.filter(
        (warehouse) => warehouse._id === selectedCreator
      );
    }
  
    setFilteredData(filteredWarehouses);
  };

  useEffect(() => {
    handleFilter();
  }, [selectedWarehouse, selectedWarehouseCode, selectedCreator]);

  const columns = [
    {
      title: "Ware House Name",
      dataIndex: "wareHouseName",
      render: (text, record) => (
        <div className="productimgname">
          <Link to="#" className="product-img">
            <img alt="" src={record.image} />
          </Link>
          <Link to="#" style={{ fontSize: "15px", marginLeft: "10px" }}>
            {record.wareHouseName}
          </Link>
        </div>
      ),
      sorter: (a, b) => a.wareHouseName.length - b.wareHouseName.length,
      key: "wareHouseName",
    },
    {
      title: "Ware House Code",
      dataIndex: "wareHouseCode",
      sorter: (a, b) => a.wareHouseCode.length - b.wareHouseCode.length,
      key: "wareHouseCode",
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: (a, b) => a.description.length - b.description.length,
      key: "description",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      sorter: (a, b) => a.createdBy.length - b.createdBy.length,
      key: "createdBy",
    },
    {
      title: "Action",
      render: (record) => (
        <>
          <Link className="me-3" to={`/dream-pos/product/editwarehouse-product/${record._id}`}>
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
              <h4>Warehouse List</h4>
              <h6>View/Search Warehouse</h6>
            </div>
            <div className="page-btn">
              <Link
                to="/dream-pos/product/addwarehouse-product"
                className="btn btn-added"
              >
                <img src={PlusIcon} alt="Add Icon" className="me-1" />
                Add Warehouse
              </Link>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <Tabletop data={data} inputfilter={inputfilter} togglefilter={togglefilter} onFilter={handleSearch} />
              <div
                className={`card mb-0 ${inputfilter ? "toggleCls" : ""}`}
                id="filter_inputs"
                style={{ display: inputfilter ? "block" : "none" }}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg col-sm-6 col-12">
                      <div className="form-group">
                        <label>Warehouse Name</label>
                        <Select2
                          className="select"
                          data={optionsWarehouse}
                          options={{
                            placeholder: "Choose Warehouse",
                          }}
                          onSelect={(event) => {
                            const selectedWarehouse = event.params.data.id;
                            setSelectedWarehouse(selectedWarehouse);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg col-sm-6 col-12">
                      <div className="form-group">
                        <label>Warehouse Code</label>
                        <Select2
                          className="select"
                          data={optionsWarehouseCode}
                          options={{
                            placeholder: "Choose Warehouse Code",
                          }}
                          onSelect={(event) => {
                            const selectedWarehouseCode = event.params.data.id;
                            setSelectedWarehouseCode(selectedWarehouseCode);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg col-sm-6 col-12">
                      <div className="form-group">
                        <label>Creator</label>
                        <Select2
                          className="select"
                          data={optionsCreator}
                          options={{
                            placeholder: "Choose Creator",
                          }}
                          onSelect={(event) => {
                            const selectedCreator = event.params.data.id;
                            setSelectedCreator(selectedCreator);
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

export default WareHouseList;
