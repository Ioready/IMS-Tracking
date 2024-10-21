/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  Calendar,
  Plus,
  Scanner,
  DeleteIcon,
  EditIcon,
  MacbookIcon,
  EarpodIcon,
  Dollar,
} from "../../EntryFile/imagePath";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { expenseUrl } from "../../Apis/Api";
import { toast } from "react-toastify";

const EditExpenseCategory = () => {
  const Id = useParams()
  const id = Id.id
  const [categoryName, setCategoryName] = useState('')
  const [description, setDescription] = useState('')
  const [data, setData] = useState({})
  const history = useHistory()

  const expenseData = { categoryName, description }

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${expenseUrl}/get-expenses-category-by-id/${id}`);
        console.log('get: ', response.data);
        setData(response.data.expensesCat);
      } catch (error) {
        console.log(error);
        // history.push('/error-500')
      }
    };
    fetchProductDetails();
  }, []);

  useEffect(() => {
    if (data) {
      setDescription(data.description)
      setCategoryName(data.categoryName)
    }
  }, [data]);

  const editExpense = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.put(`${expenseUrl}/edit-expenses-category/${id}`, expenseData);
      if (response.data.success) {
        toast.success(response.data.message);
        history.push('/dream-pos/expense/expensecategory-expense');
      }
    } catch (error) {
      toast.error('Invalid Values')
      console.log(error);
    }
  };
  
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Expense EDIT</h4>
              <h6>Add/Update Expenses</h6>
            </div>
          </div>
          <form action="" onSubmit={editExpense}>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="form-group">
                    <label>Expense Category</label>
                    <div className="input-groupicon">
                      <input type="text" name="discount" value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)} />
                      <div className="addonset">
                        <img src={Dollar} alt="img" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea className="form-control" defaultValue={""} value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <button type="submit" className="btn btn-submit me-2">Submit</button>
                    <Link to="/dream-pos/expense/expensecategory-expense" className="btn btn-cancel">Cancel</Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditExpenseCategory;
