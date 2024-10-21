/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
import React, { useState } from "react";
import { Upload } from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { peopleUrl } from "../../Apis/Api";
import { toast } from "react-toastify";

const options = [
  { id: "India", text: "India", code: "+91" },
  { id: "Australia", text: "Australia", code: "+61" }
];

const AddSupplier = () => {
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
  const [submitClicked, setSubmitClicked] = useState(false);
  const history = useHistory()
  const supplierDatas = { supplierName, email, phone, country, code, state, city, zipCode, address, descr }

  const isValidEmail = (email) => {
    // Regular expression to validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const isValidPhone = (phone) => {
    // Regular expression to validate phone number format (10 digits)
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phone);
  };

  const addSupplier = async (e) => {
    try {
      e.preventDefault();
      setSubmitClicked(true);

      if (!isValidEmail(email)) {
        toast.error("Invalid Email Format");
        return;
      }

      if (!isValidPhone(phone)) {
        toast.error("Invalid Phone Number Format");
        return;
      }

      if (
        !supplierName || !email || !phone || !country || !code || !zipCode || !address
      ) {
        // You can display an error message, prevent the payment, or take appropriate action
        // alert('Email is required before proceeding to payment.');
        return;
      }

      // Check if an image is selected
      if (image.length === 0) {
        // Handle the case where no image is selected
        console.log('No image selected');
        const allData = { supplierDatas, image }
        const response = await axios.post(`${peopleUrl}/add-supplier`, allData);
        if (response.data.emailExist) {
          toast.error("Email Already Exist")
        } else if (response.data.phoneExist) {
          toast.error("Phone Number Already Exist")
        } else if (response.data.success) {          
          toast.success("Supplier Added Successfully")
          history.push('/dream-pos/people/supplierlist-people');
        }
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

        const response = await axios.post(`${peopleUrl}/add-supplier`, allData);
        if (response.data.emailExist) {
          toast.error("Email Already Exist")
        } else if (response.data.phoneExist) {
          toast.error("Phone Number Already Exist")
        } else if (response.data.success) {          
          toast.success("Supplier Added Successfully")
          history.push('/dream-pos/people/supplierlist-people');
        }
      }

    } catch (error) {
      toast.error("Invalid Values")
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
              <h6>Add/Update Supplier</h6>
            </div>
          </div>
          {/* /add */}
          <form onSubmit={addSupplier} action="">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className={`form-group ${submitClicked && !supplierName ? "error" : ""
                      }`}>
                      <label
                        className={`${submitClicked && !supplierName ? "error-message" : ""
                          }`}
                      >Supplier Name</label>
                      <input type="text" name="supplierName" value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                        className={`${submitClicked && !supplierName ? "error" : ""
                          }`} />
                      {submitClicked && !supplierName && (
                        <span className="error-message">
                          Supplier Name is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className={`form-group ${submitClicked && !email ? "error" : ""
                      }`}>
                      <label
                        className={`${submitClicked && !email ? "error-message" : ""
                          }`}>Email</label>
                      <input type="text" name="email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`${submitClicked && !email ? "error" : ""
                          }`} />
                      {submitClicked && !email && (
                        <span className="error-message">
                          Email is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className={`form-group ${submitClicked && !phone ? "error" : ""
                      }`}>
                      <label
                        className={`${submitClicked && !phone ? "error-message" : ""
                          }`}
                      >Phone</label>
                      <input type="text" name="customerName" value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`${submitClicked && !phone ? "error" : ""
                          }`} />
                      {submitClicked && !phone && (
                        <span className="error-message">
                          Phone Number is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className={`form-group ${submitClicked && !country ? "error" : ""
                      }`}>
                      <label
                        className={`${submitClicked && !country ? "error-message" : ""
                          }`}
                      >Choose Country</label>
                      <Select2
                        className="select"
                        data={options}
                        value={country}
                        onChange={handleCountryChange}
                        options={{
                          placeholder: "Choose Country",
                        }}
                      />
                      {submitClicked && !country && (
                        <span className="error-message">
                          Country is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className={`form-group ${submitClicked && !state ? "error" : ""
                      }`}>
                      <label
                        className={`${submitClicked && !state ? "error-message" : ""
                          }`}
                      >State</label>
                      <input type="text" name="city" value={state}
                        onChange={(e) => setState(e.target.value)}
                        className={`${submitClicked && !state ? "error" : ""
                          }`} />
                      {submitClicked && !state && (
                        <span className="error-message">
                          State is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className={`form-group ${submitClicked && !city ? "error" : ""
                      }`}>
                      <label
                        className={`${submitClicked && !city ? "error-message" : ""
                          }`}
                      >City</label>
                      <input type="text" name="city" value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={`${submitClicked && !city ? "error" : ""
                          }`} />
                      {submitClicked && !city && (
                        <span className="error-message">
                          City is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className={`form-group ${submitClicked && !zipCode ? "error" : ""
                      }`}>
                      <label
                        className={`${submitClicked && !zipCode ? "error-message" : ""
                          }`}
                      >Zip Code</label>
                      <input type="text" name="city" value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className={`${submitClicked && !zipCode ? "error" : ""
                          }`} />
                      {submitClicked && !zipCode && (
                        <span className="error-message">
                          City is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-9 col-12">
                    <div className={`form-group ${submitClicked && !address ? "error" : ""
                      }`}>
                      <label
                        className={`${submitClicked && !address ? "error-message" : ""
                          }`}
                      >Address</label>
                      <input type="text" name="customerName" value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={`${submitClicked && !address ? "error" : ""
                          }`} />
                      {submitClicked && !address && (
                        <span className="error-message">
                          Address is required.
                        </span>
                      )}
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
                          {image && image.name ? (
                            <img
                              src={URL.createObjectURL(image)}
                              alt="Selected"
                              style={{ maxWidth: "100px", maxHeight: "100px" }}
                            />
                          ) : (
                            <img src={Upload} alt="img" />
                          )}
                          <h4
                            style={{
                              display: image && image.name ? "none" : "block", marginBottom: "20px"
                            }}
                          >
                            Drag and drop a file to upload
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <button type="submit" className="btn btn-submit me-2">Submit</button>
                    <button type="button" className="btn btn-cancel">Cancel</button>
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

export default AddSupplier;
