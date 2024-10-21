import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: "First Name Not added"
    },
    lastName: {
        type: String,
        default: "Last Name Not added"
    },
    userName: {
        type: String
    },
    phone: {
        type: Number,
        default: 0
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        default: "Admin"
    },
    roleDescription: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    },
    image: {
        type: Array
    },
    selectedPermissions: {
        type: Array
    }
})


const userModel = mongoose.model('users', userSchema)
export default userModel