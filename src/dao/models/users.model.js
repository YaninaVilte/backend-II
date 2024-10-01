import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carritos"
    },
    rol: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
})

const UsersModel = mongoose.model("usuarios", usersSchema); 

export default UsersModel;