/* eslint-disable react/prop-types */
import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import Purchaseorder from './purchaseorder'
import Inventry from './inventry'
import Sales from './sales'
import Invoices from './invoices'
import Purchase from './purchase'
import Supplier from './supplier'
import Customer from './customer'
import PurchaseDetails from './viewpurchaseorder';
import AddInvoice from './addInvoice';
import EditInvoice from './editInvoice';
import SupplierDetails from './supplierDetails';
import PaymentDetails from './paymentDetails';
import ReturnDetails from './returnDetails';
import CustomerDetail from './cusomerDetails';
import SalesDetail from './salesDetail';





const AppIndex = ({ match}) =>(
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/purchaseorderreport`} />
        <Route path={`${match.url}/purchaseorderreport`} component={Purchaseorder} />
        <Route path={`${match.url}/details/:productName/:totalQuantity/:totalPrice/:qty`} component={PurchaseDetails} />
        <Route path={`${match.url}/inventoryreport`} component={Inventry} />
        <Route path={`${match.url}/salesreport`} component={Sales} />
        <Route path={`${match.url}/sales-details/:productNames/:skuList/:category/:brand/:soldAmount/:soldQty/:instockQty`} component={SalesDetail} />
        <Route path={`${match.url}/invoicereport`} component={Invoices} />
        <Route path={`${match.url}/addinvoicereport`} component={AddInvoice} />
        <Route path={`${match.url}/editinvoicereport/:id`} component={EditInvoice} />
        <Route path={`${match.url}/purchasereport`} component={Purchase} />
        <Route path={`${match.url}/supplierreport`} component={Supplier} />
        <Route path={`${match.url}/supplier-details/:purchaseDate/:grandTotalNumber/:quantity/:status`} component={SupplierDetails} />
        <Route path={`${match.url}/payment-details/:purchaseDate/:referenceNumber/:supplierName/:grandTotalNumber`} component={PaymentDetails} />
        <Route path={`${match.url}/return-details/:referenceNumber/:supplierName/:grandTotalNumber/:status`} component={ReturnDetails} />
        <Route path={`${match.url}/customerreport`} component={Customer} />
        <Route path={`${match.url}/customer-details/:id`} component={CustomerDetail} />

    </Switch>
)

export default AppIndex