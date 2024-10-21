import mongoose from 'mongoose'

const supplierSchema = new mongoose.Schema({
    supplierName: {
        type: String,
        // required: true
    },
    email: {
        type: String
    },
    phone: {
        type: Number
    },
    country: {
        type: String
    },
    code: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    zipCode: {
        type: Number
    },
    address: {
        type: String
    },
    descr: {
        type: String
    },
    image: {
        type: Array
    }
})


const supplierModel = mongoose.model('suppliers', supplierSchema)
export default supplierModel