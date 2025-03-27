const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponManagementSchema = new Schema(
  {
    title : {
        type : String,
        default : "",
        required : true
    },
    code : {
        type : String,
        default : ""
    },
    noOfTimes:{
        type : Number,
        default : 0
    },
    limitCoupenTimes:{
        type : Number,
        default : 0
    },
    discount:{
        type : Number,
        default : 0,
        required : true
    },
    expireDate : {
        type : String,
        required : true
    },
    status:{
        type : String,
        enum : ["Active" , "inActive"],
        default : "Active"
    },
    
   
  },
  { timestamps: true}
);

module.exports = mongoose.model("coupen", couponManagementSchema);