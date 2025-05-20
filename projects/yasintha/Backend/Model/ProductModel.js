const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    ProductId:{
        type:Number,//datatype
        required:true,//validate
    },
     ProductName:{
        type:String,//datatype
        required:true,//validate
     },
     ProductCategory:{
        type:String,//datatype
        required:true,//validate
     },
     ProductDescription:{
        type:String,//datatype
        required:true,//validate
     },
     ProductPrice:{
        type:Number,//datatype
        required:true,//validate
     },
     ProductQuantity:{
        type:Number,//datatype
        required:true,//validate
     },
     ManufactureDate:{
        type:Date,//datatype
        required:true,//validate
     },
     ExpireDate:{
        type:Date,//datatype
        required:true,//validate
     },
     ImageURL:{
        type:String,//datatype
        required:true,//validate
     }
});

//Export the model
module.exports = mongoose.model(
     "ProductModel",//file name
     productSchema,//function name

);