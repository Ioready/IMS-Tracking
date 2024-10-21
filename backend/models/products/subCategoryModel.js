import mongoose from 'mongoose'
const Objectid = mongoose.Types.ObjectId

const subCategorySchema = new mongoose.Schema({
    subCategoryName: {
        type: String,
        required: true
    },
    parentCategory: {
        type: Objectid,
        ref:'categories'
    },
    subCategoryCode: {
        type: String,
        // required: true
    },
    description: {
        type: String,
        // required: true
    },
    createdBy: {
        type: String,
        default: 'Admin'
    }
})


const subCategoryModel = mongoose.model('sub_categories', subCategorySchema)
export default subCategoryModel