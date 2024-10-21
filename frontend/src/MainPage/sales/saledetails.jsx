/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Pdf,
  Excel,
  Product7,
  Printer,
  EditIcon,
  Calendar,
  Product8,
  Product1,
} from "../../EntryFile/imagePath";
import * as XLSX from 'xlsx';
import { pdfjs } from 'react-pdf';
import html2canvas from 'html2canvas';
import "react-select2-wrapper/css/select2.css";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { peopleUrl, settingsUrl } from "../../Apis/Api";
import jsPDF from "jspdf";

const SalesDetail = () => {
  const Id = useParams()
  const id = Id.id
  const [saleDetail, setSaleDetail] = useState(null)
  const [currencyData, setCurrencyData] = useState({})
  const [selectedProducts, setSelectedProducts] = useState([])

  let discount = 0
  let taxAmount = 0
  let orderPercentage = 0
  let subTotal = 0
  let grandTotal = 0

  useEffect(() => {
    const salesDetails = async () => {
      try {
        await axios.get(`${peopleUrl}/get-sale-details/${id}`).then((response) => {
          const datas = response.data
          console.log(datas);
          setSaleDetail(datas)
          setSelectedProducts(response.data.selectedProducts)
        })
      } catch (error) {
        console.log(error);
      }
    }
    salesDetails()
  }, [])

  useEffect(() => {
    const currencyData = async () => {
      try {
        await axios.get(`${settingsUrl}/get-currency`).then((response) => {
          const data = response.data[0]
          setCurrencyData(data)
        })
      } catch (error) {
        console.log(error);
      }
    }
    currencyData()
  }, [])
  // const options = [
  //   { id: "Completed", text: "Completed" },
  //   { id: "Inprogess", text: "Inprogess" },
  // ];

  const handlePdfDownload = () => {
    const input = document.getElementById('pdf-content');

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', [canvas.width, canvas.height]);
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('sale_details.pdf');
    });
  };

  const handleExcelDownload = () => {
    // Sample data (replace this with your actual data)
    const datas = [
      ['Product Name', 'Quantity', 'Price', 'Discount', 'TAX', 'SubTotal'],
      ...selectedProducts.map((item) => [
        item.productName,
        item.qty,
        item.price,
        item.discount,
        item.tax,
        item.subTotal
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(datas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, 'sale_details.xlsx');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Sale Details</h4>
            <h6>View sale details</h6>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="card-sales-split">
              <h2>Sale Detail : {saleDetail && <span>{saleDetail.reference}</span>}</h2>
              <ul>
                <li>
                  <Link to={`/dream-pos/sales/edit-sales/${id}`}>
                    <img src={EditIcon} alt="img" />
                  </Link>
                </li>
                <li>
                  <Link to="#" onClick={handlePdfDownload}>
                    <img src={Pdf} alt="img" />
                  </Link>
                </li>
                <li>
                  <Link to="#" onClick={handleExcelDownload}>
                    <img src={Excel} alt="img" />
                  </Link>
                </li>
                <li>
                  <Link to="#" onClick={handlePrint}>
                    <img src={Printer} alt="img" />
                  </Link>
                </li>
              </ul>
            </div>
            <div
              id="pdf-content"
              className="invoice-box table-height"
              style={{
                maxWidth: 1600,
                width: "100%",
                overflow: "auto",
                margin: "15px auto",
                padding: 0,
                fontSize: 14,
                lineHeight: "24px",
                color: "#555",
              }}
            >
              <table
                cellPadding={0}
                cellSpacing={0}
                style={{
                  width: "100%",
                  lineHeight: "24px",
                  textAlign: "left",
                }}
              >
                <tbody>
                  <tr className="top">
                    <td
                      colSpan={6}
                      style={{ padding: 5, verticalAlign: "top" }}
                    >
                      <table
                        style={{
                          width: "100%",
                          lineHeight: "24px",
                          textAlign: "left",
                        }}
                      >
                        <tbody>
                          <tr>
                            <td
                              style={{
                                padding: 5,
                                verticalAlign: "top",
                                textAlign: "left",
                                paddingBottom: 20,
                              }}
                            >
                              <font
                                style={{
                                  verticalAlign: "top",
                                  marginBottom: 25,
                                }}
                              >
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#7367F0",
                                    fontWeight: 600,
                                    lineHeight: "35px",
                                  }}
                                >
                                  Customer Info
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  {saleDetail && <span>{saleDetail.customerName.customerName}</span>}
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  {saleDetail && <span>{saleDetail.customerName.email}</span>}
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  {saleDetail && <span>{saleDetail.customerName.phone}</span>}
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  {saleDetail && <span>{saleDetail.customerName.address}</span>}
                                </font>
                              </font>
                              <br />
                            </td>
                            <td
                              style={{
                                padding: 5,
                                verticalAlign: "top",
                                textAlign: "left",
                                paddingBottom: 20,
                              }}
                            >
                              <font
                                style={{
                                  verticalAlign: "top",
                                  marginBottom: 25,
                                }}
                              >
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#7367F0",
                                    fontWeight: 600,
                                    lineHeight: "35px",
                                  }}
                                >
                                  Company Info
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  {saleDetail && <span>{saleDetail.supplierName.supplierName}</span>}
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  {saleDetail && <span>{saleDetail.supplierName.email}</span>}
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {saleDetail && <span>{saleDetail.supplierName.phone}</span>}
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  {saleDetail && <span>{saleDetail.supplierName.address}</span>}
                                </font>
                              </font>
                              <br />
                            </td>
                            <td
                              style={{
                                padding: 5,
                                verticalAlign: "top",
                                textAlign: "left",
                                paddingBottom: 20,
                              }}
                            >
                              <font
                                style={{
                                  verticalAlign: "top",
                                  marginBottom: 25,
                                }}
                              >
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#7367F0",
                                    fontWeight: 600,
                                    lineHeight: "35px",
                                  }}
                                >
                                  Invoice Info
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  Reference{" "}
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  Payment Status
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  Status
                                </font>
                              </font>
                              <br />
                            </td>
                            <td
                              style={{
                                padding: 5,
                                verticalAlign: "top",
                                textAlign: "right",
                                paddingBottom: 20,
                              }}
                            >
                              <font
                                style={{
                                  verticalAlign: "top",
                                  marginBottom: 25,
                                }}
                              >
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#7367F0",
                                    fontWeight: 600,
                                    lineHeight: "35px",
                                  }}
                                >
                                  &nbsp;
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#000",
                                    fontWeight: 400,
                                  }}
                                >
                                  {saleDetail && <span>{saleDetail.reference}</span>}
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#2E7D32",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  {saleDetail && <span>{saleDetail.payment_status}</span>}
                                </font>
                              </font>
                              <br />
                              <font style={{ verticalAlign: "top" }}>
                                <font
                                  style={{
                                    verticalAlign: "top",
                                    fontSize: 14,
                                    color: "#2E7D32",
                                    fontWeight: 400,
                                  }}
                                >
                                  {" "}
                                  {saleDetail && <span>{saleDetail.status}</span>}
                                </font>
                              </font>
                              <br />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr className="heading " style={{ background: "#F3F2F7" }}>
                    <td
                      style={{
                        padding: 10,
                        verticalAlign: "middle",
                        fontWeight: 600,
                        color: "#5E5873",
                        fontSize: 14,
                      }}
                    >
                      Product Name
                    </td>
                    <td
                      style={{
                        padding: 10,
                        verticalAlign: "middle",
                        fontWeight: 600,
                        color: "#5E5873",
                        fontSize: 14,
                      }}
                    >
                      QTY
                    </td>
                    <td
                      style={{
                        padding: 10,
                        verticalAlign: "middle",
                        fontWeight: 600,
                        color: "#5E5873",
                        fontSize: 14,
                      }}
                    >
                      Price
                    </td>
                    <td
                      style={{
                        padding: 10,
                        verticalAlign: "middle",
                        fontWeight: 600,
                        color: "#5E5873",
                        fontSize: 14,
                      }}
                    >
                      Discount
                    </td>
                    <td
                      style={{
                        padding: 10,
                        verticalAlign: "middle",
                        fontWeight: 600,
                        color: "#5E5873",
                        fontSize: 14,
                      }}
                    >
                      TAX
                    </td>
                    <td
                      style={{
                        padding: 10,
                        verticalAlign: "middle",
                        fontWeight: 600,
                        color: "#5E5873",
                        fontSize: 14,
                      }}
                    >
                      Subtotal
                    </td>
                  </tr>
                  {selectedProducts.map((product, index) => (
                    <tr key={index}
                      className="details"
                      style={{ borderBottom: "1px solid #E9ECEF" }}
                    >
                      <td
                        style={{
                          padding: 10,
                          verticalAlign: "top",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={product.image}
                          alt="img"
                          className="me-2"
                          style={{ width: 40, height: 40 }}
                        />
                        {product.productName}
                      </td>
                      <td style={{ padding: 10, verticalAlign: "top" }}>{product.qty}</td>
                      <td style={{ padding: 10, verticalAlign: "top" }}>
                        {product.price}
                      </td>
                      <td style={{ padding: 10, verticalAlign: "top" }}>{product.discount}</td>
                      <td style={{ padding: 10, verticalAlign: "top" }}>{product.tax}</td>
                      <h1 hidden>{discount = parseFloat(product.discount)}</h1>
                      <h1 hidden>{taxAmount = parseFloat(product.tax)}</h1>
                      <h1 hidden>{subTotal = (product.qty * product.price) - discount + ((product.qty * product.price) * taxAmount) / 100}</h1>
                      <td style={{ padding: 10, verticalAlign: "top" }}>
                        {subTotal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="row">
              {/* <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Order Tax</label>
                  <input type="text" />
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Discount</label>
                  <input type="text" />
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Shipping</label>
                  <input type="text" />
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Status</label>
                  <Select2
                    className="select"
                    data={options}
                    options={{
                      placeholder: "Choose Status",
                    }}
                  />
                </div>
              </div> */}
              <div className="row">
                <div className="col-lg-6 ">
                  <div className="total-order w-100 max-widthauto m-auto mb-4">
                    <ul>
                      <li>
                        <h4>Order Tax</h4>
                        <h1 hidden>{saleDetail && <span>{orderPercentage = saleDetail.orderTax * 100}</span>}</h1>
                        <h5>{currencyData.currencySymbol} {saleDetail && <span>{saleDetail.orderTax}</span>}({orderPercentage}%)</h5>
                      </li>
                      <li>
                        <h4>Discount </h4>
                        <h5>{currencyData.currencySymbol} {saleDetail && <span>{saleDetail.totalDiscount}</span>}</h5>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-6 ">
                  <div className="total-order w-100 max-widthauto m-auto mb-4">
                    <ul>
                      <li>
                        <h4>Shipping</h4>
                        <h5>{currencyData.currencySymbol} {saleDetail && <span>{saleDetail.shipping}</span>}</h5>
                      </li>
                      <li className="total">
                        <h4>Grand Total</h4>
                        <h5>{currencyData.currencySymbol} {saleDetail && <span>{saleDetail.grandTotalNumber}</span>}</h5>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <Link to="/dream-pos/sales/saleslist" className="btn btn-submit me-2">
                  Back
                </Link>
                {/* <Link to="#" className="btn btn-cancel">
                  Cancel
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDetail;
