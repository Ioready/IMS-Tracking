import mongoose from 'mongoose'
const Objectid = mongoose.Types.ObjectId

const products = {
    
    productName: {
        type: String
    },
    category: {
        type: Objectid,
        ref: 'categories'
    },
    subCategory: {
        type: String
    },
    brand: {
        type: Objectid,
        ref: 'brands'
    },
    unit: {
        type: String
    },
    sku: {
        type: String
    },
    min: {
        type: Number
    },
    qty: {
        type: Number
    },
    descr: {
        type: String
    },
    tax: {
        type: String
    },
    discount: {
        type: String
    },
    price: {
        type: Number
    },
    status: {
        type: String
    },
    image: {
        type: []
    },
    subTotal: {
        type: Number
    },
    taxAmount: {
        type: Number
    },
    exist: {
        type: Boolean
    },
    quantity: {
        type: Number
    }



}

const salesSchema = new mongoose.Schema({
    customerName: {
        type: Objectid,
        ref: 'customers'
        // required: true
    },
    startDate: {
        type: Date
    },
    supplierName: {
        type: Objectid,
        ref: 'suppliers'
    },
    orderTax: {
        type: String
    },
    totalDiscount: {
        type: Number
    },
    shipping: {
        type: Number
    },
    status: {
        type: String
    },
    payment_status: {
        type: String,
        default: 'Paid'
    },
    grandTotalNumber: {
        type: Number
    },
    selectedProducts: {
        type: [products]
    },
    dueAmount: {
        type: Number,
        default: 0
    },
    biller: {
        type: String,
        default: "Admin"
    },
    paymentDate: {
        type: Date
    },
    reference: {
        type: String,
        default: "Reference not added"
    },
    receivedAmount: {
        type: Number,
        default: 0
    },
    payingAmount: {
        type: Number,
        default: 0
    },
    paymentType: {
        type: String
    },
    note: {
        type: String
    },
    invoice : {
        type: Boolean,
        default: false
    },
    invoice_number : {
        type: String
    },
    dueDate : {
        type: String,
        default: "INV00"
    },
    invoice_status : {
        type: String,
        default: "Paid"
    },
},{timestamps:true})


const salesModel = mongoose.model('sales', salesSchema)
export default salesModel