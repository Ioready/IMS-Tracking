/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
import React, { useEffect, useState } from "react";
import { Upload } from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import axios from "axios";
import { peopleUrl, purchaseUrl } from "../../Apis/Api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";

// const options1 = [
//   { id: 1, text: "Store 1", text: "Store 1" },
//   { id: 2, text: "Store 2", text: "Store 2" },
// ];

const options2 = [
  { id: "Pending", text: "Pending" },
  { id: "Received", text: "Received" },
];

const status = [
  { value: "Completed", label: "Completed" },
  { value: "Inprogress", label: "Inprogress" },
];
const ImportTransfer = () => {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [shipping, setShipping] = useState(0)
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('Pending')
  const [file, setFile] = useState(null);
  const [productFile, setProductFile] = useState([])
  const [options1, setOptions1] = useState([])
  const [submitClicked, setSubmitClicked] = useState(false);
  const history = useHistory()

  const TransferDatas = { from, to, shipping, description, status, productFile }

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: "2.4rem",
      minHeight: "fit-content",
    }),
    valueContainer: (base) => ({
      ...base,
      maxHeight: "2.4rem",
    }),
    placeholder: (provided) => ({
      ...provided,
      marginBottom: "14px",
    }),
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        await axios.get(`${peopleUrl}/store-list`).then((response) => {
          const datas = response.data.map((store) => ({
            id: store._id,
            text: store.storeName
          }));
          setOptions1(datas)
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
    { productName: 'Apple 15 pro', quntity: 1, price: 1499, qty:9, discount: '2%', tax: '1%', subTotal: 1511, grandTotalNumber: 1511 },
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
      history.push('/dream-pos/transfer/importtransfer-transfer');
      // You can handle success here
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error
    }
  };

  const addimportTransfer = async (e) => {
    try {
      e.preventDefault();
      setSubmitClicked(true)

      if (!file) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        return;
      }
      await axios.post(`${peopleUrl}/add-import-transfer`, TransferDatas);
      toast.success('Import Transfer added Successful')
      history.push('/dream-pos/transfer/transferlist-transfer');
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
              <h4>Import Transfer</h4>
              <h6>Add/Update Transfer</h6>
            </div>
          </div>
          <form action="" onSubmit={addimportTransfer}>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label className={`${submitClicked && !from ? 'error-message' : ''}`}>From</label>
                      <Select2
                        className="select"
                        data={options1}
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        options={{
                          placeholder: "Choose",
                        }}
                      />
                      {submitClicked && !from && (
                        <span className="error-message">From is required.</span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label className={`${submitClicked && !from ? 'error-message' : ''}`}>To</label>
                      <Select2
                        className="select"
                        data={options1}
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        options={{
                          placeholder: "Choose",
                        }}
                      />
                      {submitClicked && !to && (
                        <span className="error-message">To is required.</span>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <Select2
                      className="select"
                      data={options2}
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      options={{
                        placeholder: "Choose status",
                      }}
                    />
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
                    <button to="/dream-pos/transfer/transferlist-transfer" className="btn btn-cancel">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div >
    </>
  );
};

export default ImportTransfer;
