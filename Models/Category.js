const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categoryManagementSchema = new Schema(
  {
    
    catImage : {
        type : String,
        default : "",
        required : true
    },
    title : {
        type : String,
        default : "",
        required : true
    },
    description : {
        type : String,
        default : "",
        required : true
    },
    tags:[
        {
            type : String,
        }
    ],
    price:{
        type : Number,
        default : 0,
        required : true
    },
    priceDescription : {
        type : String,
        default : ""
    },
    priceTypes:{
        type : String,
        enum : ['weight' , 'item'],
        // required : true
    },
    status:{
        type : String,
        enum : ["Active" , "inActive"],
        default : "Active"
    },
    Includes:{
        type : String,
        default : "",
        required : true
    },
    NoOfDays:{
        type : Number,
        default : 0,
        // required : true
    },

    
   
  },
  { timestamps: true}
);

module.exports = mongoose.model("category", categoryManagementSchema);