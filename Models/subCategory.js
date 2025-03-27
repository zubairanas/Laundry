const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subCategorySchema = new Schema(
  {
    
    catId : {
        type : mongoose.Schema.Types.ObjectId,
        default : "category",
        required : true
    },
    title : {
        type : String,
        default : "",
        required : true
    },
    status:{
        type : String,
        enum : ["Active" , "inActive"],
        default : "Active"
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("subcategory", subCategorySchema);