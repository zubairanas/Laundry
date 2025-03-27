const Category = require("../../Models/Category");
const subcategory = require("../../Models/subCategory");
const Product = require("../../Models/Product");
const { ApiResponse } = require("../../Helpers");
const mongoose = require('mongoose')

exports.createCategory = async (req,res) => {
    const {title,description,tags,price,priceTypes,priceDescription,Includes } = req.body
   
    try{

        if(!req.file){
            return  res.status(404).json(ApiResponse({}, "Image is required", false));
          }
        
        const alreadyCat = await Category.find({title })

        if(alreadyCat.length > 0){
            return  res.status(400).json(ApiResponse({}, "Category already exists", false));
        }
        console.log("req?.file",req?.file , "req.body",req.body);
        const data = {
            title,
            description,
            tags : tags ? JSON.parse(tags)?.map(data => data) : [] ,
            price : JSON.parse(price),
            priceTypes,
            catImage : req?.file?.path?.replace(/\\/g, "/"),
            priceDescription,
            Includes
        }

        
        const newCategory = await Category.create(data);

        res.status(200).json(
            ApiResponse(
              { newCategory },
              true,
              "Category Created Successfully"
            )
          );

    }catch(error){
        res.status(500).json(ApiResponse({}, error.message, false));
    }
}


exports.getallCategory = async (req,res) => {
try{

    const allcategory = await Category.find({ status : "Active"}).sort({ createdAt : 1})

    res.status(200).json(
        ApiResponse(
          { allcategory },
          true,
          "Category Fetched Successfully",
          allcategory.length
        )
      );
}catch(error){
    res.status(500).json(ApiResponse({}, error.message, false));
}
}


exports.getSelectedCategory = async (req,res) => {
  const { id } = req.params
try{
  const categoryDetails = await Category.findOne({ _id : id })
  res.status(200).json(
    ApiResponse(
      { categoryDetails },
      true,
      "Category Details Fetched Successfully"
    )
  );
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.CategoryStatusChanged = async (req,res) => {
  const { id } = req.params;
  const { status } = req.body;
try{

 

  const data = [
    {
      '$lookup': {
        'from': 'subcategories', 
        'localField': 'subCatId', 
        'foreignField': '_id', 
        'as': 'subCatId'
      }
    }, {
      '$unwind': {
        'path': '$subCatId', 
        'preserveNullAndEmptyArrays': false
      }
    }, {
      '$match': {
        'subCatId.catId': new mongoose.Types.ObjectId(id)
      }
    }, {
      '$set': {
        'status': status
      }
    },{
      $project: {
        'subCatId': '$subCatId._id',
        'title': 1,
        'price': 1,
        'status': 1,
        'createdAt': 1,
        'updatedAt': 1,
        '__v': 1
      }
    },{
      '$merge': {
        'into': 'products', 
        'on': '_id', 
        'whenMatched': 'replace',
        'whenNotMatched': 'discard'
      }
    }
  ]
  await Promise.all([
    await Category.updateOne({_id : id},{ $set : { status } },{new : true}),
    await subcategory.updateMany({ catId : id } , { $set : {status} } , { new : true} ),
    await Product.aggregate(data)
  ])

  res.status(200).json(
    ApiResponse(
      {  },
      "Category Status Changed Successfully",
      true,
    )
  );
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.FilterCategoryStatus = async (req,res) => {
  const { status } = req.query
try{
  const allcategory =  await Category.find({ status }).sort({ createdAt : -1})

  res.status(200).json(
    ApiResponse(
      { allcategory },
      true,
      "Category Fetched Successfully",
      allcategory.length
    )
  );
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.TextSearchFilter = async (req,res) => {
  const {
    text
  } = req.params
try{

  const regexPattern = new RegExp(text, 'i');

  const data  = [
    {
      '$addFields': {
        'result': {
          '$cond': {
            'if': {
              '$or': [
                { '$regexMatch': { 'input': '$title', 'regex': regexPattern } },
              ]
            },
            'then': true,
            'else': false
          }
        }
      }
    },
    {
      '$match': {
        'status' : "Active",
        'result': true
      }
    }
  ]

  const textFilter = await Category.aggregate(data)

  res.status(200).json(
    ApiResponse(
      {textFilter},
      "Category Search Successfully",
      true,
      textFilter.length
    )
  );
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.DateFilter = async (req,res) => {
  let { fromDate , toDate  } = req.query

  fromDate = fromDate.split('T')[0]
  toDate = toDate.split('T')[0]
try{

  const data =  [
    {
      '$match': {
        'status': 'Active'
      }
    },
    {
      $project: {
        createdAt: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt"
          }
        },
        catImage : 1,
        title : 1,
        description :1,
        tags :1,
        price : 1,
        priceDescription :1,
        priceTypes : 1,
        status : 1,
        Includes : 1,
     
      }
    },
    {
      '$match': {
        'createdAt': {
          '$gte': fromDate , 
          '$lte': new Date(new Date(toDate).getTime() + 24 * 60 * 60 * 1000).toISOString()
        }
      }
    }, 
  ]

  const datefilter = await Category.aggregate(data)

  res.status(200).json(
    ApiResponse(
      {datefilter},
      "Category Date Filter Successfully",
      true,
      datefilter.length
      
    )
  );
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.editCategory = async (req,res) => {
  const { id  } = req.params
  let {title,description,tags,price,priceTypes,priceDescription,Includes } = req.body

  
  // console.log("req?.file",req?.file , "req.body",req.body);

  let {  catImage ,price : Prices , tags : Tags, ...rest} = await Category.findOne({ _id : id})

  const parsedTags = tags ? JSON.parse(tags)?.map(data => data) : Tags;
  const parsedPrice = price ? JSON.parse(price) : Prices ;


    
try{
  const data = {
    title,
    description,
    tags : parsedTags ,
    price : parsedPrice,
    priceTypes,
    catImage : req?.file ? req?.file?.path?.replace(/\\/g, "/") : catImage,
    priceDescription,
    Includes
}




const updatedPro = await Category.updateOne({_id : id},{ $set : data },{new : true})

const {  acknowledged , modifiedCount} = updatedPro

if(acknowledged === true && modifiedCount === 1){
  res.status(200).json(
    ApiResponse(
      {  },
      true,
      "Category Updated Successfully"
    )
  );
}

}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.editNumberOfDaysCategory = async (req,res) => {
  const { id  } = req.params
  let {NoOfDays } = req.body
try{
  const data = {
    NoOfDays : NoOfDays
}
  const updatedPro = await Category.updateOne({_id : id},{ $set : data },{new : true})

  const {  acknowledged , modifiedCount} = updatedPro
  
  if(acknowledged === true && modifiedCount === 1){
    res.status(200).json(
      ApiResponse(
        {  },
        true,
        "Category Updated Successfully"
      )
    );
  }
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}