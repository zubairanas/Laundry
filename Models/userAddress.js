const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userAddressSchema = new Schema(
  {
    postcode:{
        type : String,
        required : true
    },
    address:{
        type : String,
        required : true
    },
    addressType :{
        type : String,
        enum : ['home' , 'office' , 'hotel'],
        required : true
    },
    userid :{
      type : mongoose.Schema.Types.ObjectId,
      ref : 'user',
      required : true
    },
    orderid :{
      type : mongoose.Schema.Types.ObjectId,
      ref : 'order',
      // required : true
    },


    
  },
  { timestamps: true }
);

module.exports = mongoose.model("address", userAddressSchema);