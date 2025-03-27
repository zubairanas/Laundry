const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contentManagementSchema = new Schema(
  {
    name: {
      type: String,
      unique : true
    },
    description: {
        type: String,
        unique : true
        },
    contentImage: {
      type: String,
     
    },
   
    
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("content", contentManagementSchema);