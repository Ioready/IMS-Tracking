/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Table from "../../EntryFile/datatable";
import { Link } from "react-router-dom";
import Select2 from "react-select2-wrapper";
import Tabletop from "../../EntryFile/tabletop";
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
import { peopleUrl } from "../../Apis/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const StoreList = () => {
  const [inputfilter, setInputfilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const clearFilters = () => {
    setUserName("");
    setPhone("");
    setEmail("");
  };

  // const [checked, setChecked] = useState(false);

  // const handleStatus = async (id) => {
  //   await axios.put(`${peopleUrl}/update-status/${id}`, checked);
  //   setChecked(checked)
  // }

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
        deleteStore(id);
      }
    });
  };

  const deleteStore = async (id) => {
    try {
      // Make DELETE request to backend to delete product with ID
      await axios.delete(`${peopleUrl}/delete-store/${id}`);
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
  // const options = [
  //   { id: "Disable"},
  //   { id: "Enable"},
  // ];
  const [data, setData] = useState([]);

  useEffect(() => {
    const salesList = async () => {
      try {
        await axios.get(`${peopleUrl}/store-list`).then((response) => {
          const datas = response.data
          setData(datas)
          setFilteredData(datas)
        })
      } catch (error) {
        console.log(error);
      }
    }
    salesList()
  }, [])

  const handleSearch = (data) => {
    setFilteredData(data);
  };

  const handleFilter = () => {
    let filteredProducts = data.slice();

    if (userName) {
      filteredProducts = filteredProducts.filter(
        (product) => product.userName.includes(userName)
      );
    }

    if (phone) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.phone &&
          product.phone.toString().includes(phone)
      );
    }

    if (email) {
      filteredProducts = filteredProducts.filter(
        (product) => product.email.includes(email)
      );
    }

    setFilteredData(filteredProducts);
  };

  useEffect(() => {
    handleFilter();
  }, [data, userName, phone, email]);


  const columns = [
    {
      title: "Store Name",
      dataIndex: "storeName",
      sorter: (a, b) => a.storeName.length - b.storeName.length,
      key: "storeName"
    },
    {
      title: "User Name",
      dataIndex: "userName",
      sorter: (a, b) => a.userName.length - b.userName.length,
      key: "userName"
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone - b.phone,
      key: "phone"
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      key: "email"
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (e, record) => (
    //     <div className="status-toggle d-flex justify-content-between align-items-center">
    //       <input
    //         type="checkbox"
    //         id="user18"
    //         className="check"
    //         defaultChecked={e}
    //         checked={checked}
    //         onChange={()=> handleStatus(record._id)}
    //       />
    //       <label htmlFor="user18" className="checktoggle">
    //         checkbox
    //       </label>
    //     </div>
    //   ),
    // },
    {
      title: "Action",
      render: (record) => (
        <>
          <Link className="me-3" to={`/dream-pos/people/editstore-people/${record._id}`}>
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
              <h4>Store List</h4>
              <h6>Manage your Store</h6>
            </div>
            <div className="page-btn">
              <Link to="/dream-pos/people/addstore-people" className="btn btn-added">
                <img src={PlusIcon} alt="img" className="me-1" />
                Add Store
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <Tabletop data={data} onFilter={handleSearch} inputfilter={inputfilter} togglefilter={togglefilter} />
              {/* /Filter */}
              <div
                className={`card mb-0 ${ inputfilter ? "toggleCls" : ""}`}
                id="filter_inputs"
                style={{ display: inputfilter ? "block" :"none"}}
              >
                <div className="card-body pb-0">
                  <div className="row">
                  <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter User Name"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Phone Number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    {/* <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <Select2
                          className="select"
                          data={options}
                          options={{
                            placeholder: "Disable",
                          }}
                        />
                      </div>
                    </div> */}
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
export default StoreList;
