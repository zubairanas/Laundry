const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    
   services : [{ 
    categoryId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'category',
        required : true
    },
    products:[{
        productId :{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'product',
            required : true
        },
        quantity :{
            type :Number,
            required : true
        } 
    }]
}],

    userid :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
    } ,


    collectionTime :[{
        date:{ type : String , required : true , default : "" },
        time:{ type : String , required : true , default : "" },
        instructions:{ 
            type : String , 
            enum :["Collect from me in person","Collect from outside","Collect from reception/porter"] 
        }
    }],

    DeliveryTime :[{
        date:{ type : String , required : true , default : "" },
        time:{ type : String , required : true , default : "" },
        instructions:{ 
            type : String , 
            enum :[ "Deliver to me in person","Leave at the door", "Deliver to the reception/porter"] 
        }
    }],


    description:{ type : String , required : true , default : "" },

    email:{ type : String , default : "" },

    // frequency : {
    //     type : String ,
    //     enum : ["justOnce" , "weekly" , "everyTwoWeeks" ,"everyFourWeeks"]
    // },

    paymentId : { type : mongoose.Schema.Types.ObjectId , ref : 'payment' , required : true  },

    grossTotal:{ type : Number , required : true },
    serviceFee:{ type : Number , required : true },
    deliveryFee:{ type : Number , required : true ,default : 0 },
    driverTip : { type : Number },
    Total : { type : Number},
    status:{ 
        type : String , 
        enum :[ "pending","", "completed"] ,
        default : "pending"
    },
    orderNumber : {type : "String" , default : "" , required : true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);