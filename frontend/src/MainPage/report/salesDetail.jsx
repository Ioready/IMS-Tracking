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
import { productUrl } from "../../Apis/Api";
import jsPDF from "jspdf";

const SalesDetail = () => {
    const { productNames, skuList, category, brand, soldAmount, soldQty, instockQty } = useParams();
    // const id = Id.id
    // const [saleDetail, setSaleDetail] = useState({})
    //   const [selectedProducts, setSelectedProducts] = useState([])


    // useEffect(() => {
    //     const salesDetails = async () => {
    //         try {
    //             await axios.get(`${productUrl}/view-details/${id}`).then((response) => {
    //                 const datas = response.data
    //                 console.log(datas);
    //                 setSaleDetail(datas)
    //             })
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    //     salesDetails()
    // }, [])

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

    //   const handleExcelDownload = () => {
    //     // Sample data (replace this with your actual data)
    //     const datas = [
    //       ['Product Name', 'Quantity', 'Price', 'Discount', 'TAX', 'SubTotal'],
    //       ...selectedProducts.map((item) => [
    //         item.productName,
    //         item.qty,
    //         item.price,
    //         item.discount,
    //         item.tax,
    //         item.subTotal
    //       ])
    //     ];

    //     const ws = XLSX.utils.aoa_to_sheet(datas);
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    //     // Generate Excel file and trigger download
    //     XLSX.writeFile(wb, 'sale_details.xlsx');
    //   };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="page-title">
                        <h4>Product Details</h4>
                        <h6>View Product details</h6>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="card-sales-split">
                            <h2>Customer Detail : {productNames}</h2>
                            <ul>
                                <li>
                                    <Link to="#" onClick={handlePdfDownload}>
                                        <img src={Pdf} alt="img" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" onClick={handlePrint}>
                                        <img src={Printer} alt="img" />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-12" id="pdf-content">
                            <div className="card">
                                <div className="card-body">
                                    {/* <div className="bar-code-view"> */}
                                    {/* <img src={barcode1} alt="barcode" /> */}
                                    {/* <Barcode value={barcodeValue} /> */}
                                    {/* <Link to="#" className="printimg"> */}
                                    {/* <img src={Printer} alt="print" /> */}
                                    {/* </Link> */}
                                    {/* </div> */}
                                    <div className="productdetails">
                                        <ul className="product-bar">
                                            <li>
                                                <h4>Product Name</h4>
                                                <h6>{productNames}</h6>
                                            </li>
                                            <li>
                                                <h4>Sku Number</h4>
                                                <h6>{skuList}</h6>
                                            </li>
                                            <li>
                                                <h4>Category</h4>
                                                <h6>{category}</h6>
                                            </li>
                                            <li>
                                                <h4>Brand</h4>
                                                <h6>{brand}</h6>
                                            </li>
                                            <li>
                                                <h4>Sold Amount</h4>
                                                <h6>{soldAmount}</h6>
                                            </li>
                                            <li>
                                                <h4>Sold Quantity</h4>
                                                <h6>{soldQty}</h6>
                                            </li>
                                            <li>
                                                <h4>Instock Quantity</h4>
                                                <h6>{instockQty}</h6>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link to="/dream-pos/report/salesreport" className="btn btn-submit me-2">
                            Back
                        </Link>
                        {/* <Link to="#" className="btn btn-cancel">
                  Cancel
                </Link> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesDetail;
