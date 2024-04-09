import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: {
        type: String,
        default:"visitor"
    }
})

const User = mongoose.model('users', userSchema)

export default User