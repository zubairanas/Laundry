const subCategory = require("../../Models/subCategory");
const Product = require("../../Models/Product");
const { ApiResponse } = require("../../Helpers");
const mongoose = require('mongoose')
exports.createSubCategory = async (req,res) => {
    const {title,catId } = req.body
    try{
        const alreadyCat = await subCategory.find( {$and :[{title  } , { catId}]} )
        
        if(alreadyCat.length > 0){
            return  res.status(400).json(ApiResponse({}, "sub Category already exists", false));
        }
        const data = {
            title,
            catId
        }

        const newCategory = await subCategory.create(data);
        res.status(200).json(
            ApiResponse(
              { newCategory },
              true,
              "sub Category Created Successfully"
            )
          );

    }catch(error){
        res.status(500).json(ApiResponse({}, error.message, false));
    }
}

exports.getSubcategorybyCategory = async (req,res) => {
    const { catid } = req.params
try{

    const data = [
        {
          '$match': {
            'catId': new mongoose.Types.ObjectId(catid),
            'status' : 'Active'
          }
        }, {
          '$lookup': {
            'from': 'categories', 
            'localField': 'catId', 
            'foreignField': '_id', 
            'as': 'catId'
          }
        }, {
          '$unwind': {
            'path': '$catId', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$project': {
            'catId': 1, 
            'title': 1, 
            'createdAt': 1
          }
        }, {
          '$unset': [
            'catId.description', 'catId.tags', 'catId.price', 'catId.priceDescription', 'catId.priceTypes', 'catId.status', 'catId.Includes', 'catId.createdAt', 'catId.updatedAt', 'catId.__v'
          ]
        }, {
          '$sort': {
            'createdAt': 1
          }
        }
      ]
    const selectedSubCategory = await subCategory.aggregate(data)

    res.status(200).json(
        ApiResponse(
          { selectedSubCategory },
          true,
          "sub Category Fetched Successfully",
          selectedSubCategory.length
        )
      );
}catch(error){
    res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.getallSubCategory = async (req,res) => {
try{

  const data = [
    {
      '$match': {
        'status': 'Active'
      }
    }, {
      '$lookup': {
        'from': 'categories', 
        'localField': 'catId', 
        'foreignField': '_id', 
        'as': 'catId'
      }
    }, {
      '$unwind': {
        'path': '$catId', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$project': {
        'catId': 1, 
        'title': 1, 
        'createdAt': 1,
        'status' : 1
      }
    }, {
      '$unset': [
        'catId.description', 'catId.tags', 'catId.price', 'catId.priceDescription', 'catId.priceTypes', 'catId.status', 'catId.Includes', 'catId.createdAt', 'catId.updatedAt', 'catId.__v'
      ]
    }, {
      '$sort': {
        'createdAt': 1
      }
    }
  ]
  
  const allSubCat = await subCategory.aggregate(data)
  res.status(200).json(
    ApiResponse(
      { allSubCat },
      true,
      "sub Category Fetched Successfully",
      allSubCat.length
    )
  );
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.FiltersubCategoryStatus = async (req,res) => {
  const { status } = req.query
try{
  const allcategory =  await subCategory.find({ status }).sort({ createdAt : -1})

  res.status(200).json(
    ApiResponse(
      { allcategory },
      true,
      "sub Category Fetched Successfully",
      allcategory.length
    )
  );
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.subCategorystatusChanged = async (req,res) => {
  const { id } = req.params;
  const { status } = req.body;
try{

  const data = [
    {
      '$match': {
        'subCatId': new mongoose.Types.ObjectId(id)
      }
    }, {
      '$set': {
        'status': status
      }
    },{
      $project: {
        'subCatId': 1,
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
    await subCategory.updateOne({_id : id},{ $set : { status } },{new : true}),
    await Product.aggregate(data)
  ])

  res.status(200).json(
    ApiResponse(
      { },
      true,
      "sub Category status changed Successfully"
    )
  );
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.TextSearchFilters = async (req,res) => {
  const {
    text
  } = req.params
try{

  const regexPattern = new RegExp(text, 'i');

  
  const data  = [
    {
      '$lookup': {
        'from': 'categories', 
        'localField': 'catId', 
        'foreignField': '_id', 
        'as': 'catId'
      }
    }, {
      '$unwind': {
        'path': '$catId', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unset': [
        'catId.description', 'catId.tags', 'catId.price', 'catId.priceDescription', 'catId.priceTypes', 'catId.status', 'catId.Includes', 'catId.createdAt', 'catId.updatedAt', 'catId.__v'
      ]
    },
    {
      '$addFields': {
        'result': {
          '$cond': {
            'if': {
              '$or': [
                { '$regexMatch': { 'input': '$title', 'regex': regexPattern } },
                { '$regexMatch': { 'input': '$catId.title', 'regex': regexPattern } },
                
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
        'result': true
      }
    }
  ]

  const textFilter = await subCategory.aggregate(data)

  res.status(200).json(
    ApiResponse(
      {textFilter},
      "subCategory Search Successfully",
      true,
      textFilter.length
    )
  );
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.DateFilters = async (req,res) => {
  let { fromDate , toDate , id } = req.query

  fromDate = fromDate?.split('T')[0]
  toDate = toDate?.split('T')[0]
try{

  const data =  [
    {
      '$match': {
        'status': 'Active'
      }
    },
    {
      '$lookup': {
        'from': 'categories', 
        'localField': 'catId', 
        'foreignField': '_id', 
        'as': 'catId'
      }
    }, {
      '$unwind': {
        'path': '$catId', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unset': [
        'catId.description', 'catId.tags', 'catId.price', 'catId.priceDescription', 
        'catId.priceTypes', 'catId.status', 'catId.Includes', 'catId.createdAt', 
        'catId.updatedAt', 'catId.__v'
      ]
    },
    {
      $project: {
        createdAt: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt"
          }
        },
        catId : 1,
        title : 1,
        updatedAt :1, 
      }
    },
  ];

  if (fromDate && toDate && id) {
    data.push({
      $match: {
        $and: [
          { createdAt: { $gte: fromDate, $lte: toDate } },
          { "catId._id": new mongoose.Types.ObjectId(id) }
        ]
      }
    });
  } else if (fromDate && toDate) {
    data.push({
      $match: {
        createdAt: { $gte: fromDate, $lte: toDate }
      }
    });
  } else if (id) {
    data.push({
      $match: {
        "catId._id": new mongoose.Types.ObjectId(id)
      }
    });
  }
 

  const datefilter = await subCategory.aggregate(data)

  res.status(200).json(
    ApiResponse(
      {datefilter},
      "subCategory Date Filter Successfully",
      true,
      datefilter.length
      
    )
  );
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.getSubCategoryById = async (req,res) => {
  const { id } = req.params
 
try{

  const data =  [
    {
      '$match': {
        '_id' : new mongoose.Types.ObjectId(id)
      }
    }, 
    {
      '$lookup': {
        'from': 'categories', 
        'localField': 'catId', 
        'foreignField': '_id', 
        'as': 'catId'
      }
    }, {
      '$unwind': {
        'path': '$catId', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unset': [
        'catId.description', 'catId.tags', 'catId.price', 'catId.priceDescription', 
        'catId.priceTypes', 'catId.status', 'catId.Includes', 'catId.createdAt', 
        'catId.updatedAt', 'catId.__v'
      ]
    },
    {
      $project: {
        createdAt: 1,
        catId : 1,
        title : 1,
        updatedAt :1, 
      }
    },
    
  ]

  const datefilter = await subCategory.aggregate(data)
  res.status(200).json(
    ApiResponse(
      {datefilter},
      "subCategory Data Successfully",
      true,
      datefilter.length
      
    )
  );
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.editSubCategory = async (req,res) => {
  const { id } = req.params
  const { catId , title } = req.body
try{

  const dataObject = {
    catId : catId,
    title : title
  }

  const updatedPro = await subCategory.updateOne({_id : id },{ $set: dataObject },{new : true})

  const {  acknowledged , modifiedCount} = updatedPro

  if(acknowledged === true && modifiedCount === 1){

        res.status(200).json(
          ApiResponse(
            {},
            "subCategory updated Successfully",
            true
            
          )
        );

}
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}