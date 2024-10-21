import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    categoryCode: {
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


const categoryModel = mongoose.model('categories', categorySchema)
export default categoryModel