import React, { useState } from "react";
import { Upload } from "../../EntryFile/imagePath";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { peopleUrl } from "../../Apis/Api";
import { toast } from "react-toastify";

const AddStore = () => {
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const history = useHistory()

  const storeData = { storeName, email, userName, password, phone };

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

  const addUser = async (e) => {
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
        !storeName || !email || !phone || !userName || !password 
      ) {
        // You can display an error message, prevent the payment, or take appropriate action
        // alert('Email is required before proceeding to payment.');
        return;
      }
      // Check if an image is selected
      if (image.length === 0) {
        // Handle the case where no image is selected
        console.log('No image selected');
        const allData = { storeData, image }
        const response = await axios.post(`${peopleUrl}/add-store`, allData);
        if (response.data.emailExist) {
          toast.error("Email Already Exist")
        } else if (response.data.phoneExist) {
          toast.error("Phone Number Already Exist")
        } else if (response.data.success) {          
          toast.success("Store Added Successfully")
          history.push('/dream-pos/people/storelist-people');
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
        const allData = { storeData, image: uploadedImageUrl };
        const response = await axios.post(`${peopleUrl}/add-store`, allData);
        if (response.data.emailExist) {
          toast.error("Email Already Exist")
        } else if (response.data.phoneExist) {
          toast.error("Phone Number Already Exist")
        } else if (response.data.success) {          
          toast.success("Store Added Successfully")
          history.push('/dream-pos/people/storelist-people');
        }
      }
    } catch (error) {
      toast.error("Invalid Values")
      console.log(error);
    }
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Store Management</h4>
              <h6>Add/Update Store</h6>
            </div>
          </div>
          {/* /add */}
          <form action="" onSubmit={addUser}>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className={`form-group ${
                        submitClicked && !storeName ? "error" : ""
                      }`}>
                    <label
                     className={`${
                      submitClicked && !storeName ? "error-message" : ""
                    }`}
                    >Store Name</label>
                    <input type="text" name="userName" value={storeName}
                        onChange={(e) => setStoreName(e.target.value)} 
                        className={`${
                          submitClicked && !storeName ? "error" : ""
                        }`}/>
                        {submitClicked && !storeName && (
                        <span className="error-message">
                          Store Name is required.
                        </span>
                      )}
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className={`form-group ${
                        submitClicked && !userName ? "error" : ""
                      }`}>
                    <label
                    className={`${
                      submitClicked && !userName ? "error-message" : ""
                    }`}
                    >User Name</label>
                    <input type="text" name="userName" value={userName}
                        onChange={(e) => setUserName(e.target.value)} 
                        className={`${
                          submitClicked && !userName ? "error" : ""
                        }`}/>
                        {submitClicked && !userName && (
                        <span className="error-message">
                          User Name is required.
                        </span>
                      )}
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className={`form-group ${
                        submitClicked && !password ? "error" : ""
                      }`}>
                    <label
                    className={`${
                      submitClicked && !password ? "error-message" : ""
                    }`}
                    >Password</label>
                    <div className="pass-group">
                      <input
                        type={passwordShown ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`" pass-input"  ${
                          submitClicked && !password ? "error" : ""
                        }`}
                      />
                      {submitClicked && !password && (
                        <span className="error-message">
                          Password is required.
                        </span>
                      )}
                      <span
                        className={`fas toggle-password ${
                          passwordShown ? "fa-eye" : "fa-eye-slash"
                        }`}
                        onClick={togglePassword}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className={`form-group ${
                        submitClicked && !phone ? "error" : ""
                      }`}>
                    <label
                    className={`${
                      submitClicked && !phone ? "error-message" : ""
                    }`}
                    >Phone</label>
                    <input type="text" name="reference" value={phone}
                        onChange={(e) => setPhone(e.target.value)} 
                        className={`" pass-input"  ${
                          submitClicked && !phone ? "error" : ""
                        }`}/>
                        {submitClicked && !phone && (
                        <span className="error-message">
                          Phone Number is required.
                        </span>
                      )}
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className={`form-group ${
                        submitClicked && !email ? "error" : ""
                      }`}>
                    <label
                    className={`${
                      submitClicked && !email ? "error-message" : ""
                    }`}>Email</label>
                    <input type="text" name="reference" value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        className={`" pass-input"  ${
                          submitClicked && !email ? "error" : ""
                        }`}/>
                        {submitClicked && !email && (
                        <span className="error-message">
                          Email is required.
                        </span>
                      )}
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <label> Store Image</label>
                    <div className="image-upload">
                      <input type="file" accept="image/*"
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
                              display: image && image.name ? "none" : "block", marginBottom:"20px"
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
                  <Link  to="/dream-pos/people/storelist-people" className="btn btn-cancel">Cancel</Link>
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

export default AddStore;
