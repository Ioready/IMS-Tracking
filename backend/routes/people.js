import express from 'express'
import { addCustomer, addImportTransfer, addInvoice, addQuotation, addSale, addSalesReturn, addStore, addSupplier, addTransfer, addUser, createPayment, deleteCustomer, deleteInvoice, deletePayment, deleteQuotation, deleteReturnSale, deleteSale, deleteStore, deleteSupplier, deleteTransfer, deleteUser, editCustomer, editDetails, editInvoice, editQuotation, editSale, editSaleReturn, editStore, editSupplier, editSupplierDetails, editTransfer, editUser, getCustomers, getInvoiceDetail, getQuotationDetail, getQuotationList, getReturnSaleDetail, getSaleDetail, getSalesList, getSalesReturnList, getStoreDetails, getStoreList, getSuppliers, getTransferDetail, getTransferList, getUserDetails, getUserList, invoiceReport, salesReport, updateStatus } from '../controllers/peopleController.js'
import userAuth from '../middleware/userAuth.js'

const router = express.Router()

router.get('/', getCustomers)
router.get('/sales', getSalesList)
router.get('/suppliers', getSuppliers)
router.get('/user-list', getUserList)
router.get('/store-list', getStoreList)
router.get('/transfer-list', getTransferList)
router.get("/get-sales-report", salesReport);
router.get('/get-user-details/:id', getUserDetails)
router.get('/get-store-details/:id', getStoreDetails)
router.get('/get-transfer-details/:id', getTransferDetail)
router.get('/edit-details/:id', editDetails)
router.get('/invoices-report', invoiceReport)
router.get('/get-invoice-details/:id', getInvoiceDetail)
router.get('/get-sale-details/:id', getSaleDetail)
router.get('/sales-return-list', getSalesReturnList)
router.get('/quotation-list', getQuotationList)
router.get('/edit-supplier-details/:id', editSupplierDetails)
router.get('/get-return-sale-details/:id', getReturnSaleDetail)
router.get('/get-quotation-details/:id', getQuotationDetail)


router.post('/add-customer', addCustomer)
router.post('/add-supplier', addSupplier)
router.post('/add-sale', userAuth ,addSale)
router.post('/add-invoice', addInvoice)
router.post('/add-sales-return', addSalesReturn)
router.post('/add-quotation', addQuotation)
router.post('/add-user', addUser)
router.post('/add-store', addStore)
router.post('/add-import-transfer', addImportTransfer)
router.post('/add-transfer', addTransfer)

router.put('/edit-customer/:id', editCustomer)
router.put('/edit-supplier/:id', editSupplier)
router.put('/edit-user/:id', editUser)
router.put('/edit-store/:id', editStore)
router.put('/edit-transfer/:id', editTransfer)
router.put('/update-status/:id', updateStatus)
router.put('/edit-sale/:id', editSale)
router.put('/edit-invoice/:id', editInvoice)
router.put('/edit-sale-return/:id', editSaleReturn)
router.put('/edit-quotation/:id', editQuotation)
router.put('/create-payment/:id', createPayment)


router.delete('/delete-customer/:id', deleteCustomer)
router.delete('/delete-supplier/:id', deleteSupplier)
router.delete('/delete-sale/:id', deleteSale)
router.delete('/delete-payment/:id', deletePayment)
router.delete('/delete-invoice/:id', deleteInvoice)
router.delete('/delete-return-sale/:id', deleteReturnSale)
router.delete('/delete-quotation/:id', deleteQuotation)
router.delete('/delete-user/:id', deleteUser)
router.delete('/delete-store/:id', deleteStore)
router.delete('/delete-transfer/:id', deleteTransfer)


export default router