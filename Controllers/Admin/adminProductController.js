const Product = require("../../Models/Product");
const { ApiResponse } = require("../../Helpers");
const mongoose = require('mongoose')

exports.createProduct = async (req,res) => {
    const {subCatId,title,price,description,weight } = req.body
    try{
        // const alreadyPro = await Product.find({title })
        
        // if(alreadyPro.length > 0){
        //     return  res.status(400).json(ApiResponse({}, "Product already exists", false));
        // }
        const data = {
            subCatId,title,price,description,weight
        }

        const newProduct = await Product.create(data);
        res.status(200).json(
            ApiResponse(
              { newProduct },
              "Product Created Successfully",
              true
            )
          );

    }catch(error){
        res.status(500).json(ApiResponse({}, error.message, false));
    }
}


exports.getProductsBysubCategoryId = async (req,res) => {
    const { catId } = req.params
   
try{



  const data = [
    {
      '$match': {
        'status': 'Active'
      }
    }, {
      '$lookup': {
        'from': 'subcategories', 
        'localField': 'subCatId', 
        'foreignField': '_id', 
        'as': 'subCatId'
      }
    }, {
      '$unwind': {
        'path': '$subCatId', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'categories', 
        'localField': 'subCatId.catId', 
        'foreignField': '_id', 
        'as': 'category'
      }
    }, {
      '$unwind': {
        'path': '$category', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$project': {
        'subCatName': '$subCatId.title', 
        'title': 1, 
        'description': 1, 
        'price': 1, 
        'weight': 1, 
        'status': 1, 
        'catId': '$subCatId.catId', 
        'subCatId': '$subCatId._id', 
        'category': 1, 
        'createdAt': 1
      }
    }, {
      '$unset': [
        'category.description', 'category.tags', 'category.price', 'category.priceDescription', 'category.priceTypes', 'category.status', 'category.Includes', 'category.createdAt', 'category.updatedAt', 'category.__v'
      ]
    }, {
      '$match': {
        'catId': new mongoose.Types.ObjectId(catId),
      }
    }
  ]

     const selectedProducts = await Product.aggregate(data)

      res.status(200).json(
        ApiResponse(
          { selectedProducts },
          true,
          "Product Fetched Successfully",
          selectedProducts.length
        )
      );
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}


exports.getAllProducts = async (req,res) => {
try{



const data = [
  {
    '$match': {
      'status': 'Active'
    }
  }, {
    '$lookup': {
      'from': 'subcategories', 
      'localField': 'subCatId', 
      'foreignField': '_id', 
      'as': 'subCatId'
    }
  }, {
    '$unwind': {
      'path': '$subCatId', 
      'preserveNullAndEmptyArrays': true
    }
  }, {
    '$lookup': {
      'from': 'categories', 
      'localField': 'subCatId.catId', 
      'foreignField': '_id', 
      'as': 'category'
    }
  }, {
    '$unwind': {
      'path': '$category', 
      'preserveNullAndEmptyArrays': true
    }
  }, {
    '$project': {
      'subCatName': '$subCatId.title', 
      'title': 1, 
      'description': 1, 
      'price': 1, 
      'weight': 1, 
      'status': 1, 
      'catId': '$subCatId.catId', 
      'subCatId': '$subCatId._id', 
      'category': 1, 
      'createdAt': 1
    }
  }, {
    '$unset': [
      'category.description', 'category.tags', 'category.price', 'category.priceDescription', 'category.priceTypes', 'category.status', 'category.Includes', 'category.createdAt', 'category.updatedAt', 'category.__v'
    ]
  }
]

   const selectedProducts = await Product.aggregate(data)

    res.status(200).json(
      ApiResponse(
        { selectedProducts },
        true,
        "All Product Fetched Successfully",
        selectedProducts.length
      )
    );
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.ProductStatusChanged = async (req,res) => {
  const { id } = req.params
  const { status } = req.body
try{

  const updatedPro = await Product.updateOne({_id : id},{ $set : { status : status} },{new : true})


  const {  acknowledged , modifiedCount} = updatedPro
  if(acknowledged === true && modifiedCount === 1){
    res.status(200).json(
      ApiResponse(
        {},
        "Product Status Changed Successfully",
        true,
      )
    );

  }
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.ProductSearchFilters = async (req,res) => {
  const {
    text
  } = req.params
try{
  const regexPattern = new RegExp(text, 'i');
  const data = [
    {
      '$match': {
        'status': 'Active'
      }
    }, {
      '$lookup': {
        'from': 'subcategories', 
        'localField': 'subCatId', 
        'foreignField': '_id', 
        'as': 'subCatId'
      }
    }, {
      '$unwind': {
        'path': '$subCatId', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'categories', 
        'localField': 'subCatId.catId', 
        'foreignField': '_id', 
        'as': 'category'
      }
    }, {
      '$unwind': {
        'path': '$category', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$project': {
        'subCatName': '$subCatId.title', 
        'title': 1, 
        'description': 1, 
        'price': 1, 
        'weight': 1, 
        'status': 1, 
        'catId': '$subCatId.catId', 
        'subCatId': '$subCatId._id', 
        'category': 1, 
        'createdAt': 1
      }
    }, {
      '$unset': [
        'category.description', 'category.tags', 'category.price', 'category.priceDescription', 'category.priceTypes', 'category.status', 'category.Includes', 'category.createdAt', 'category.updatedAt', 'category.__v'
      ]
    },  
    {
      '$addFields': {
        'result': {
          '$cond': {
            'if': {
              '$or': [
                { '$regexMatch': { 'input': '$title', 'regex': regexPattern } },
                { '$regexMatch': { 'input': '$description', 'regex': regexPattern } },
                { '$regexMatch': { 'input': '$weight', 'regex': regexPattern } },
                { '$regexMatch': { 'input': '$category.title', 'regex': regexPattern } },
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

  const selectedProducts = await Product.aggregate(data)

  res.status(200).json(
    ApiResponse(
      { selectedProducts },
      true,
      "Product Fetched Successfully",
      selectedProducts.length
    )
  );
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.DateFiltersforProduct = async (req,res) => {
  let { fromDate , toDate , id  } = req.query

  fromDate = fromDate?.split('T')[0]
  toDate = toDate?.split('T')[0]
try{
  let pipeline = [
    {
      '$match': {
        'status': 'Active'
      }
    },
    {
      '$lookup': {
        'from': 'subcategories',
        'localField': 'subCatId',
        'foreignField': '_id',
        'as': 'subCatId'
      }
    },
    {
      '$unwind': {
        'path': '$subCatId',
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      '$lookup': {
        'from': 'categories',
        'localField': 'subCatId.catId',
        'foreignField': '_id',
        'as': 'category'
      }
    },
    {
      '$unwind': {
        'path': '$category',
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      '$project': {
        'subCatName': '$subCatId.title',
        'title': 1,
        'description': 1,
        'price': 1,
        'weight': 1,
        'status': 1,
        'catId': '$subCatId.catId',
        'subCatId': '$subCatId._id',
        'category': 1,
        'createdAt': {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt"
          }
        }
      }
    },
    {
      '$unset': [
        'category.description', 'category.tags', 'category.price',
        'category.priceDescription', 'category.priceTypes',
        'category.status', 'category.Includes',
        'category.createdAt', 'category.updatedAt', 'category.__v'
      ]
    }
  ];

  if (fromDate && toDate && id) {
    pipeline.push({
      $match: {
        $and: [
          { createdAt: { $gte: fromDate, $lte: toDate } },
          { "category._id": new mongoose.Types.ObjectId(id) }
        ]
      }
    });
  } else if (fromDate && toDate) {
    pipeline.push({
      $match: {
        createdAt: { $gte: fromDate, $lte: toDate }
      }
    });
  } else if (id) {
    pipeline.push({
      $match: {
        "category._id": new mongoose.Types.ObjectId(id)
      }
    });
  }


  



  const datefilter = await Product.aggregate(pipeline)

  res.status(200).json(
    ApiResponse(
      {datefilter},
      "Product Date Filter Successfully",
      true,
      datefilter.length
      
    )
  );
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.getProductById = async (req,res) => {
  const { id } = req.params
try{

  const data = [
    {
      '$match': {
        '_id':  new mongoose.Types.ObjectId(id)
      }
    }, {
      '$lookup': {
        'from': 'subcategories', 
        'localField': 'subCatId', 
        'foreignField': '_id', 
        'as': 'subCatId'
      }
    }, {
      '$unwind': {
        'path': '$subCatId', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'categories', 
        'localField': 'subCatId.catId', 
        'foreignField': '_id', 
        'as': 'category'
      }
    }, {
      '$unwind': {
        'path': '$category', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$project': {
        'subCatName': '$subCatId.title', 
        'title': 1, 
        'description': 1, 
        'price': 1, 
        'weight': 1, 
        'status': 1, 
        'catId': '$subCatId.catId', 
        'subCatId': '$subCatId._id', 
        'category': 1, 
        'createdAt': 1
      }
    }, {
      '$unset': [
        'category.description', 'category.tags', 'category.price', 'category.priceDescription', 'category.priceTypes', 'category.status', 'category.Includes', 'category.createdAt', 'category.updatedAt', 'category.__v'
      ]
    },
  ]
  const datefilter = await Product.aggregate(data)

  res.status(200).json(
    ApiResponse(
      {datefilter},
      "Product Details Fetched Successfully",
      true,
      datefilter.length
      
    )
  );
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.editProduct = async (req,res) => {
  const { id } = req.params
  const { subCatId , title , description , price , weight } = req.body
try{

  const dataObject = {
    subCatId : subCatId,
    title : title,
    description : description,
    price : price ,
    weight : weight
  }

  const updatedPro = await Product.updateOne({_id : id },{ $set: dataObject },{new : true})

  const {  acknowledged , modifiedCount} = updatedPro

  if(acknowledged === true && modifiedCount === 1){

        res.status(200).json(
          ApiResponse(
            {},
            "Product updated Successfully",
            true
            
          )
        );

}
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}