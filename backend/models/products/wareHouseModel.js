import mongoose from 'mongoose'

const wareHouseSchema = new mongoose.Schema({
    wareHouseName: {
        type: String,
        required: true
    },
    wareHouseCode: {
        type: String,
        // required: true
    },
    description: {
        type: String,
        // required: true
    },
    image: {
        type: Array,
        // required: true
    },
    createdBy: {
        type: String,
        default: 'Admin'
    }
})


const wareHouseModel = mongoose.model('warehouses', wareHouseSchema)
export default wareHouseModel