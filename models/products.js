const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name :{
        type : String,
        required : [true, "Please provide product name"],
        trim : true,
        maxlength : [100, "Product name can not be more than 100 characters"]
    },
    price : {
        type : Number,
        required : [true, "Please provide product price"],
        default : 0
    },
    featured : {
        type : Boolean,
        default : false
    },
    company : {
        type : String,
        enum : {
            values : ["ikea", "liddy", "marcos"],
            message : "{VALUE} is not supported"
        }
    },
    rating :{
        type : Number,
        default : 4.5,
        min : [1, "Rating must be at least 1"],
        max : [5, "Rating must be at most 5"]
    }
})

module.exports = mongoose.model("Product", ProductSchema);