const ReferalCode = require("../../Models/referalCode")
const { ApiResponse } = require("../../Helpers");

exports.createReferalCode = async (req,res) => {
    const {title,expireDate,discount,limitReferalTimes} = req.body;
    try{

       let checkedReferal = await ReferalCode.find({title})
      
        if(new Date() > new Date(expireDate) || new Date() == new Date(expireDate)){
            return res.status(400).json(ApiResponse({}, "Referal not created", false));
        }

        if(checkedReferal.length > 0){
            return res.status(400).json(ApiResponse({}, "Referal Already Exist", false));
        }

        const data = {
            title,
            code : "Laundry_"+Math.floor(Math.random() * 1000000),
            expireDate,
            discount,
            limitReferalTimes,
            fromSenderdiscount : discount * 0.30,
            toRecieverdiscount : discount * 0.20
        }

        const newReferal = await ReferalCode.create(data);
        res.status(200).json(ApiResponse(newReferal, "Referal Created", true));
    }catch(error){
        res.status(500).json(ApiResponse({}, error.message, false));
    }
}

exports.getAllReferalCode = async (req,res) => {
    const {_id} = req.user;
    try{
        const allReferal = await ReferalCode.find({user : _id});
        res.status(200).json(ApiResponse(allReferal, "All Referal Code", true));
    }catch(error){
        res.status(500).json(ApiResponse({}, error.message, false));
    }
}

exports.getReferalDetails = async (req,res) => {
    const {code} = req.params;
    const {user} = req.body;

    
    
    try{
        const updateDetails = await ReferalCode.updateOne(
            {code},
            { $push: { referalCodeUses: { user: user } } },
            {new : true});
        const referalDetails = await ReferalCode.findOne({code});
        await Promise.all([
            updateDetails,
            referalDetails
        ])
        res.status(200).json(ApiResponse(referalDetails, "Referal Details", true))
    }catch(error){
        res.status(500).json(ApiResponse({}, error.message, false));
    }
}

exports.deleteReferalCode = async (req,res) => {
    const {id} = req.params;
    try{
        const deleteReferal = await ReferalCode.findByIdAndDelete(id);
        res.status(200).json(ApiResponse(deleteReferal, "Referal Deleted", true));
    }catch(error){
        res.status(500).json(ApiResponse({}, error.message, false));
    }
}