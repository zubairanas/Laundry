const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const referalManagementSchema = new Schema(
  {
     code : {
        type : String,
        default : ""
    }, 
    discount:{
        type : Number
    },
    user:{
        type : Schema.Types.ObjectId,
        ref : "user"
    }
   
  },
  { timestamps: true}
);

module.exports = mongoose.model("referal", referalManagementSchema);