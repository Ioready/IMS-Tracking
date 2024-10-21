/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
import React, { useEffect, useState } from "react";
import { Upload } from "../../EntryFile/imagePath";
import $ from "jquery";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import axios from "axios";
import { productUrl } from "../../Apis/Api";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { DatePicker } from "antd";
// import Toastr from "../elements/toastr";
import { toast } from "react-toastify";

const options3 = [
  { id: 'Piece', text: "Piece" },
  { id: 'Kg', text: "Kg" },
];
const options4 = [
  { id: "1%", text: "1%" },
  { id: "2%", text: "2%" },
];
const options5 = [
  { id: "1%", text: "1%" },
  { id: "2%", text: "2%" },
];
const options6 = [
  { id: "Closed", text: "Closed" },
  { id: "Open", text: "Open" },
];

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [wareHouse, setWareHouse] = useState("");
  const [unit, setUnit] = useState("");
  const [sku, setSku] = useState("");
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [qty, setQty] = useState();
  const [descr, setDescr] = useState("");
  const [tax, setTax] = useState("");
  const [discount, setDiscount] = useState("");
  const [price, setPrice] = useState();
  const [status, setStatus] = useState("");
  const [image, setImage] = useState([]);
  const [options, setOptions] = useState([]);
  const [options1, setOptions1] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [options7, setOptions7] = useState([]);
  const [submitClicked, setSubmitClicked] = useState(false);

  const history = useHistory();
  const productDatas = {
    productName,
    category,
    subCategory,
    brand,
    wareHouse,
    unit,
    sku,
    expiryDate,
    qty,
    descr,
    tax,
    discount,
    price,
    status,
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        await axios.get(`${productUrl}/category-list`).then((response) => {
          const datas = response.data.categoryData.map((category) => ({
            id: category._id,
            text: category.categoryName,
          }));
          setOptions(datas);
        });
        await axios.get(`${productUrl}/sub-category-list`).then((response) => {
          const datas = response.data.subCategoryData.map((subCategory) => ({
            id: subCategory._id,
            text: subCategory.subCategoryName,
          }));
          setOptions1(datas);
        });
        await axios.get(`${productUrl}/brand-list`).then((response) => {
          const datas = response.data.brandData.map((brand) => ({
            id: brand._id,
            text: brand.brandName,
          }));
          setOptions2(datas);
        });
        await axios.get(`${productUrl}/ware-house-list`).then((response) => {
          const datas = response.data.wareHouseData.map((wareHouse) => ({
            id: wareHouse._id,
            text: wareHouse.wareHouseName,
          }));
          setOptions7(datas);
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchOptions();
  }, []);

  let token;

  const addProduct = async (e) => {
    try {
      e.preventDefault();
      token = localStorage.getItem("token");
      setSubmitClicked(true);
      if (
        !productName ||
        !category ||
        !subCategory ||
        !brand ||
        !unit ||
        !sku ||
        !qty ||
        !tax ||
        !discount ||
        !price ||
        !status
      ) {
        // You can display an error message, prevent the payment, or take appropriate action
        // alert('Email is required before proceeding to payment.');
        return;
      }
      // Check if an image is selected
      if (image.length === 0) {
        // Handle the case where no image is selected
        console.log("No image selected");
        const allData = { productDatas, image };
        const response = await axios.post(`${productUrl}/add-product`, allData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('res: ', response);
        if (response.data.success) {
          toast.success(response.data.message);
          history.push("/dream-pos/product/productlist-product");
        }
      } else {
        const uploadImage = async (image) => {
          const data = new FormData();
          data.append("file", image);
          data.append("upload_preset", "ioready");
          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dnrcd8rxl/image/upload",
            data
          );
          console.log(response.data, "img res");
          return response.data.url;
        };

        const uploadedImageUrl = await uploadImage(image);
        console.log("Uploaded image URL: ", uploadedImageUrl);

        const allData = { productDatas, image: uploadedImageUrl };
        console.log("All data: ", allData);

        const response = await axios.post(`${productUrl}/add-product`, allData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('res: ', response);
        if (response.data.success) {
          toast.success(response.data.message);
          history.push("/dream-pos/product/productlist-product");
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
              <h4>Product Add</h4>
              <h6>Create new product</h6>
            </div>
          </div>
          {/* /add */}
          <form onSubmit={addProduct} action="">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div
                      className={`form-group ${
                        submitClicked && !productName ? "error" : ""
                      }`}
                    >
                      <label
                        className={`${
                          submitClicked && !productName ? "error-message" : ""
                        }`}
                      >
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className={`${
                          submitClicked && !productName ? "error" : ""
                        }`}
                      />
                      {submitClicked && !productName && (
                        <span className="error-message">
                          Product Name is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label
                        className={`${
                          submitClicked && !category ? "error-message" : ""
                        }`}
                      >
                        Category
                      </label>
                      <Select2
                        data={options}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        options={{
                          placeholder: "Choose Category",
                        }}
                      />
                      {submitClicked && !category && (
                        <span className="error-message">
                          Category Option is required.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label
                        className={`${
                          submitClicked && !subCategory ? "error-message" : ""
                        }`}
                      >
                        Sub Category
                      </label>
                      <Select2
                        data={options1}
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        options={{
                          placeholder: "Choose Sub Category",
                        }}
                      />
                      {submitClicked && !subCategory && (
                        <span className="error-message">
                          Sub Category Option is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label
                        className={`${
                          submitClicked && !brand ? "error-message" : ""
                        }`}
                      >
                        Brand
                      </label>
                      <Select2
                        className="select"
                        data={options2}
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        options={{
                          placeholder: "Choose Brand",
                        }}
                      />
                      {submitClicked && !brand && (
                        <span className="error-message">
                          Brand Option is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label
                        className={`${
                          submitClicked && !wareHouse ? "error-message" : ""
                        }`}
                      >
                        Ware House
                      </label>
                      <Select2
                        className="select"
                        data={options7}
                        value={wareHouse}
                        onChange={(e) => setWareHouse(e.target.value)}
                        options={{
                          placeholder: "Choose Ware House",
                        }}
                      />
                      {submitClicked && !wareHouse && (
                        <span className="error-message">
                          Ware House Option is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label
                        className={`${
                          submitClicked && !unit ? "error-message" : ""
                        }`}
                      >
                        Unit
                      </label>
                      <Select2
                        className="select"
                        data={options3}
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        options={{
                          placeholder: "Choose Unit",
                        }}
                      />
                      {submitClicked && !unit && (
                        <span className="error-message">
                          Unit Option is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div
                      className={`form-group ${
                        submitClicked && !sku ? "error" : ""
                      }`}
                    >
                      <label
                        className={`${
                          submitClicked && !sku ? "error-message" : ""
                        }`}
                      >
                        SKU
                      </label>
                      <input
                        type="text"
                        name="sku"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className={`${submitClicked && !sku ? "error" : ""}`}
                      />
                      {submitClicked && !sku && (
                        <span className="error-message">
                          Sku Number is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label
                        className={`${
                          submitClicked && !expiryDate ? "error-message" : ""
                        }`}
                      >
                        Expiry Date
                      </label>
                      <DatePicker
                        selected={expiryDate}
                        onChange={(date) => setExpiryDate(date)}
                      />
                      {submitClicked && !expiryDate && (
                        <span className="error-message">
                          Expiry Date is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div
                      className={`form-group ${
                        submitClicked && !qty ? "error" : ""
                      }`}
                    >
                      <label
                        className={`${
                          submitClicked && !qty ? "error-message" : ""
                        }`}
                      >
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="qnty"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                      />
                      {submitClicked && !qty && (
                        <span className="error-message">
                          Quantity is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        className="form-control"
                        name="dscr"
                        defaultValue={""}
                        value={descr}
                        onChange={(e) => setDescr(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label
                        className={`${
                          submitClicked && !tax ? "error-message" : ""
                        }`}
                      >
                        Tax
                      </label>
                      <Select2
                        className="select"
                        data={options4}
                        value={tax}
                        onChange={(e) => setTax(e.target.value)}
                        options={{
                          placeholder: "Choose Tax",
                        }}
                      />
                      {submitClicked && !tax && (
                        <span className="error-message">
                          Tax Option is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label
                        className={`${
                          submitClicked && !discount ? "error-message" : ""
                        }`}
                      >
                        Discount Type
                      </label>
                      <Select2
                        className="select"
                        data={options5}
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        options={{
                          placeholder: "Percentage",
                        }}
                      />
                      {submitClicked && !discount && (
                        <span className="error-message">
                          Discount is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div
                      className={`form-group ${
                        submitClicked && !price ? "error" : ""
                      }`}
                    >
                      <label
                        className={`${
                          submitClicked && !price ? "error-message" : ""
                        }`}
                      >
                        Price
                      </label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={`${submitClicked && !price ? "error" : ""}`}
                      />
                      {submitClicked && !price && (
                        <span className="error-message">
                          Price is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label
                        className={`${
                          submitClicked && !status ? "error-message" : ""
                        }`}
                      >
                        {" "}
                        Status
                      </label>
                      <Select2
                        className="select"
                        data={options6}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        options={{
                          placeholder: "Choose Product",
                        }}
                      />
                      {submitClicked && !status && (
                        <span className="error-message">
                          Status is required.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label> Product Image</label>
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
                    <button type="submit" className="btn btn-submit me-2">
                      Submit
                    </button>
                    <Link
                      to="/dream-pos/product/productlist-product"
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
      <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    </>
  );
};
export default AddProduct;
