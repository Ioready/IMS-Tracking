/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Upload } from "../../EntryFile/imagePath";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { peopleUrl } from "../../Apis/Api";
import axios from "axios";
import LoadingSpinner from "../../InitialPage/Sidebar/LoadingSpinner";
import { toast } from "react-toastify";

const EditStore = () => {
  const Id = useParams();
  const id = Id.id
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [storeData, setStoreData] = useState({})
  const history = useHistory()
  const spinner = LoadingSpinner()

  const storeDatas = { storeName, email, userName, password, phone };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${peopleUrl}/get-store-details/${id}`);
        setStoreData(response.data);
      } catch (error) {
        console.log(error);
        // history.push('/error-500')
      }
    };
    fetchProductDetails();
  }, []);

  useEffect(() => {
    if (storeData) {
      setStoreName(storeData.storeName);
      setEmail(storeData.email);
      setUserName(storeData.userName);
      setPassword(storeData.password);
      setPhone(storeData.phone);
      setImage(storeData.image);
      // Update other state variables similarly
    }
  }, [storeData]);


  const editStore = async (e) => {
    try {
      e.preventDefault();
      // Check if an image is selected
      if (image.length === 0) {
        // Handle the case where no image is selected
        console.log('No image selected');
        const allData = { storeDatas, image }
        await axios.put(`${peopleUrl}/edit-store/${id}`, allData);
        toast.success("Store Edited Successfully")
        history.push('/dream-pos/people/storelist-people');
      } else {
        const uploadImage = async (image) => {
          const data = new FormData();
          data.append('file', image);
          data.append('upload_preset', 'ioready');
          const response = await axios.post('https://api.cloudinary.com/v1_1/dnrcd8rxl/image/upload', data);
          return response.data.url;
        };
        const uploadedImageUrl = await uploadImage(image);
        const allData = { storeDatas, image: uploadedImageUrl };
        await axios.put(`${peopleUrl}/edit-store/${id}`, allData);
        toast.success("Store Edited Successfully")
        history.push('/dream-pos/people/storelist-people');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  const deleteImage = () => {
    $(document).on("click", ".hideset", function () {
      $(this).parent().parent().parent().hide();
    });
  }

  if (!storeData) {
    return spinner
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Store Management</h4>
              <h6>Edit/Update Store</h6>
            </div>
          </div>
          {/* /add */}
          <form action="" onSubmit={editStore}>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Store Name</label>
                      <input type="text" name="userName" value={storeName}
                        onChange={(e) => setStoreName(e.target.value)} />
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
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label> Store Image</label>
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
                          <div className="productviews">
                            <div className="productviewsimg">
                              <img src={image} alt="img" />
                            </div>
                            <div className="productviewscontent">
                              <div className="productviewsname">
                                <h2>{storeName}.jpg</h2>
                                <h3>581kb</h3>
                              </div>
                              <Link to="#" className="hideset" onClick={deleteImage}>x</Link>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <button type="submit" className="btn btn-submit me-2">Submit</button>
                    <Link to="/dream-pos/people/storelist-people" className="btn btn-cancel">Cancel</Link>
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

export default EditStore;
