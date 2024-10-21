/* eslint-disable no-dupe-keys */
import React, { useState } from "react";
import { Upload } from "../../EntryFile/imagePath";
// import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import axios from "axios";
import { peopleUrl } from "../../Apis/Api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

// const options = [
//   { id: "Owner", text: "Owner" },
//   { id: "User", text: "User" }
// ];

const Newuser = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const history = useHistory()

  const userData = { firstName, lastName, email, userName, password, phone, role };

  const addUser = async (e) => {
    try {
      e.preventDefault();
      // Check if an image is selected
      if (image.length === 0) {
        // Handle the case where no image is selected
        console.log('No image selected');
        const allData = { userData, image }
        await axios.post(`${peopleUrl}/add-user`, allData);
        history.push('/dream-pos/people/userlist-people');
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
        await axios.post(`${peopleUrl}/add-user`, allData);
        history.push('/dream-pos/people/userlist-people');
      }
    } catch (error) {
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
                    <div className="form-group">
                      <label>First Name</label>
                      <input type="text" name="firstName" value={firstName}
                        onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Last Name</label>
                      <input type="text" name="lastName" value={lastName}
                        onChange={(e) => setLastName(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>User Name</label>
                      <input type="text" name="userName" value={userName}
                        onChange={(e) => setUserName(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Password</label>
                      <div className="pass-group">
                        <input
                          type={passwordShown ? "text" : "password"}
                          className=" pass-input" value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                          className={`fas toggle-password ${passwordShown ? "fa-eye" : "fa-eye-slash"
                            }`}
                          onClick={togglePassword}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Phone</label>
                      <input type="text" name="reference" value={phone}
                        onChange={(e) => setPhone(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Email</label>
                      <input type="text" name="reference" value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Role</label>
                      <input type="text" name="reference" value={role}
                        onChange={(e) => setRole(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label> User Image</label>
                      <div className="image-upload">
                        <input type="file" accept="image/*"
                          onChange={(e) => setImage(e.target.files[0])} />
                        <div className="image-uploads">
                          <img src={Upload} alt="img" />
                          <h4>Drag and drop a file to upload</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <button className="btn btn-submit me-2">Submit</button>
                    <button className="btn btn-cancel">Cancel</button>
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

export default Newuser;
