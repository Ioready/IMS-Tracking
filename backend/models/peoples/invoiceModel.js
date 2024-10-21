import mongoose from 'mongoose'
const Objectid = mongoose.Types.ObjectId

const invoiceSchema = new mongoose.Schema({
    customerName: {
        type: Objectid,
        ref: 'customers'
        // required: true
    },
    dueDate: {
        type: Date
    },
    invoice_number: {
        type: String
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
    paid: {
        type: Number,
        default: 0
    },
    dueAmount: {
        type: Number,
        default: 0
    },
    invoice_status: {
        type: String
    }
})


const invoiceModel = mongoose.model('invoices', invoiceSchema)
export default invoiceModel