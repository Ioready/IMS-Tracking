/* eslint-disable no-undef */
/* eslint-disable no-dupe-keys */
import React, { useEffect, useState } from "react";
import { Upload } from "../../EntryFile/imagePath";
import { Link } from "react-router-dom";
// import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { peopleUrl } from "../../Apis/Api";
import { toast } from "react-toastify";

// const options = [
//   { id: "Owner", text: "Owner" },
//   { id: "User", text: "User" }
// ];

const EditUser = () => {
  const Id = useParams();
  const id = Id.id
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  // const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState(null);
  // const [passwordShown, setPasswordShown] = useState(false);
  const [userData, setUserData] = useState({})
  const history = useHistory()
  console.log('image', image);

  const userDatas = { firstName, lastName, email, userName, phone, role };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${peopleUrl}/get-user-details/${id}`);
        setUserData(response.data);
      } catch (error) {
        console.log(error);
        // history.push('/error-500')
      }
    };
    fetchProductDetails();
  }, []);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setEmail(userData.email);
      setUserName(userData.userName);
      // setPassword(userData.password);
      setPhone(userData.phone);
      setRole(userData.role);
      setImage(userData.image);
      // Update other state variables similarly
    }
  }, [userData]);

  const editUser = async (e) => {
    try {
      e.preventDefault();

      // Check if an image is selected
      if (!image) {
        // Handle the case where no image is selected
        console.log('No image selected');
        const allData = { userDatas, image }
        await axios.put(`${peopleUrl}/edit-user/${id}`, allData);
        toast.success("User Edited Successfully")
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
        const allData = { userDatas, image: uploadedImageUrl };
        await axios.put(`${peopleUrl}/edit-user/${id}`, allData);
        toast.success("User Edited Successfully")
        history.push('/dream-pos/people/userlist-people');
      }

    } catch (error) {
      console.log(error);
    }
  };


  // const togglePassword = () => {
  //   setPasswordShown(!passwordShown);
  // };
  const deleteImage = () => {
    $(document).on("click", ".hideset", function () {
      $(this).parent().parent().parent().hide();
    });
  }

  if (!userData) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>User Management</h4>
              <h6>Edit/Update User</h6>
            </div>
          </div>
          {/* /add */}
          <form action="" onSubmit={editUser}>
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
                  {/* <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Password</label>
                      <div className="pass-group">
                        <input
                          type={passwordShown ? "text" : "password"}
                          className=" pass-input" value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={123456}
                        />
                        <span
                          className={`fas toggle-password ${passwordShown ? "fa-eye" : "fa-eye-slash"
                            }`}
                          onClick={togglePassword}
                        />
                      </div>
                    </div>
                  </div> */}
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
                      <input type="text" value={role}
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
                  <div className="col-12">
                    <div className="product-list">
                      <ul className="row">
                        <li className="ps-0">
                          <div className="productviewset">
                            <div className="productviewsimg">
                              <img src={image} alt="img" />
                            </div>
                            <div className="productviewscontent">
                              <Link to="#" className="hideset" onClick={deleteImage}>
                                <i className="fa fa-trash-alt" />
                              </Link>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <button type="submit" className="btn btn-submit me-2">Update</button>
                    <Link to="/dream-pos/people/userlist-people" className="btn btn-cancel">Cancel</Link>
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

export default EditUser;
