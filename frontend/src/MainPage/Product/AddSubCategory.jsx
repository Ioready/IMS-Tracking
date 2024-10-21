/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { productUrl } from "../../Apis/Api";
import { toast } from "react-toastify";

const AddSubCategory = () => {
  const [parentCategory, setParentCategory] = useState('');
  const [subCategoryName, setSubCategoryName] = useState('');
  const [subCategoryCode, setSubCategoryCode] = useState('');
  const [description, setDescription] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);
  const [options, setOptions] = useState([]);

  const history = useHistory()
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

  const addSubCategory = async (e) => {
    try {
      e.preventDefault();
      const token = localStorage.getItem('token')
      setSubmitClicked(true)

      if (!parentCategory || !subCategoryName) {
        return;
      }

      const response = await axios.post(`${productUrl}/add-sub-category`, productDatas, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Product Add sub Category</h4>
            <h6>Create new product Category</h6>
          </div>
        </div>
        {/* /add */}
        <form onSubmit={addSubCategory} action="">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className="form-group">
                    <label className={`${submitClicked && !parentCategory ? 'error-message' : ''}`}>Parent Category</label>
                    <Select2
                      className="select"
                      data={options}
                      value={parentCategory}
                      onChange={(e) => setParentCategory(e.target.value)}
                      options={{
                        placeholder: "Category",
                      }}
                    />
                    {submitClicked && !parentCategory && (
                      <span className="error-message">Parent Category Option is required.</span>
                    )}
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 col-12">
                  <div className={`form-group ${submitClicked && !subCategoryName ? 'error' : ''}`}>
                    <label className={`${submitClicked && !subCategoryName ? 'error-message' : ''}`}>Category Name</label>
                    <input type="text" name="subCategoryName" value={subCategoryName}
                      onChange={(e) => setSubCategoryName(e.target.value)}
                      className={`${submitClicked && !subCategoryName ? 'error' : ''}`} />
                    {submitClicked && !subCategoryName && (
                      <span className="error-message">Sub Category Name is required.</span>
                    )}
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
                      onChange={(e) => setDescription(e.target.value)} />
                  </div>
                </div>
                <div className="col-lg-12">
                  <button className="btn btn-submit me-2">Submit</button>
                  <Link to='/dream-pos/product/subcategorytable-product' className="btn btn-cancel">Cancel</Link>
                </div>
              </div>
            </div>
          </div>
        </form>
        {/* /add */}
      </div>
    </div>
  );
};

export default AddSubCategory;
