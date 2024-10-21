import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { productUrl } from "../../Apis/Api";
import axios from "axios";
import PropTypes from 'prop-types';

const Posleft = ({selectedProducts, setSelectedProducts }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subc,setSubc]=useState([]);
  // const [categorySelected, setCategorySelected] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${productUrl}/category-list`);
      const categoryData = response.data.categoryData;
      setCategories(categoryData);
      console.log("categoryData", categoryData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };


  const products = async () => {
    try {
      await axios.get(`${productUrl}`).then((response) => {
        const datas = response.data
        setSubCategories(datas)
      })
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    products();
    fetchCategories();
  }, [])

  const handleProductSelect = (subcategory) => {
    setSelectedProducts((prevSelectedProducts) => {
      // Add or remove the product from the selection
      if (prevSelectedProducts.some(product => product.id === subcategory.id)) {
        return prevSelectedProducts.filter(product => product.id !== subcategory.id);
      } else {
        return [...prevSelectedProducts, subcategory];
      }
    });
  };

  const handleCategorySelected=(name)=>{
    console.log("subCategories",subCategories,name);  
   const subc= subCategories.filter(subcategory => subcategory.category === name);
   console.log(subc)
   setSubc(subc);
  }
  return (
    <div className="col-lg-8 col-sm-12 tabs_wrapper">
      <div className="page-header ">
        <div className="page-title">
          <h4>Categories</h4>
          <h6>Manage your purchases</h6>
        </div>
      </div>
      <ul className=" tabs owl-carousel owl-theme owl-product  border-0 ">
        <OwlCarousel
          className="owl-theme"
          items={8}
          margin={10}
          dots={false}
          nav
        >
          {categories.map(product => (
            <li key={product._id} id={product._id} className="item" value={product.name} onClick={()=>handleCategorySelected(product.categoryName)}>
              {product.link ? (
                <Link to="#" className="product-details">
                  <img src={product.image} alt={product.categoryName} />
                  <h6>{product.categoryName}</h6>
                </Link>
              ) : (
                <div className="product-details">
                  <img src={product.image} alt={product.categoryName} />
                  <h6>{product.categoryName}</h6>
                </div>
              )}
            </li>
          ))}
        </OwlCarousel>
      </ul>


      <div className="tabs_container">
        <div className="tab_content active" >
          <div className="row ">
            {subc.length && subc?.map(subcategory => (
                <div key={subcategory.id} className="col-lg-3 col-sm-6 d-flex">
                  <div className={`productset flex-fill ${selectedProducts.some(product => product.id === subcategory.id) ? 'active' : ''}`} 
                onClick={() => handleProductSelect(subcategory)}>
                    <div className="productsetimg">
                      <img src={subcategory.image} alt="img" />
                      <h6>Qty: {subcategory.qty}</h6>
                      <div className="check-product">
                        <i className="fa fa-check" />
                      </div>
                    </div>
                    <div className="productsetcontent">
                      <h5>{subcategory.category}</h5>
                      <h4>{subcategory.subCategory}</h4>
                      <h6>{subcategory.price}</h6>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      
    </div>
  );
};
Posleft.propTypes = {
  selectedProducts: PropTypes.array.isRequired, // Add selectedProducts to propTypes
  setSelectedProducts: PropTypes.func.isRequired, // Add setSelectedProducts to propTypes
};
export default Posleft;
