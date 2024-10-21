/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import Barcode from 'react-barcode';
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { productUrl } from "../../Apis/Api";

const ProductDetails = () => {
  const [productData, setProductData] = useState(null);
  const [barcodeValue, setBarcodeValue] = useState(null);
  const Id = useParams();
  const id =  Id.id
  const history = useHistory();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${productUrl}/view-details/${id}`);
        console.log('res: ', response);
        setProductData(response.data);
        setBarcodeValue(response.data.sku);
      } catch (error) {
        console.log(error);
        history.push('/error-500')
      }
    };
    fetchProductDetails();
  }, []);

  if (!productData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Product Details</h4>
            <h6>Full details of a product</h6>
          </div>
        </div>
        {/* /add */}
        <div className="row">
          <div className="col-lg-8 col-sm-12">
            <div className="card">
              <div className="card-body">
                <div className="bar-code-view">
                  {/* <img src={barcode1} alt="barcode" /> */}
                    <Barcode value={barcodeValue} />
                  {/* <Link to="#" className="printimg"> */}
                    {/* <img src={Printer} alt="print" /> */}
                  {/* </Link> */}
                </div>
                <div className="productdetails">
                  <ul className="product-bar">
                    <li>
                      <h4>Product</h4>
                      <h6>{productData.productName}</h6>
                    </li>
                    <li>
                      <h4>Category</h4>
                      <h6>{productData.category}</h6>
                    </li>
                    <li>
                      <h4>Sub Category</h4>
                      <h6>{productData.subCategory}</h6>
                    </li>
                    <li>
                      <h4>Brand</h4>
                      <h6>{productData.brand}</h6>
                    </li>
                    <li>
                      <h4>Unit</h4>
                      <h6>{productData.unit}</h6>
                    </li>
                    <li>
                      <h4>SKU</h4>
                      <h6>{productData.sku}</h6>
                    </li>
                    {/* <li>
                      <h4>Minimum Qty</h4>
                      <h6>{productData.min}</h6>
                    </li> */}
                    <li>
                      <h4>Quantity</h4>
                      <h6>{productData.qty}</h6>
                    </li>
                    <li>
                      <h4>Tax</h4>
                      <h6>{productData.tax}</h6>
                    </li>
                    <li>
                      <h4>Discount Type</h4>
                      <h6>Percentage</h6>
                    </li>
                    <li>
                      <h4>Price</h4>
                      <h6>{productData.price}.00</h6>
                    </li>
                    <li>
                      <h4>Status</h4>
                      <h6>Active</h6>
                    </li>
                    <li>
                      <h4>Description</h4>
                      <h6>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                      </h6>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-sm-12">
            <div className="card">
              <div className="card-body">
                <div className="slider-product-details">
                    <OwlCarousel
                      className="owl-theme"
                      items={1}
                      dots={false}
                      nav
                    >
                      <div className="slider-product item">
                        <img src={productData.image} alt="img" />
                        <h4>{productData.productName}</h4>
                        <h6>581kb</h6>
                      </div>
                      <div className="slider-product item">
                        <img src={productData.image} alt="img" />
                        <h4>{productData.productName}</h4>
                        <h6>581kb</h6>
                      </div>
                    </OwlCarousel>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /add */}
      </div>
    </div>
  );
};

export default ProductDetails;
