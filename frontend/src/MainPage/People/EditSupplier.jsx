/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
import React, { useEffect, useState } from "react";
import { Upload } from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { peopleUrl } from "../../Apis/Api";
import { toast } from "react-toastify";

const options = [
  { id: "India", text: "India", code: "+91" },
  { id: "Australia", text: "Australia", code: "+61" }
];

const EditSupplier = () => {
  const Id = useParams();
  const id = Id.id
  const [supplierData, setSupplierData] = useState([])
  const [supplierName, setSupplierName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [code, setCode] = useState("");
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState('');
  const [descr, setDescr] = useState('');
  const [image, setImage] = useState('');
  const history = useHistory()
  const supplierDatas = { supplierName, email, phone, country, code, state, city, zipCode, address, descr }

  useEffect(() => {
    const fetchSupplierDetails = async () => {
      try {
        const response = await axios.get(`${peopleUrl}/edit-supplier-details/${id}`);
        setSupplierData(response.data);
      } catch (error) {
        history.push('/error-500')
      }
    };
    fetchSupplierDetails();
  }, []);

  useEffect(() => {
    if (supplierData) {
      setSupplierName(supplierData.supplierName);
      setEmail(supplierData.email);
      setPhone(supplierData.phone);
      setCountry(supplierData.country);
      setState(supplierData.state)
      setCity(supplierData.city);
      setZipCode(supplierData.zipCode);
      setAddress(supplierData.address);
      setDescr(supplierData.descr);
      // Update other state variables similarly
    }
  }, [supplierData]);

  const editSupplier = async (e) => {
    console.log('hello');
    try {
      e.preventDefault();

      // Check if an image is selected
      if (image.length === 0) {
        // Handle the case where no image is selected
        console.log('No image selected');
        const allData = { supplierDatas, image }
        await axios.put(`${peopleUrl}/edit-supplier/${id}`, allData);
        toast.success("Supplier Edited Successfully")
        history.push('/dream-pos/people/supplierlist-people');
      } else {
        const uploadImage = async (image) => {
          const data = new FormData();
          data.append('file', image);
          data.append('upload_preset', 'ioready');
          const response = await axios.post('https://api.cloudinary.com/v1_1/dnrcd8rxl/image/upload', data);
          return response.data.url;
        };

        const uploadedImageUrl = await uploadImage(image);
        const allData = { supplierDatas, image: uploadedImageUrl };
        console.log(allData);

        await axios.put(`${peopleUrl}/edit-supplier/${id}`, allData);
        toast.success("Supplier Edited Successfully")
        history.push('/dream-pos/people/supplierlist-people');
      }

    } catch (error) {
      console.log(error);
    }
  };

    const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    const selectedOption = options.find(option => option.id === selectedCountry);
    
    if (selectedOption) {
      setCountry(selectedCountry);
      setCode(selectedOption.code);
    }
  };


  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Supplier Management</h4>
              <h6>Edit/Update Customer</h6>
            </div>
          </div>
          {/* /add */}
          <form onSubmit={editSupplier} action="">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Supplier Name</label>
                      <input type="text" name="customerName" value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Email</label>
                      <input type="text" name="customerName" value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Phone</label>
                      <input type="text" name="customerName" value={phone}
                        onChange={(e) => setPhone(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Choose Country</label>
                      <Select2
                        className="select"
                        data={options}
                        value={country}
                        onChange={handleCountryChange}
                        options={{
                          placeholder: "United States",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>State</label>
                      <input type="text" name="state" value={state}
                        onChange={(e) => setState(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>City</label>
                      <input type="text" name="city" value={city}
                        onChange={(e) => setCity(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Zip Code</label>
                      <input type="text" name="zipCode" value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-9 col-12">
                    <div className="form-group">
                      <label>Address</label>
                      <input type="text" name="customerName" value={address}
                        onChange={(e) => setAddress(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea className="form-control" name='dscr' defaultValue={""} value={descr}
                        onChange={(e) => setDescr(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label> Avatar</label>
                      <div className="image-upload">
                        <input type="file" accept='image/*'
                          onChange={(e) => setImage(e.target.files[0])} />
                        <div className="image-uploads">
                          <img src={Upload} alt="img" />
                          <h4>Drag and drop a file to upload</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <button type="submit" className="btn btn-submit me-2">Update</button>
                    <a className="btn btn-cancel">Cancel</a>
                  </div>
                </div>
              </div>
            </div>
          </form>
          {/* /add */}
        </div>
      </div>
    </>
  );
};

export default EditSupplier;
