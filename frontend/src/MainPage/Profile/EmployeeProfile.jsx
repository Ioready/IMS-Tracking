import React, { useEffect, useState } from "react";
import { Customer5, EditSet } from "../../EntryFile/imagePath";
import axios from "axios";
import { peopleUrl, userUrl } from "../../Apis/Api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const EmployeeProfile = () => {
  // const [passwordShown, setPasswordShown] = useState(false);
  const [userData, setUserData] = useState({})
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(null)
  const history = useHistory()
  const id = userData._id

  const userDatas = { firstName, lastName, email, userName, password, phone };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token')
        await axios.post(`${userUrl}/get-user-by-id`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          const data = response.data
          console.log(data);
          setUserData(data)
        })
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserData()
  }, [])

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setEmail(userData.email);
      setUserName(userData.userName);
      setPassword(userData.password);
      setPhone(userData.phone);
      setImage(userData.image);
      // Update other state variables similarly
    }
  }, [userData]);

  const editProfile = async (e) => {
    try {
      e.preventDefault();

      // Check if an image is selected
      if (!image) {
        // Handle the case where no image is selected
        console.log('No image selected');
        const allData = { userDatas, image }
        await axios.put(`${peopleUrl}/edit-user/${id}`, allData);
        history.push('/dream-pos/dashboard');
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
        history.push('/dream-pos/dashboard');
      }

    } catch (error) {
      console.log(error);
    }
  };

  // const togglePassword = () => {
  //   setPasswordShown(!passwordShown);
  // };
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Profile</h4>
              <h6>User Profile</h6>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <form action="" onSubmit={editProfile}>
                <div className="profile-set">
                  <div className="profile-head"></div>
                  <div className="profile-top">
                    <div className="profile-content">
                      <div className="profile-contentimg">
                        {userData.image ? (
                          <img src={userData.image} alt="img" id="blah" />
                        ) : (
                          <img src={Customer5} alt="img" id="blah" />
                        )}
                        <div className="profileupload">
                          <input type="file" accept='image/*'
                            onChange={(e) => setImage(e.target.files[0])} />
                          <a href="#">
                            <img src={EditSet} alt="img" />
                          </a>
                        </div>
                      </div>
                      <div className="profile-contentname">
                        <h2>{userData.userName}</h2>
                        <h4>Updates Your Photo and Personal Details.</h4>
                      </div>
                    </div>
                    <div className="ms-auto">
                      <button type="submit" className="btn btn-submit me-2">Save</button>
                      <button to="/dream-pos/dashboard" className="btn btn-cancel">Cancel</button>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label>First Name</label>
                      <input type="text" name="firstName" value={firstName}
                        onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label>Last Name</label>
                      <input type="text" name="lastName" value={lastName}
                        onChange={(e) => setLastName(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label>Email</label>
                      <input type="text" name="reference" value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label>Phone</label>
                      <input type="text" name="reference" value={phone}
                        onChange={(e) => setPhone(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label>User Name</label>
                      <input type="text" name="userName" value={userName}
                        onChange={(e) => setUserName(e.target.value)} />
                    </div>
                  </div>
                  {/* <div className="col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label>Password</label>
                      <div className="pass-group">
                        <input
                          type={passwordShown ? "text" : "password"}
                          className=" pass-input"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                          className={`fas toggle-password ${passwordShown ? "fa-eye" : "fa-eye-slash"
                            }`}
                          onClick={togglePassword}
                        />
                      </div>
                    </div>
                  </div> */}
                  <div className="col-12">
                    <button type="submit" className="btn btn-submit me-2">Submit</button>
                    <button to="/dream-pos/dashboard" className="btn btn-cancel">Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div >
    </>
  );
};

export default EmployeeProfile;
