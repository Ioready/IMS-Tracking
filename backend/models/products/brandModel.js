import mongoose from 'mongoose'

const brandSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        // required: true
    },
    image: {
        type: Array,
        // required: true
    }
})


const brandModel = mongoose.model('brands', brandSchema)
export default brandModel