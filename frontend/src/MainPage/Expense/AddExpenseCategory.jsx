/* eslint-disable no-unused-vars */
import React, { useState } from "react";
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
import axios from "axios";
import { expenseUrl } from "../../Apis/Api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";

const AddExpenseCategory = () => {
    const [categoryName, setCategoryName] = useState('')
    const [description, setDescription] = useState('')
    const history = useHistory()

    const expenseData = { categoryName, description }

    const addExpense = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(`${expenseUrl}/add-expenses-category`, expenseData);
            if (response.data.success) {
                toast.success(response.data.message);
                history.push('/dream-pos/expense/expensecategory-expense');
              }
            // setGrandTotalNumber(grandTotal)
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
                            <h4>Add Expense Category</h4>
                            <h6>Add Expenses Category</h6>
                        </div>
                    </div>
                    <form action="" onSubmit={addExpense}>
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-3 col-sm-6 col-12">
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

export default AddExpenseCategory;
