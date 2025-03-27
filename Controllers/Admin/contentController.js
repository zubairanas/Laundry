const Content = require("../../Models/Content");
const { ApiResponse } = require("../../Helpers");


exports.updateContentData = async( req,res) => {
    const {id} = req.params
    const {name , description }  = req.body
try{
    const updateData = {};

    if(name) updateData.name = name
    if(description) updateData.description = description
    if(req.file)  updateData.contentImage = req.file.path.replace(/\\/g, "/");
       
    await Content.updateOne(
        {_id : id},
        { $set : updateData },
        { new : true}
    )

    res.status(200).json(
        ApiResponse(
          {},
          true,
          "Content Updated Successfully"
        )
      );
}catch(error){
    res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.getOneContentData =  async (req,res) => {
    const { id } = req.params
try{
 const oneContent = await Content.findById(id);

 res.status(200).json(
    ApiResponse(
      {oneContent},
      true,
      "Content Fetched Successfully"
    )
  );
}catch(error){
    res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.getAllContent = async (req,res) => {
    try{
       const allContents = await Content.find();
       res.status(200).json(
        ApiResponse(
          {allContents},
          true,
          "Fetch all Content Successfully",
          allContents.length
        )
      );
    }catch(error){
        res.status(500).json(ApiResponse({}, error.message, false));
    }
}