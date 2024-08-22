import mongoose, { isObjectIdOrHexString } from "mongoose"

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email:  {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin","user"],
        default: "user"
    },
    cartId: {
        type: String
    }
    
})

const userModel = mongoose.model('users',userSchema)

export default userModel