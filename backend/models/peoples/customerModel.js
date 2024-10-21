import mongoose from 'mongoose'

const customerSchema = new mongoose.Schema({
    customerName: {
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


const customerModel = mongoose.model('customers', customerSchema)
export default customerModel