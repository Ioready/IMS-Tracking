/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
import React, { useEffect, useState } from "react";
import { Samsung, Upload } from "../../EntryFile/imagePath";
import { Link } from "react-router-dom"
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import axios from "axios";
import { productUrl } from "../../Apis/Api";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { DatePicker } from "antd";
import { toast } from "react-toastify";

const options4 = [
  { id: 'Piece', text: "Piece" },
  { id: 'Kg', text: "Kg" },
];
const options5 = [
  { id: "1%", text: "1%" },
  { id: "2%", text: "2%" },
];
const options6 = [
  { id: "1%", text: "1%" },
  { id: "2%", text: "2%" },
];
const options7 = [
  { id: "Active", text: "Active" },
  { id: "Open", text: "Open" },
];

const EditProduct = () => {
  const Id = useParams();
  const id = Id.id
  const history = useHistory();
  const [productData, setProductData] = useState(null);
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [unit, setUnit] = useState('');
  const [sku, setSku] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [qty, setQty] = useState('');
  const [descr, setDescr] = useState('');
  const [tax, setTax] = useState('');
  const [discount, setDiscount] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('');
  const [image, setImage] = useState([]);
  const [options, setOptions] = useState([]);
  const [options1, setOptions1] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [loading, setLoading] = useState(true);

  const productDatas = { productName, category, subCategory, brand, unit, sku, expiryDate, qty, descr, tax, discount, price, status }

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${productUrl}/edit-details/${id}`);
        setProductData(response.data);
      } catch (error) {
        console.log(error);
        history.push('/error-500')
      }
    };
    fetchProductDetails();
  }, []);

  useEffect(() => {
    if (productData) {
      setProductName(productData.productName);
      setCategory(productData.category);
      setSubCategory(productData.subCategory);
      setBrand(productData.brand);
      setUnit(productData.unit);
      setSku(productData.sku);
      setExpiryDate(productData.expiryDate);
      setQty(productData.qty);
      setDescr(productData.descr);
      setTax(productData.tax);
      setDiscount(productData.discount);
      setPrice(productData.price);
      setStatus(productData.status);
      setImage(productData.image);
      // Update other state variables similarly
    }
  }, [productData]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        await axios.get(`${productUrl}/category-list`).then((response) => {
          const datas = response.data.categoryData.map((category) => ({
            id: category._id,
            text: category.categoryName
          }));
          setOptions(datas)
        })
        await axios.get(`${productUrl}/sub-category-list`).then((response) => {
          const datas = response.data.subCategoryData.map((subCategory) => ({
            id: subCategory._id,
            text: subCategory.subCategoryName
          }));
          setOptions1(datas)
        })
        await axios.get(`${productUrl}/brand-list`).then((response) => {
          const datas = response.data.brandData.map((brand) => ({
            id: brand._id,
            text: brand.brandName
          }));
          setOptions2(datas)
        })
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    fetchOptions()
  }, [])

  const editProduct = async (e) => {
    try {
      e.preventDefault();

      // Check if an image is selected
      if (image.length === 0) {
        // Handle the case where no image is selected
        console.log('No image selected');
        const allData = { productDatas, image }
        const response = await axios.put(`${productUrl}/edit-product/${id}`, allData);
        if (response.data.success) {
          toast.success(response.data.message);
          history.push('/dream-pos/product/productlist-product');
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
        console.log('Uploaded image URL: ', uploadedImageUrl);

        const allData = { productDatas, image: uploadedImageUrl };
        console.log('All data: ', allData);

        const response = await axios.put(`${productUrl}/edit-product/${id}`, allData);
        if (response.data.success) {
          toast.success(response.data.message);
          history.push('/dream-pos/product/productlist-product');
        }
      }

    } catch (error) {
      console.log(error);
            toast.error('Invalid Values')
    }
  };

  if (!productData) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Product Edit</h4>
              <h6>Update your product</h6>
            </div>
          </div>
          {/* /add */}
          <form onSubmit={editProduct} action="">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Product Name</label>
                      <input type="text" value={productName}
                        onChange={(e) => setProductName(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Category</label>
                      <Select2
                        className="select"
                        data={options}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        options={{
                          placeholder: "Category",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Sub Category</label>
                      <Select2
                        className="select"
                        data={options1}
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        options={{
                          placeholder: "Sub Category",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Brand</label>
                      <Select2
                        className="select"
                        data={options2}
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        options={{
                          placeholder: "Brand",
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Unit</label>
                      <Select2
                        className="select"
                        data={options4}
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        options={{
                          placeholder: "Unit",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>SKU</label>
                      <input type="text" value={sku}
                        onChange={(e) => setSku(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <DatePicker
                        selected={expiryDate}
                        onChange={(date) => setExpiryDate(date)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Quantity</label>
                      <input type="text" value={qty}
                        onChange={(e) => setQty(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        className="form-control"
                        value={descr}
                        onChange={(e) => setDescr(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Tax</label>
                      <Select2
                        className="select"
                        data={options5}
                        value={tax}
                        onChange={(e) => setTax(e.target.value)}
                        options={{
                          placeholder: "Tax",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Discount Type</label>
                      <Select2
                        className="select"
                        data={options6}
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        options={{
                          placeholder: "Discount Type",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Price</label>
                      <input type="text" value={price}
                        onChange={(e) => setPrice(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label> Status</label>
                      <Select2
                        className="select"
                        data={options7}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        options={{
                          placeholder: "Status",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label> Product Image</label>
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
                  {image.length !== 0 ? (
                    <div className="col-12">
                      <div className="product-list">
                        <ul className="row">
                          <li>
                            <div className="productviews">
                              <div className="productviewsimg">
                                <img src={image} alt="img" />
                              </div>
                              <div className="productviewscontent">
                                <div className="productviewsname">
                                  <h2>{productName}</h2>
                                  <h3>581kb</h3>
                                </div>
                                <a onClick={(e) => setImage([])} className="hideset">
                                  x
                                </a>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <div className="col-lg-12">
                    <button
                      href="#"
                      className="btn btn-submit me-2"
                    >
                      Update
                    </button>
                    <Link to="/dream-pos/product/productlist-product" className="btn btn-cancel">
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

export default EditProduct;
