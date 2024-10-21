import mongoose from 'mongoose'
const Objectid = mongoose.Types.ObjectId

const salesReturnSchema = new mongoose.Schema({
    customerName: {
        type: Objectid,
        ref: 'customers'
        // required: true
    },
    startDate: {
        type: Date
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
    description: {
        type: String
    },
    grandTotalNumber: {
        type: Number
    },
    selectedProducts: {
        type: Array
    },
    dueAmount: {
        type: Number,
        default: 0
    },
    reference: {
        type: String,
        default: "Reference not added"
    },
    paid: {
        type: Number,
        default: 0
    },
    payment_status: {
        type: String,
        default: 'Paid'
    }
})


const salesReturnModel = mongoose.model('salesreturn', salesReturnSchema)
export default salesReturnModel