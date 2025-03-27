const CoupenCode = require("../../Models/couponCode")
const { ApiResponse } = require("../../Helpers");


exports.createCoupenCode = async (req,res) => {
    const {title,expireDate,discount,limitCoupenTimes} = req.body;
    try{

       let checkedCoupen = await CoupenCode.find({title})
      
        if(new Date() > new Date(expireDate) || new Date() == new Date(expireDate)){
            return res.status(400).json(ApiResponse({}, "Coupen not created", false));
        }

        if(checkedCoupen.length > 0){
            return res.status(400).json(ApiResponse({}, "Coupen Already Exist", false));
        }

        const data = {
            title,
            code : "L"+Math.floor(Math.random() * 1000000),
            expireDate,
            discount,
            limitCoupenTimes
        }

        const newCoupen = await CoupenCode.create(data);


        res.status(200).json(
            ApiResponse(
              { newCoupen },
              true,
              "coupenCode Created Successfully"
            )
          );
    }catch(error){
        res.status(500).json(ApiResponse({}, error.message, false));
    }
}

exports.userCoupenCode = async (req,res) => {
    const {code} = req.params;
    try{
        
        let coupenDetails =  await CoupenCode.findOne({code})

        if(new Date() > new Date(coupenDetails?.expireDate)){
            return res.status(400).json(ApiResponse({}, "Coupen expired", false));
        }

        if(coupenDetails?.noOfTimes == coupenDetails?.limitCoupenTimes){
            return res.status(400).json(ApiResponse({}, "Coupen Limit Exceed", false));
        }

      const redeemCoupen = await CoupenCode.findByIdAndUpdate(coupenDetails._id, {noOfTimes : coupenDetails.noOfTimes + 1})
        

        res.status(200).json(
            ApiResponse(
              { redeemCoupen },
              "coupenCode Redeenm Successfully",
              true,
            )
          );
    }catch(error){
        res.status(500).json(ApiResponse({}, error.message, false));
    }
}

exports.getAllCoupenCode = async (req,res) => {
    try{
        const allCoupen = await CoupenCode.find({});

        res.status(200).json(
            ApiResponse(
              { allCoupen },
              true,
              "All Coupen Code"
            )
          );
    }catch(error){
        res.status(500).json(ApiResponse({}, error.message, false));
    }
}

exports.deleteCoupenCode = async (req,res) => {
    const {id} = req.params;
    try{
        const deleteCoupen = await CoupenCode.findByIdAndDelete(id);

        res.status(200).json(
            ApiResponse(
              { deleteCoupen },
              true,
              "Coupen Code Deleted Successfully"
            )
          );
    }catch(error){
        res.status(500).json(ApiResponse({}, error.message, false));
    }
}