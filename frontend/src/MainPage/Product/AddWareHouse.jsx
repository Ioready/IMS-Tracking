import React, { useState } from "react";
import { Upload } from "../../EntryFile/imagePath";
import axios from "axios";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { productUrl } from "../../Apis/Api";
import { toast } from "react-toastify";

const AddWareHouse = () => {
  const [wareHouseName, setWareHouseName] = useState("");
  const [wareHouseCode, setWareHouseCode] = useState("");
  const [description, setDescription] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);
  const [image, setImage] = useState([]);
  const history = useHistory();
  const productDatas = { wareHouseName, wareHouseCode, description };

  let token;

  const addCategory = async (e) => {
    console.log(image);
    try {
      e.preventDefault();
      token = localStorage.getItem("token");
      setSubmitClicked(true);
      if (!wareHouseName) {
        // You can display an error message, prevent the payment, or take appropriate action
        // alert('Email is required before proceeding to payment.');
        return;
      }
      // Check if an image is selected
      if (image.length === 0) {
        // Handle the case where no image is selected
        console.log("No image selected");
        const allData = { productDatas, image };
        await axios.post(`${productUrl}/add-ware-house`, allData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        history.push("/dream-pos/product/warehouselist-product");
      } else {
        const uploadImage = async (image) => {
          const data = new FormData();
          data.append("file", image);
          data.append("upload_preset", "ioready");
          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dnrcd8rxl/image/upload",
            data
          );
          return response.data.url;
        };

        const uploadedImageUrl = await uploadImage(image);
        console.log("Uploaded image URL: ", uploadedImageUrl);

        const allData = { productDatas, image: uploadedImageUrl };
        console.log("All data: ", allData);

        const response = await axios.post(`${productUrl}/add-ware-house`, allData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          toast.success(response.data.message);
          history.push("/dream-pos/product/warehouselist-product");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('Invalid Values')
    }
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Add Warehouse</h4>
              <h6>Create new Warehouse</h6>
            </div>
          </div>
          {/* /add */}
          <form onSubmit={addCategory} action="">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6 col-sm-6 col-12">
                    <div
                      className={`form-group ${
                        submitClicked && !wareHouseName ? "error" : ""
                      }`}
                    >
                      <label
                        className={`${
                          submitClicked && !wareHouseName ? "error-message" : ""
                        }`}
                      >
                        Warehouse Name
                      </label>
                      <input
                        type="text"
                        name="categoryName"
                        value={wareHouseName}
                        onChange={(e) => setWareHouseName(e.target.value)}
                        className={`${
                          submitClicked && !wareHouseName ? "error" : ""
                        }`}
                      />
                      {submitClicked && !wareHouseName && (
                        <span className="error-message">
                          Warehouse Name is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Warehouse Code</label>
                      <input
                        type="text"
                        name="categoryCode"
                        value={wareHouseCode}
                        onChange={(e) => setWareHouseCode(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        className="form-control"
                        defaultValue={""}
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label> Warehouse Image</label>
                      <div className="image-upload">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImage(e.target.files[0])}
                        />
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
                              display: image && image.name ? "none" : "block",
                              marginBottom: "20px",
                            }}
                          >
                            Drag and drop a file to upload
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <button className="btn btn-submit me-2">Submit</button>
                    <Link
                      to="/dream-pos/product/categorylist-product"
                      className="btn btn-cancel"
                    >
                      Cancel
                    </Link>
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

export default AddWareHouse;
