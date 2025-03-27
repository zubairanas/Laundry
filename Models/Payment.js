const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
  {
    CardholderName: {
      type: String,
      require : true
    },
    Cardnumber: {
      type: String,
      require : true
    },
    Expirydate: {
        type: String,
        require : true
      },
    cardType: {
        type: String,
        require : true
    },
    userid :{
      type : mongoose.Schema.Types.ObjectId,
      ref : 'user',
      required : true
    }
    
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("payment", PaymentSchema);