const Query = require("../../Models/Query");
const { ApiResponse} = require("../../Helpers");
const mongoose = require('mongoose')


exports.createUserQuery = async (req,res) => {
    const {firstName ,lastName,email,subject,message } = req.body
try{

    const data = { 
        firstName ,
        lastName,
        email,
        subject,
        message ,
        date : new Date((Date.now())).toISOString().split('T')[0],
        status : "Pending"
     }
    const createQuery = await Query.create(data)
    res
  .status(201)
  .json(
    ApiResponse(
        {createQuery}, 
        "Query Created Successfully", 
        true
    ));
}catch(error){
    return res.status(500).json(ApiResponse({}, error.message, false));
}
}


