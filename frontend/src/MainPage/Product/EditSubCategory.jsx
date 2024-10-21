/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
import axios from "axios";
import React, { useEffect, useState } from "react";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { productUrl } from "../../Apis/Api";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";

const EditSubCategory = () => {
  const Id = useParams();
  const id = Id.id
  const history = useHistory();
  const [productData, setProductData] = useState(null);
  const [parentCategory, setParentCategory] = useState('');
  const [subCategoryName, setSubCategoryName] = useState('');
  const [subCategoryCode, setSubCategoryCode] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState([]);

  const productDatas = { parentCategory, subCategoryName, subCategoryCode, description }

  useEffect(() => {
    const Options = async () => {
      try {
        await axios.get(`${productUrl}/category-list`).then((response) => {
          const datas = response.data.categoryData.map((category) => ({
            id: category._id,
            text: category.categoryName
          }));
          console.log('datas:', datas);
          setOptions(datas)
        })
      } catch (error) {
        console.log(error);
      }
    }
    Options()
  }, [])

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${productUrl}/edit-sub-category-details/${id}`);
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
      setParentCategory(productData.parentCategory);
      setSubCategoryName(productData.subCategoryName);
      setSubCategoryCode(productData.subCategoryCode);
      setDescription(productData.description);
      // Update other state variables similarly
    }
  }, [productData]);

  const editSubCategory = async (e) => {
    try {
      e.preventDefault();
        const response = await axios.put(`${productUrl}/edit-sub-category/${id}`, productDatas);
        if (response.data.success) {
          toast.success(response.data.message);
          history.push('/dream-pos/product/subcategorytable-product');
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
              <h4>Product Edit Sub Category</h4>
              <h6>Create new product Category</h6>
            </div>
          </div>
          {/* /add */}
          <form onSubmit={editSubCategory} action="">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Parent Category</label>
                    <Select2
                      className="select"
                      data={options}
                      value={parentCategory}
                      onChange={(e) => setParentCategory(e.target.value)}
                      options={{
                        placeholder: "Computers",
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Category Name</label>
                    <input type="text" name="subCategoryName" value={subCategoryName}
                      onChange={(e) => setSubCategoryName(e.target.value)} />
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Category Code</label>
                    <input type="text" name="subCategoryCode" value={subCategoryCode}
                      onChange={(e) => setSubCategoryCode(e.target.value)} />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Description</label>
                    <textarea className="form-control" defaultValue={""} name="description" value={description}
                      onChange={(e) => setDescription(e.target.value)}/>
                  </div>
                </div>
                <div className="col-lg-12">
                  <button type="submit" className="btn btn-submit me-2">
                    Submit
                  </button>
                  <a href="/dream-pos/product/subcategorytable-product" className="btn btn-cancel">
                    Cancel
                  </a>
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

export default EditSubCategory;
