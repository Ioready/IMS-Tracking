import React, { useState } from 'react'
import { Upload } from '../../EntryFile/imagePath';
import axios from 'axios';
import { productUrl } from '../../Apis/Api';

const ImportProduct = () => {
  const [file, setFile] = useState(null);
  function downloadCSV(data, filename) {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    if (navigator.msSaveBlob) { // For IE
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  function convertToCSV(data) {
    const rows = [];
    data.forEach(row => {
      const values = Object.values(row);
      const escapedValues = values.map(value => {
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      });
      rows.push(escapedValues.join(','));
    });
    return rows.join('\n');
  }

  // Example data
  const data = [
    { Product_Name: 'Iphone 15 pro', Category: 'Apple', SKU_code: 'PT001', Product_Cost: 13999, Product_Unit: 14999 },
    { Product_Name: 'Samsung s24', Category: 'Samsung', SKU_code: 'PT002', Product_Cost: 11999, Product_Unit: 12999 },
    { Product_Name: 'Pixel', Category: 'Google', SKU_code: 'PT003', Product_Cost: 10999, Product_Unit: 11999 }
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const uploadFile = async (e) => {
    if (!file) return;
    console.log(file);
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append('file', file);
      console.log(formData);
      const response = await axios.post(`${productUrl}/import-product`, formData)

      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Import Products</h4>
              <h6>Bulk upload your products</h6>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <div className="requiredfield">
                <h4>Field must be in csv format</h4>
              </div>
              <form onSubmit={uploadFile} action="">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <a className="btn btn-submit w-100" onClick={() => downloadCSV(data, 'example.csv')}>Download Sample File</a>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label> Upload CSV File</label>
                      <div className="image-upload">
                        <input type="file" accept=".csv"
                          onChange={handleFileChange} />
                        <div className="image-uploads">
                          <img src={Upload} alt="img" />
                          <h4>Drag and drop a file to upload</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12">
                    <div className="productdetails productdetailnew">
                      <ul className="product-bar">
                        <li>
                          <h4>Product Name</h4>
                          <h6 className="manitorygreen">This Field is required</h6>
                        </li>
                        <li>
                          <h4>Category</h4>
                          <h6 className="manitorygreen">This Field is required</h6>
                        </li>
                        <li>
                          <h4>SKU code</h4>
                          <h6 className="manitorygreen">This Field is required</h6>
                        </li>
                        <li>
                          <h4>Product Cost</h4>
                          <h6 className="manitorygreen">This Field is required</h6>
                        </li>
                        <li>
                          <h4>Product Price</h4>
                          <h6 className="manitorygreen">This Field is required</h6>
                        </li>
                        <li>
                          <h4>Product Unit</h4>
                          <h6 className="manitorygreen">This Field is required</h6>
                        </li>
                        <li>
                          <h4>Description</h4>
                          <h6 className="manitoryblue">Field optional</h6>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12">
                    <div className="productdetails productdetailnew">
                      <ul className="product-bar">
                        <li>
                          <h4>Minimum Qty</h4>
                          <h6 className="manitoryblue">Field optional</h6>
                        </li>
                        <li>
                          <h4>Quantity</h4>
                          <h6 className="manitoryblue">Field optional</h6>
                        </li>
                        <li>
                          <h4>Tax</h4>
                          <h6 className="manitoryblue">Field optional</h6>
                        </li>
                        <li>
                          <h4>Discount Type</h4>
                          <h6 className="manitoryblue">Field optional</h6>
                        </li>
                        <li>
                          <h4>Brand</h4>
                          <h6 className="manitoryblue">Field optional</h6>
                        </li>
                        <li>
                          <h4>Minimum Qty</h4>
                          <h6 className="manitoryblue">Field optional</h6>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group mb-0">
                      <button type='submit' href="#" className="btn btn-submit me-2">
                        Submit
                      </button>
                      <button href="#" className="btn btn-cancel">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
    </>
  )
}

export default ImportProduct;