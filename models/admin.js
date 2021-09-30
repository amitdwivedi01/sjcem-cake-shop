const mongoose= require('mongoose')
const Schema = mongoose.Schema;

const adminSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,        
    },
    lname: {
        type: String,
        required: true,        
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

const admin = mongoose.model("admin", adminSchema);
module.exports = admin;