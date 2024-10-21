/* eslint-disable no-dupe-keys */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import Barcode from 'react-barcode';
import { Scanner } from "../../EntryFile/imagePath";
import Table from "../../EntryFile/datatables";

// import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { productUrl } from "../../Apis/Api";
import axios from "axios";
// import GeneratePDF from "./generatePdf";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'
import { toast } from "react-toastify";

// const options = [
//   { id: 1, text: "36mm (1.4inch)", text: "36mm (1.4inch)" },
//   { id: 2, text: "12mm (1inch)", text: "12mm (1inch)" },
// ];


const PrintBarcode = () => {
  const [data, setData] = useState([]);
  const [barcodeValue, setBarcodeValue] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [productList, setProductList] = useState([]);
  // const [showPdf, setShowPdf] = useState(false);

  useEffect(() => {
    const products = async () => {
      try {
        await axios.get(`${productUrl}`).then((response) => {
          const datas = response.data
          setProductList(datas)
        })
      } catch (error) {
        console.log(error);
      }
    }
    products()
  }, [])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = productList.filter((product) =>
    new RegExp(searchQuery, 'i').test(product.sku) || new RegExp(searchQuery, 'i').test(product.productName)
  );

  const handleSelectProduct = async (selectedProduct) => {
    const sku = selectedProduct.sku
    setSearchQuery('');
    setBarcodeValue(sku);
    try {
      await axios.post(`${productUrl}/filtered-data?sku=${sku}`).then((response) => {
        const datas = response.data
        setData(datas)
      })
    } catch (error) {
      console.log(error);
    }
  };

  // const handleSelectSize = (value) => {
  //   setSelectedSize(value);
  // };

  // const handleGeneratePDF = () => {
  //   setShowPdf(true)
  // }

  
  const handleGeneratePDF = () => {
    const input = document.getElementById('pdf-content');

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', [canvas.width, canvas.height]);
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('barcode.pdf');
      toast.success('Barcode Download Success');
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "productName",
    },
    {
      title: "SKU",
      dataIndex: "sku",
    },
    {
      title: "Qty",
      dataIndex: "qty",
      width: "200px",
    },

  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Print Barcode</h4>
              <h6>Print product barcodes</h6>
            </div>
          </div>
          {/* /add */}
          <div className="card">
            <div className="card-body">
              <div className="requiredfield">
                <h4>
                  The field labels marked with * are required input fields.
                </h4>
              </div>
              <div className="form-group">
                <label>Product Name</label>
                <div className="input-groupicon">
                  <input
                    type="text"
                    placeholder="Please type product code and select..."
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                  <div className="addonset">
                    <img src={Scanner} alt="img" />
                  </div>
                </div>
                {searchQuery ? (
                  <ul className="product-list">
                    {filteredProducts.map((product) => (
                      <li key={product.sku} onClick={() => handleSelectProduct(product)}>
                        {product.sku} - {product.productName}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div></div>
                )}
              </div>
              {barcodeValue ? (
                <div className="form-group" id="pdf-content">
                  <label>Barcode</label>
                  <Barcode value={barcodeValue} />
                </div>
              ) : (
                <div></div>
              )}
              <div className="table-responsive table-height">
                <Table columns={columns} dataSource={data} />
              </div>
              <div className="row">
                {/* <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Paper Size</label>
                    <Select2
                      className="select"
                      data={options}
                      options={{
                        placeholder: "36mm (1.4inch)",
                      }}
                    // onChange={(e) => handleSelectSize(e.target.value)}
                    />
                  </div>
                </div> */}
                {/* {showPdf ? (
                  <GeneratePDF barcodeValue={barcodeValue} />
                ) : ( */}
                  <div className="col-lg-12">
                    <button type="button" onClick={handleGeneratePDF} className="btn btn-submit me-2">Submit</button>
                    <button className="btn btn-cancel">Cancel</button>
                  </div>
                {/* )} */}
              </div>
            </div>
          </div>
          {/* /add */}
        </div>
      </div>
    </>
  );
};

export default PrintBarcode;
