/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PlusIcon,
  Search,
  Excel,
  Printer,
  Pdf,
  DeleteIcon,
  EditIcon,
} from "../../EntryFile/imagePath";
import Table from "../../EntryFile/datatable";
import "react-select2-wrapper/css/select2.css";
import Swal from "sweetalert2";
import axios from "axios";
import { settingsUrl } from "../../Apis/Api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const GroupPermission = () => {
  const confirmText = () => {
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
      t.value &&
        Swal.fire({
          type: "success",
          title: "Deleted!",
          text: "Your file has been deleted.",
          confirmButtonClass: "btn btn-success",
        });
    });
  };
  const options = [
    { id: 1, text: "Active", text: "Active" },
    { id: 2, text: "Inactive", text: "Inactive" },
  ];

  const handlePdfDownload = () => {
    const input = document.getElementById('pdf-content');

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', [canvas.width, canvas.height]);
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('group_permissions.pdf');
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const [data, setData] = useState([
    // {
    //   id: 1,
    //   Role: "Admin",
    //   Description: "Owner",
    // },
    // {
    //   id: 2,
    //   Role: "Purchase",
    //   Description: "Purchase Permission",
    // },
    // {
    //   id: 3,
    //   Role: "Sales",
    //   Description: "Sales Permission",
    // },
  ]);

  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const settings = async () => {
      try {
        await axios.get(`${settingsUrl}/grouppermissions`).then((response) => {
          const datas = response.data
          setData(datas)
          setFilteredData(datas);
        })
      } catch (error) {
        console.log(error);
      }
    }
    settings()
  }, [])

    
  useEffect(() => {
    const fetchData = async () => {
      const filteredDatas = data.filter((item) => {
        return Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      setFilteredData(filteredDatas)
    }
    fetchData()
  }, [data, searchTerm]);


  const columns = [
    {
      title: "Role",
      dataIndex: "role",
      render: (text, record) => <>{text}</>,
      sorter: (a, b) => a.role.length - b.role.length,
      key: "role"
    },
    {
      title: "Description",
      dataIndex: "roleDescription",
      render: (text, record) => <div>{text}</div>,
      sorter: (a, b) => a.roleDescription.length - b.roleDescription.length,
      key: "roleDescription"
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <>
          {text === true && (
            <span className="badges bg-lightgreen">Active</span>
          )}
          {text === false && <span className="badges bg-lightred">Non-Active</span>}
        </>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
      key: "status"
    },
    {
      title: "Action",
      className: "text-end",
      render: (text, record) => (
        <div className="text-end">
          <Link className="me-3" to={`/dream-pos/settings/editpermission/${record._id}`}>
            <img src={EditIcon} alt="img" />
          </Link>
          {/* <Link className="me-3 confirm-text" to="#" onClick={confirmText}>
            <img src={DeleteIcon} alt="img" />
          </Link> */}
        </div>
      ),
      // sorter: (a, b) => a.Amount.length - b.Amount.length,
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Group Permissions</h4>
              <h6>Manage Group Permissions</h6>
            </div>
            <div className="page-btn">
              <Link
                to="/dream-pos/settings/createpermission"
                className="btn btn-added"
              >
                <img src={PlusIcon} alt="img" className="me-2" />
                Add Group Permission
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <div className="table-top">
                <div className="search-set">
                  <div className="search-input">
                    <input
                      className="form-control form-control-sm search-icon"
                      type="search"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <a className="btn btn-searchset">
                      <img src={Search} alt="img" />
                    </a>
                  </div>
                </div>
                <div className="wordset">
                  <ul>
                    <li>
                      <a
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="pdf"
                        onClick={handlePdfDownload}
                      >
                        <img src={Pdf} alt="img" />
                      </a>
                    </li>
                    {/* <li>
                      <a
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="excel"
                      >
                        <img src={Excel} alt="img" />
                      </a>
                    </li> */}
                    <li>
                      <a
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="print"
                        onClick={handlePrint}
                      >
                        <img src={Printer} alt="img" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="table-responsive" id="pdf-content">
                <Table
                  columns={columns}
                  dataSource={filteredData}
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
    </>
  );
};

export default GroupPermission;
