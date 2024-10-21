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

const EditExpense = () => {
  const Id = useParams()
  const id = Id.id
  const [expensesDate, setExpensesDate] = useState(new Date());
  const [expensesCategory, setExpensesCategory] = useState('')
  const [amount, setAmount] = useState(0)
  const [referenceNumber, setReferenceNumber] = useState('')
  const [expensesFor, setExpensesFor] = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions] = useState([])
  const [data, setData] = useState({})
  const history = useHistory()

  const expenseData = { expensesCategory, expensesDate, amount, referenceNumber, expensesFor, description }

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${expenseUrl}/get-category-by-id/${id}`);
        console.log('get: ', response.data);
        setData(response.data.expense);
      } catch (error) {
        toast.error('Invalid Values')
        console.log(error);
        // history.push('/error-500')
      }
    };
    fetchProductDetails();
  }, []);

  useEffect(() => {
    if (data) {
      const trimmedStartDate = data.expensesDate ? data.expensesDate.trim() : '';
      const expensesDate = trimmedStartDate ? new Date(trimmedStartDate) : null;
      setExpensesDate(expensesDate)
      setDescription(data.description)
      setExpensesCategory(data.expensesCategory)
      setAmount(data.amount)
      setReferenceNumber(data.referenceNumber)
      setExpensesFor(data.expensesFor)
    }
  }, [data]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        await axios.get(`${expenseUrl}/get-expenses-category`).then((response) => {
          const datas = response.data.expensesCat.map((expense) => ({
            id: expense._id,
            text: expense.categoryName
          }));
          setOptions(datas)
        })
      } catch (error) {
        console.log(error);
      }
    }
    fetchOptions()
  }, [])

  const editExpense = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.put(`${expenseUrl}/edit-expenses/${id}`, expenseData);
      if (response.data.success) {
        toast.success(response.data.message);
        history.push('/dream-pos/expense/expenselist-expense');
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
              <h4>Expense Category EDIT</h4>
              <h6>Update Expenses</h6>
            </div>
          </div>
          <form action="" onSubmit={editExpense}>
          <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Expense Category</label>
                      <div className="row">
                        <div className="form-group">
                          <Select2
                            className="select"
                            data={options}
                            value={expensesCategory}
                            onChange={(e) => setExpensesCategory(e.target.value)}
                            options={{
                              placeholder: "Choose Category",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Expense Date </label>
                      <div className="input-groupicon">
                        <DatePicker
                          selected={expensesDate}
                          onChange={(date) => setExpensesDate(date)}
                        />
                        <div className="addonset">
                          <img src={Calendar} alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Amount</label>
                      <div className="input-groupicon">
                        <input type="text" name="discount" value={amount}
                          onChange={(e) => setAmount(e.target.value)} />
                        <div className="addonset">
                          <img src={Dollar} alt="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Reference No.</label>
                      <input type="text" name="discount" value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-lg-12 col-sm-6 col-12">
                    <div className="form-group">
                      <label>Expense for</label>
                      <div className="input-groupicon">
                        <input type="text" name="discount" value={expensesFor}
                          onChange={(e) => setExpensesFor(e.target.value)} />
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
                    <Link to="/dream-pos/expense/expenselist-expense" className="btn btn-cancel">Cancel</Link>
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

export default EditExpense;
