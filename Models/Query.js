const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const queryManagementSchema = new Schema(
  {
    firstName: {
      type: String,
      require : true
    },
    lastName: {
        type: String,
        require : true
      },
    email: {
        type: String,
        require : true
    },
    subject: {
        type: String,
        require : true
    },
    message: {
        type: String,
        require : true
    },
    date:{
        type : String
    },
    status: {
      type: String,
      enum: ["Responded", "Pending"],
      default: "Pending"
    } 
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("query", queryManagementSchema);