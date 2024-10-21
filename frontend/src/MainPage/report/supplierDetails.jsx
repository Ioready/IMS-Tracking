/* eslint-disable react/no-unescaped-entities */
import React from "react";
// import Barcode from 'react-barcode';
// import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
// import { Link } from "feather-icons-react/build/IconComponents";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Pdf, Printer } from "../../EntryFile/imagePath";
// import axios from "axios";
// import { purchaseUrl } from "../../Apis/Api";
// import { useParams } from "react-router-dom/cjs/react-router-dom.min";
// import { useParams } from "react-router-dom/cjs/react-router-dom.min";
// import axios from "axios";
// import { purchaseUrl } from "../../Apis/Api";

const SupplierDetails = () => {
    const { purchaseDate, grandTotalNumber, quantity, status } = useParams();

    const handlePdfDownload = () => {
        const input = document.getElementById('pdf-content');

        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'pt', [canvas.width, canvas.height]);
            pdf.addImage(imgData, 'PNG', 0, 0);
            pdf.save('sale_details.pdf');
        });
    };


    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="page-title">
                        <h4>Purchase Details</h4>
                        <h6>Full details of a purchase</h6>
                    </div>
                </div>
                {/* /add */}
                <div className="row">
                    <div className="col-lg-12 col-sm-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-sales-split">
                                    <h2>Purchase Details</h2>
                                    <ul>
                                        <li>
                                            <button className="confirm-text" to="#" onClick={handlePdfDownload}>
                                                <img src={Pdf} alt="img" />
                                            </button>
                                        </li>
                                        <li>
                                            <button to="#" className="confirm-text" onClick={handlePrint}>
                                                <img src={Printer} alt="img" />
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                {/* <div className="bar-code-view"> */}
                                {/* <img src={barcode1} alt="barcode" /> */}
                                {/* <Barcode value={barcodeValue} /> */}
                                {/* <Link to="#" className="printimg"> */}
                                {/* <img src={Printer} alt="print" /> */}
                                {/* </Link> */}
                                {/* </div> */}
                                <div className="productdetails" id="pdf-content">
                                    <ul className="product-bar">
                                        <li>
                                            <h4>Purchase Date</h4>
                                            <h6>{purchaseDate}</h6>
                                        </li>
                                        <li>
                                            <h4>Purchased Amount</h4>
                                            <h6>{grandTotalNumber}</h6>
                                        </li>
                                        <li>
                                            <h4>Purchased Quantity</h4>
                                            <h6>{quantity}</h6>
                                        </li>
                                        <li>
                                            <h4>Status</h4>
                                            <h6>{status}</h6>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* /add */}
            </div>
        </div>
    );
};

export default SupplierDetails;
