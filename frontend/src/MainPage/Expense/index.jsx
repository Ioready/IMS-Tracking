/* eslint-disable react/prop-types */
import React from 'react'
import { Redirect, Route ,Switch} from 'react-router-dom';
import ExpenseList from './ExpenseList.jsx'
import AddExpense from './AddExpense.jsx';
import EditExpense from './EditExpense.jsx';
import ExpenseCategory from './ExpenseCategory.jsx';
import AddExpenseCategory from './AddExpenseCategory.jsx';
import EditExpenseCategory from './EditExpenseCategory.jsx';

const PurchaseRoute = ({ match}) =>(
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/expenselist-expense`} />
        <Route path={`${match.url}/expenselist-expense`} component={ExpenseList} />
        <Route path={`${match.url}/addexpense-expense`} component={AddExpense} />
        <Route path={`${match.url}/editexpense-expense/:id`} component={EditExpense} />
        <Route path={`${match.url}/expensecategory-expense`} component={ExpenseCategory} />
        <Route path={`${match.url}/addexpensecategory-expense`} component={AddExpenseCategory} />
        <Route path={`${match.url}/editexpensecategory-expense/:id`} component={EditExpenseCategory} />
    </Switch>
)

export default PurchaseRoute;