const mongoose= require('mongoose')
const Schema = mongoose.Schema;


const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    order_time: {
        type: String,
        required: true
    },
    order_date: {
        type: String,
        require: true
    },
    cake_flavour: {
        type: String,
        require: true
    },
    kg: {
        type: String,
        require: true
    }

});

const order = mongoose.model("order", orderSchema);
module.exports = order;