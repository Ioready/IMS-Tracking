/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Plus, Upload } from "../../EntryFile/imagePath";
import { Link } from "react-router-dom";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import axios from "axios";
import { toast } from "react-toastify";
import { peopleUrl, purchaseUrl } from "../../Apis/Api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ImportPurchase = () => {
  const [supplier, setSupplier] = useState('')
  const [options, setOptions] = useState([])
  const [status, setStatus] = useState('Pending')
  const [file, setFile] = useState(null);
  const [productFile, setProductFile] = useState([])
  const [orderTax, setOrderTax] = useState('0.00')
  const [discount, setDiscount] = useState('0.00')
  const [shipping, setShipping] = useState(0)
  const [description, setDescription] = useState('')
  const [submitClicked, setSubmitClicked] = useState(false);
  const history = useHistory()
  const purchaseDatas = { supplier, orderTax, discount, shipping, description, status, productFile }

  const options1 = [
    { id: "Pending", text: "Pending" },
    { id: "Received", text: "Received" },
  ];

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        await axios.get(`${peopleUrl}/suppliers`).then((response) => {
          const datas = response.data.map((supplier) => ({
            id: supplier._id,
            text: supplier.supplierName
          }));
          setOptions(datas)
        })
      } catch (error) {
        console.log(error);
      }
    }
    fetchOptions()
  }, [])

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
    const headers = Object.keys(data[0]); // Get the keys of the first object as headers
    const rows = [];

    // Push the headers as the first row
    rows.push(headers.join(','));

    // Convert each row of data to CSV format
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      });
      rows.push(values.join(','));
    });

    return rows.join('\n');
  }

  const data = [
    { productName: 'Apple 15 pro', quntity: 1, price: 1499, discount: '2%', tax: '1%', taxAmount: 14.99, unit: 1499, subTotal: 1511.99 },
  ];

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault(); //
    if (!file) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await axios.post(`${purchaseUrl}/upload-csv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('File uploaded:', response.data);
      setProductFile(response.data)
      toast.success('File upload successful')
      history.push('/dream-pos/purchase/importpurchase-purchase');
      // You can handle success here
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error
    }
  };

  const addimportPurchase = async (e) => {
    try {
      e.preventDefault();
      setSubmitClicked(true)

      if (!file || !supplier) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        return;
      }
      await axios.post(`${purchaseUrl}/add-import-purchase`, purchaseDatas);
      toast.success('Import Purchase added Successful')
      history.push('/dream-pos/purchase/purchaselist-purchase');
    } catch (error) {
      console.log(error);
    }
  };




  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Import Purchase</h4>
              <h6>Add Purchase</h6>
            </div>
          </div>
          <form action="" onSubmit={addimportPurchase}>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label className={`${submitClicked && !supplier ? 'error-message' : ''}`}>Supplier Name</label>
                      <div className="row">
                        <div className="col-lg-10 col-sm-10 col-10">
                          <Select2
                            className="select"
                            data={options}
                            value={supplier}
                            onChange={(e) => setSupplier(e.target.value)}
                            options={{
                              placeholder: "Select",
                            }}
                          />
                          {submitClicked && !supplier && (
                            <span className="error-message">Supplier is required.</span>
                          )}
                        </div>
                        <div className="col-lg-2 col-sm-2 col-2 ps-0">
                          <div className="add-icon">
                            <Link to="#">
                              <img src={Plus} alt="img" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Purchase Status </label>
                      <Select2
                        className="select"
                        data={options1}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        options={{
                          placeholder: "Select",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-sm-6 col-12">
                    <div className="row">
                      <div className="col-lg-3 col-sm-6 col-12">
                        <div className="form-group">
                          <a className="btn btn-submit w-100" onClick={() => downloadCSV(data, 'example.csv')}>
                            Download Sample File
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className={`form-group ${submitClicked && !file ? 'error' : ''}`}>
                      <label className={`${submitClicked && !file ? 'error-message' : ''}`}>Upload CSV File</label>
                      <div className="image-upload">
                        <input type="file" onChange={handleFileChange}
                          className={`${submitClicked && !file ? 'error' : ''}`} />
                        <div className="image-uploads">
                          <img src={Upload} alt="img" />
                          <h4>Drag and drop a file to upload</h4>
                        </div>
                      </div>
                      {submitClicked && !file && (
                        <span className="error-message">Upload CSV File is required.</span>
                      )}
                    </div>
                    <button className="btn btn-submit" onClick={handleUpload}>
                      Upload File
                    </button>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Order Tax</label>
                      <input type="text" name="discount" value={orderTax}
                        onChange={(e) => setOrderTax(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Discount</label>
                      <input type="text" name="discount" value={discount}
                        onChange={(e) => setDiscount(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Shipping</label>
                      <input type="text" name="discount" value={shipping}
                        onChange={(e) => setShipping(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea className="form-control" defaultValue={""} value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <button type="submit" className="btn btn-submit me-2">Submit</button>
                    <Link to="/dream-pos/purchase/purchaselist-purchase" className="btn btn-cancel">Cancel</Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ImportPurchase;
