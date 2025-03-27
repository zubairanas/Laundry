const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    
    subCatId : {
        type : mongoose.Schema.Types.ObjectId,
        default : "subcategory",
        required : true
    },
    title : {
        type : String,
        default : "",
        required : true
    },
    description :{
      type : String,
      default : "",
      required : true
    },
    price : {
        type : Number,
        default : 0,
    },
    weight : {
      type : String,
  },
    status:{
        type : String,
        enum : ["Active" , "inActive"],
        default : "Active"
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);