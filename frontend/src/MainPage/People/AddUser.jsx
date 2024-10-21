/* eslint-disable no-dupe-keys */
import React, { useState } from "react";
import { Upload } from "../../EntryFile/imagePath";
// import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import axios from "axios";
import { peopleUrl } from "../../Apis/Api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";

// const options = [
//   { id: "Owner", text: "Owner" },
//   { id: "User", text: "User" }
// ];

const AddUser = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState([]);
  const [passwordShown, setPasswordShown] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const history = useHistory()

  const userData = { firstName, lastName, email, userName, password, phone, role };

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
        !firstName || !email || !phone || !lastName || !userName || !password || !role
      ) {
        // You can display an error message, prevent the payment, or take appropriate action
        // alert('Email is required before proceeding to payment.');
        return;
      }
      // Check if an image is selected
      if (image.length === 0) {
        // Handle the case where no image is selected
        console.log('No image selected');
        const allData = { userData, image }
        const response = await axios.post(`${peopleUrl}/add-user`, allData);
        if (response.data.emailExist) {
          toast.error("Email Already Exist")
        } else if (response.data.phoneExist) {
          toast.error("Phone Number Already Exist")
        } else if (response.data.success) {          
          toast.success("User Added Successfully")
          history.push('/dream-pos/people/userlist-people');
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
        const allData = { userData, image: uploadedImageUrl };
        const response = await axios.post(`${peopleUrl}/add-user`, allData);
        if (response.data.emailExist) {
          toast.error("Email Already Exist")
        } else if (response.data.phoneExist) {
          toast.error("Phone Number Already Exist")
        } else if (response.data.success) {          
          toast.success("User Added Successfully")
          history.push('/dream-pos/people/userlist-people');
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
              <h4>User Management</h4>
              <h6>Add User</h6>
            </div>
          </div>
          {/* /add */}
          <form action="" onSubmit={addUser}>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className={`form-group ${
                        submitClicked && !firstName ? "error" : ""
                      }`}>
                      <label
                      className={`${
                        submitClicked && !firstName ? "error-message" : ""
                      }`}
                      >First Name</label>
                      <input type="text" name="firstName" value={firstName}
                        onChange={(e) => setFirstName(e.target.value)} 
                        className={`${
                          submitClicked && !firstName ? "error" : ""
                        }`}/>
                        {submitClicked && !firstName && (
                        <span className="error-message">
                          First Name is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div  className={`form-group ${
                        submitClicked && !lastName ? "error" : ""
                      }`}>
                      <label
                      className={`${
                        submitClicked && !lastName ? "error-message" : ""
                      }`}
                      >Last Name</label>
                      <input type="text" name="lastName" value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={`${
                          submitClicked && !lastName ? "error" : ""
                        }`} />
                        {submitClicked && !lastName && (
                        <span className="error-message">
                          Last Name is required.
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
                          className={`"pass-input"${
                            submitClicked && !password ? "error" : ""
                          }`}
                        />
                         
                        <span
                          className={`fas toggle-password ${passwordShown ? "fa-eye" : "fa-eye-slash"
                            }`}
                          onClick={togglePassword}
                        />
                        {submitClicked && !password && (
                        <span className="error-message">
                          Password is required.
                        </span>
                      )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div  className={`form-group ${
                        submitClicked && !phone ? "error" : ""
                      }`}>
                      <label
                      className={`${
                        submitClicked && !phone ? "error-message" : ""
                      }`}
                      >Phone</label>
                      <input type="text" name="reference" value={phone}
                        onChange={(e) => setPhone(e.target.value)} 
                        className={`"pass-input"${
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
                        className={`"pass-input"${
                          submitClicked && !email ? "error" : ""
                        }`}/>
                        {submitClicked && !email && (
                        <span className="error-message">
                          Email is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className={`form-group ${
                        submitClicked && !role ? "error" : ""
                      }`}>
                      <label
                      className={`${
                        submitClicked && !role ? "error-message" : ""
                      }`}>Role</label>
                      <input type="text" name="reference" value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className={`"pass-input"${
                          submitClicked && !role ? "error" : ""
                        }`} />
                        {submitClicked && !role && (
                        <span className="error-message">
                          Role is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label> User Image</label>
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

export default AddUser;
