import mongoose from 'mongoose'

const storeSchema = new mongoose.Schema({
    storeName: {
        type: String
    },
    userName: {
        type: String
    },
    phone: {
        type: Number
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    image: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    }
})


const storeModel = mongoose.model('stores', storeSchema)
export default storeModel