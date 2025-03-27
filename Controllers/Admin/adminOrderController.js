const Order = require('../../Models/Order');
const { ApiResponse} = require("../../Helpers");
const mongoose = require('mongoose')

exports.AllOrders = async (req,res) => {
try{
  const data =    [
    {
      '$unwind': '$services'
    }, {
      '$lookup': {
        'from': 'categories', 
        'localField': 'services.categoryId', 
        'foreignField': '_id', 
        'as': 'services.categoryId'
      }
    }, {
      '$unwind': {
        'path': '$services.categoryId', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unwind': '$services.products'
    }, {
      '$lookup': {
        'from': 'products', 
        'localField': 'services.products.productId', 
        'foreignField': '_id', 
        'as': 'services.products.productId'
      }
    }, {
      '$unwind': {
        'path': '$services.products.productId', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$group': {
        '_id': {
          'orderId': '$_id', 
          'categoryId': '$services.categoryId'
        }, 
        'products': {
          '$push': {
            'productId': '$services.products.productId', 
            'quantity': '$services.products.quantity'
          }
        }, 
        'userid': {
          '$first': '$userid'
        }, 
        'collectionTime': {
          '$first': '$collectionTime'
        }, 
        'DeliveryTime': {
          '$first': '$DeliveryTime'
        }, 
        'description': {
          '$first': '$description'
        }, 
        'paymentId': {
          '$first': '$paymentId'
        }, 
        'grossTotal': {
          '$first': '$grossTotal'
        }, 
        'serviceFee': {
          '$first': '$serviceFee'
        }, 
        'deliveryFee': {
          '$first': '$deliveryFee'
        }, 
        'driverTip': {
          '$first': '$driverTip'
        }, 
        'Total': {
          '$first': '$Total'
        }, 
        'createdAt': {
          '$first': '$createdAt'
        }, 
        'updatedAt': {
          '$first': '$updatedAt'
        }, 
        '__v': {
          '$first': '$__v'
        },
        status: {
         $first: "$status"
       }
      }
    }, {
      '$group': {
        '_id': '$_id.orderId', 
        'services': {
          '$push': {
            'categoryId': '$_id.categoryId', 
            'categoryDetails': '$categoryDetails', 
            'products': '$products'
          }
        }, 
        'userid': {
          '$first': '$userid'
        }, 
        'collectionTime': {
          '$first': '$collectionTime'
        }, 
        'DeliveryTime': {
          '$first': '$DeliveryTime'
        }, 
        'description': {
          '$first': '$description'
        }, 
        'paymentId': {
          '$first': '$paymentId'
        }, 
        'grossTotal': {
          '$first': '$grossTotal'
        }, 
        'serviceFee': {
          '$first': '$serviceFee'
        }, 
        'deliveryFee': {
          '$first': '$deliveryFee'
        }, 
        'driverTip': {
          '$first': '$driverTip'
        }, 
        'Total': {
          '$first': '$Total'
        }, 
        'createdAt': {
          '$first': '$createdAt'
        }, 
        'updatedAt': {
          '$first': '$updatedAt'
        }, 
        '__v': {
          '$first': '$__v'
        },
        status: {
         $first: "$status"
       }
      }
    }, {
      '$lookup': {
        'from': 'users', 
        'localField': 'userid', 
        'foreignField': '_id', 
        'as': 'userid'
      }
    }, {
      '$unwind': {
        'path': '$userid', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$project': {
        'services': 1, 
        'collectionTime': 1, 
        'DeliveryTime': 1, 
        'description': 1, 
        'paymentId': 1, 
        'grossTotal': 1, 
        'serviceFee': 1, 
        'deliveryFee': 1, 
        'driverTip': 1, 
        'Total': 1, 
        'createdAt': 1, 
        'updatedAt': 1, 
        'status' : 1,
        'userid': {
          '_id': '$userid._id', 
          'firstName': '$userid.firstName', 
          'lastName': '$userid.lastName', 
          'phoneNumber': '$userid.phoneNumber'
        }
      }
    }
  ]
    const allOrder = await Order.aggregate(data)

    return res
            .status(200)
            .json(
                ApiResponse(
                    { allOrder },
                    true,
                    "Orders Fetched Successfully",
                    allOrder.length
                )
            );
}catch(error){
    return res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.OrderDetails = async (req,res) => {
  const { id } = req.params
try{

  const data =   [
      {
        '$match': {
          '_id':  new mongoose.Types.ObjectId(id)
        }
      }, {
        '$unwind': '$services'
      }, {
        '$lookup': {
          'from': 'categories', 
          'localField': 'services.categoryId', 
          'foreignField': '_id', 
          'as': 'services.categoryId'
        }
      }, {
        '$unwind': {
          'path': '$services.categoryId', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$unwind': '$services.products'
      }, {
        '$lookup': {
          'from': 'products', 
          'localField': 'services.products.productId', 
          'foreignField': '_id', 
          'as': 'services.products.productId'
        }
      }, {
        '$unwind': {
          'path': '$services.products.productId', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$lookup': {
          'from': 'users', 
          'localField': 'userid', 
          'foreignField': '_id', 
          'as': 'userid'
        }
      }, {
        '$unwind': {
          'path': '$userid', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$lookup': {
          'from': 'addresses', 
          'localField': 'userid.address', 
          'foreignField': '_id', 
          'as': 'userid.address'
        }
      }, {
        '$unwind': {
          'path': '$userid.address', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$group': {
          '_id': {
            'orderId': '$_id', 
            'categoryId': '$services.categoryId'
          }, 
          'products': {
            '$push': {
              'productId': '$services.products.productId', 
              'quantity': '$services.products.quantity'
            }
          }, 
          'userid': {
            '$first': '$userid'
          }, 
          'collectionTime': {
            '$first': '$collectionTime'
          }, 
          'DeliveryTime': {
            '$first': '$DeliveryTime'
          }, 
          'description': {
            '$first': '$description'
          }, 
          'paymentId': {
            '$first': '$paymentId'
          }, 
          'grossTotal': {
            '$first': '$grossTotal'
          }, 
          'serviceFee': {
            '$first': '$serviceFee'
          }, 
          'deliveryFee': {
            '$first': '$deliveryFee'
          }, 
          'driverTip': {
            '$first': '$driverTip'
          }, 
          'Total': {
            '$first': '$Total'
          }, 
          'status': {
            '$first': '$status'
          }, 
          'orderNumber': {
            '$first': '$orderNumber'
          }, 
          'createdAt': {
            '$first': '$createdAt'
          }, 
          'updatedAt': {
            '$first': '$updatedAt'
          }, 
          '__v': {
            '$first': '$__v'
          }
        }
      }, {
        '$group': {
          '_id': '$_id.orderId', 
          'services': {
            '$push': {
              'categoryId': '$_id.categoryId', 
              'categoryDetails': '$categoryDetails', 
              'products': '$products'
            }
          }, 
          'userid': {
            '$first': '$userid'
          }, 
          'collectionTime': {
            '$first': '$collectionTime'
          }, 
          'DeliveryTime': {
            '$first': '$DeliveryTime'
          }, 
          'description': {
            '$first': '$description'
          }, 
          'paymentId': {
            '$first': '$paymentId'
          }, 
          'grossTotal': {
            '$first': '$grossTotal'
          }, 
          'serviceFee': {
            '$first': '$serviceFee'
          }, 
          'deliveryFee': {
            '$first': '$deliveryFee'
          }, 
          'driverTip': {
            '$first': '$driverTip'
          }, 
          'Total': {
            '$first': '$Total'
          }, 
          'status': {
            '$first': '$status'
          }, 
          'orderNumber': {
            '$first': '$orderNumber'
          }, 
          'createdAt': {
            '$first': '$createdAt'
          }, 
          'updatedAt': {
            '$first': '$updatedAt'
          }, 
          '__v': {
            '$first': '$__v'
          }
        }
      }, {
        '$unset': [
          'userid.role', 'userid.hashed_password', 'userid.salt', 'userid.status', 'userid.tokens', 'userid.createdAt', 'userid.updatedAt', 'userid.__v', 'userid.address.createdAt', 'userid.address.updatedAt', 'userid.address.userid', 'userid.address.__v'
        ]
      }
    ]

    const orders = await Order.aggregate(data)
  res
  .status(200)
  .json(
    ApiResponse(
        {orders}, 
        "Order Fetched Successfully", 
        true,
        orders.length
    ));
}catch(error){
  return res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.OrderStatusChanged = async (req,res) => {
    const {id } = req.params
try{

    await Order.updateOne(
        {_id : id},
        { $set : { status : "completed" }},
        {new : true}
    )
    return res
    .status(200)
    .json(
        ApiResponse(
            {  },
            "Orders status Changed Successfully",
            true
        )
    );
}catch(error){
    return res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.SearchOrders = async (req,res) => {
  const { text } = req.params
try{

  const regexPattern = new RegExp(text, 'i');

  const data =    [
    {
      '$unwind': '$services'
    }, {
      '$lookup': {
        'from': 'categories', 
        'localField': 'services.categoryId', 
        'foreignField': '_id', 
        'as': 'services.categoryId'
      }
    }, {
      '$unwind': {
        'path': '$services.categoryId', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unwind': '$services.products'
    }, {
      '$lookup': {
        'from': 'products', 
        'localField': 'services.products.productId', 
        'foreignField': '_id', 
        'as': 'services.products.productId'
      }
    }, {
      '$unwind': {
        'path': '$services.products.productId', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$group': {
        '_id': {
          'orderId': '$_id', 
          'categoryId': '$services.categoryId'
        }, 
        'products': {
          '$push': {
            'productId': '$services.products.productId', 
            'quantity': '$services.products.quantity'
          }
        }, 
        'userid': {
          '$first': '$userid'
        }, 
        'collectionTime': {
          '$first': '$collectionTime'
        }, 
        'DeliveryTime': {
          '$first': '$DeliveryTime'
        }, 
        'description': {
          '$first': '$description'
        }, 
        'paymentId': {
          '$first': '$paymentId'
        }, 
        'grossTotal': {
          '$first': '$grossTotal'
        }, 
        'serviceFee': {
          '$first': '$serviceFee'
        }, 
        'deliveryFee': {
          '$first': '$deliveryFee'
        }, 
        'driverTip': {
          '$first': '$driverTip'
        }, 
        'Total': {
          '$first': '$Total'
        }, 
        'createdAt': {
          '$first': '$createdAt'
        }, 
        'updatedAt': {
          '$first': '$updatedAt'
        }, 
        '__v': {
          '$first': '$__v'
        },
        status: {
         $first: "$status"
       }
      }
    }, {
      '$group': {
        '_id': '$_id.orderId', 
        'services': {
          '$push': {
            'categoryId': '$_id.categoryId', 
            'categoryDetails': '$categoryDetails', 
            'products': '$products'
          }
        }, 
        'userid': {
          '$first': '$userid'
        }, 
        'collectionTime': {
          '$first': '$collectionTime'
        }, 
        'DeliveryTime': {
          '$first': '$DeliveryTime'
        }, 
        'description': {
          '$first': '$description'
        }, 
        'paymentId': {
          '$first': '$paymentId'
        }, 
        'grossTotal': {
          '$first': '$grossTotal'
        }, 
        'serviceFee': {
          '$first': '$serviceFee'
        }, 
        'deliveryFee': {
          '$first': '$deliveryFee'
        }, 
        'driverTip': {
          '$first': '$driverTip'
        }, 
        'Total': {
          '$first': '$Total'
        }, 
        'createdAt': {
          '$first': '$createdAt'
        }, 
        'updatedAt': {
          '$first': '$updatedAt'
        }, 
        '__v': {
          '$first': '$__v'
        },
        status: {
         $first: "$status"
       }
      }
    }, {
      '$lookup': {
        'from': 'users', 
        'localField': 'userid', 
        'foreignField': '_id', 
        'as': 'userid'
      }
    }, {
      '$unwind': {
        'path': '$userid', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$project': {
        'services': 1, 
        'collectionTime': 1, 
        'DeliveryTime': 1, 
        'description': 1, 
        'paymentId': 1, 
        'grossTotal': 1, 
        'serviceFee': 1, 
        'deliveryFee': 1, 
        'driverTip': 1, 
        'Total': 1, 
        'createdAt': 1, 
        'updatedAt': 1, 
        'status' : 1,
        'userid': {
          '_id': '$userid._id', 
          'firstName': '$userid.firstName', 
          'lastName': '$userid.lastName', 
          'phoneNumber': '$userid.phoneNumber'
        }
      }
    },{
      '$addFields': {
        'result': {
          '$cond': {
            'if': {
              '$or': [
                { '$regexMatch': { 'input': '$userid.firstName', 'regex': regexPattern } },
                { '$regexMatch': { 'input': '$userid.lastName', 'regex': regexPattern } },
                {
                  '$anyElementTrue': {
                    '$map': {
                      input: '$collectionTime',
                      'as': 'name',
                      'in': {
                        $regexMatch: {
                          'input': '$$name.instructions',
                          'regex': regexPattern
                        }
                      }
                    }
                  }
                },
                {
                  '$anyElementTrue': {
                    '$map': {
                      input: '$DeliveryTime',
                      'as': 'name',
                      'in': {
                        $regexMatch: {
                          'input': '$$name.instructions',
                          'regex': regexPattern
                        }
                      }
                    }
                  }
                },
                
               
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
    },
  ]

  const orderSearched = await Order.aggregate(data)

  res
  .status(200)
  .json(
      ApiResponse(
          { orderSearched },
          "Orders Search Successfully",
          true,
          orderSearched.length
      )
  );
}catch(error){
  return res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.OrderDateFilter = async (req,res) => {
  let { fromDate , toDate  } = req.query

  fromDate = fromDate?.split('T')[0]
  toDate = toDate?.split('T')[0]
try{


  const data =    [
    {
      '$unwind': '$services'
    }, {
      '$lookup': {
        'from': 'categories', 
        'localField': 'services.categoryId', 
        'foreignField': '_id', 
        'as': 'services.categoryId'
      }
    }, {
      '$unwind': {
        'path': '$services.categoryId', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unwind': '$services.products'
    }, {
      '$lookup': {
        'from': 'products', 
        'localField': 'services.products.productId', 
        'foreignField': '_id', 
        'as': 'services.products.productId'
      }
    }, {
      '$unwind': {
        'path': '$services.products.productId', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$group': {
        '_id': {
          'orderId': '$_id', 
          'categoryId': '$services.categoryId'
        }, 
        'products': {
          '$push': {
            'productId': '$services.products.productId', 
            'quantity': '$services.products.quantity'
          }
        }, 
        'userid': {
          '$first': '$userid'
        }, 
        'collectionTime': {
          '$first': '$collectionTime'
        }, 
        'DeliveryTime': {
          '$first': '$DeliveryTime'
        }, 
        'description': {
          '$first': '$description'
        }, 
        'paymentId': {
          '$first': '$paymentId'
        }, 
        'grossTotal': {
          '$first': '$grossTotal'
        }, 
        'serviceFee': {
          '$first': '$serviceFee'
        }, 
        'deliveryFee': {
          '$first': '$deliveryFee'
        }, 
        'driverTip': {
          '$first': '$driverTip'
        }, 
        'Total': {
          '$first': '$Total'
        }, 
        'createdAt': {
          '$first': '$createdAt'
        }, 
        'updatedAt': {
          '$first': '$updatedAt'
        }, 
        '__v': {
          '$first': '$__v'
        },
        status: {
         $first: "$status"
       }
      }
    }, {
      '$group': {
        '_id': '$_id.orderId', 
        'services': {
          '$push': {
            'categoryId': '$_id.categoryId', 
            'categoryDetails': '$categoryDetails', 
            'products': '$products'
          }
        }, 
        'userid': {
          '$first': '$userid'
        }, 
        'collectionTime': {
          '$first': '$collectionTime'
        }, 
        'DeliveryTime': {
          '$first': '$DeliveryTime'
        }, 
        'description': {
          '$first': '$description'
        }, 
        'paymentId': {
          '$first': '$paymentId'
        }, 
        'grossTotal': {
          '$first': '$grossTotal'
        }, 
        'serviceFee': {
          '$first': '$serviceFee'
        }, 
        'deliveryFee': {
          '$first': '$deliveryFee'
        }, 
        'driverTip': {
          '$first': '$driverTip'
        }, 
        'Total': {
          '$first': '$Total'
        }, 
        'createdAt': {
          '$first': '$createdAt'
        }, 
        'updatedAt': {
          '$first': '$updatedAt'
        }, 
        '__v': {
          '$first': '$__v'
        },
        status: {
         $first: "$status"
       }
      }
    }, {
      '$lookup': {
        'from': 'users', 
        'localField': 'userid', 
        'foreignField': '_id', 
        'as': 'userid'
      }
    }, {
      '$unwind': {
        'path': '$userid', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$project': {
        'services': 1, 
        'collectionTime': 1, 
        'DeliveryTime': 1, 
        'description': 1, 
        'paymentId': 1, 
        'grossTotal': 1, 
        'serviceFee': 1, 
        'deliveryFee': 1, 
        'driverTip': 1, 
        'Total': 1, 
        'createdAt': {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt"
          }
        },
        'updatedAt': 1, 
        'status' : 1,
        'userid': {
          '_id': '$userid._id', 
          'firstName': '$userid.firstName', 
          'lastName': '$userid.lastName', 
          'phoneNumber': '$userid.phoneNumber'
        }
      }
    } ,
    {
      '$match': {
        'createdAt': {
          '$gte': fromDate , 
          // '$lte': new Date(new Date(toDate).getTime() + 24 * 60 * 60 * 1000).toISOString()
          '$lte': toDate
        }
      }
    }, 
  ]

  const datefilter = await Order.aggregate(data)

  res.status(200).json(
    ApiResponse(
      {datefilter},
      "Order Date Filter Successfully",
      true,
      datefilter.length
      
    )
  );
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}




exports.userOrderDetails = async (req,res) => {
  const { id } = req.params
try{

  const data = [
      {
        '$match': {
          'userid':  new mongoose.Types.ObjectId(id)
        }
      }, {
        '$unwind': '$services'
      }, {
        '$lookup': {
          'from': 'categories', 
          'localField': 'services.categoryId', 
          'foreignField': '_id', 
          'as': 'services.categoryId'
        }
      }, {
        '$unwind': {
          'path': '$services.categoryId', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$unwind': '$services.products'
      }, {
        '$lookup': {
          'from': 'products', 
          'localField': 'services.products.productId', 
          'foreignField': '_id', 
          'as': 'services.products.productId'
        }
      }, {
        '$unwind': {
          'path': '$services.products.productId', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$group': {
          '_id': {
            'orderId': '$_id', 
            'categoryId': '$services.categoryId'
          }, 
          'products': {
            '$push': {
              'productId': '$services.products.productId', 
              'quantity': '$services.products.quantity'
            }
          }, 
          'userid': {
            '$first': '$userid'
          }, 
          'collectionTime': {
            '$first': '$collectionTime'
          }, 
          'DeliveryTime': {
            '$first': '$DeliveryTime'
          }, 
          'description': {
            '$first': '$description'
          }, 
          'paymentId': {
            '$first': '$paymentId'
          }, 
          'grossTotal': {
            '$first': '$grossTotal'
          }, 
          'serviceFee': {
            '$first': '$serviceFee'
          }, 
          'deliveryFee': {
            '$first': '$deliveryFee'
          }, 
          'driverTip': {
            '$first': '$driverTip'
          }, 
          'Total': {
            '$first': '$Total'
          }, 
          'status': {
            '$first': '$status'
          }, 
          'orderNumber': {
            '$first': '$orderNumber'
          },
          'createdAt': {
            '$first': '$createdAt'
          }, 
          'updatedAt': {
            '$first': '$updatedAt'
          }, 
          '__v': {
            '$first': '$__v'
          }
        }
      }, {
        '$group': {
          '_id': '$_id.orderId', 
          'services': {
            '$push': {
              'categoryId': '$_id.categoryId', 
              'categoryDetails': '$categoryDetails', 
              'products': '$products'
            }
          }, 
          'userid': {
            '$first': '$userid'
          }, 
          'collectionTime': {
            '$first': '$collectionTime'
          }, 
          'DeliveryTime': {
            '$first': '$DeliveryTime'
          }, 
          'description': {
            '$first': '$description'
          }, 
          'paymentId': {
            '$first': '$paymentId'
          }, 
          'grossTotal': {
            '$first': '$grossTotal'
          }, 
          'serviceFee': {
            '$first': '$serviceFee'
          }, 
          'deliveryFee': {
            '$first': '$deliveryFee'
          }, 
          'driverTip': {
            '$first': '$driverTip'
          }, 
          'Total': {
            '$first': '$Total'
          }, 
          'status': {
            '$first': '$status'
          }, 
          'orderNumber': {
            '$first': '$orderNumber'
          },
          'createdAt': {
            '$first': '$createdAt'
          }, 
          'updatedAt': {
            '$first': '$updatedAt'
          }, 
          '__v': {
            '$first': '$__v'
          }
        }
      },{
        '$sort':{
          'createdAt' : -1
        }
      }
    ]

    const orders = await Order.aggregate(data)
  res
  .status(200)
  .json(
    ApiResponse(
        {orders}, 
        "Order Fetched Successfully", 
        true,
        orders.length
    ));
}catch(error){
  return res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.OrderDetailss = async (req,res) => {
const { id } = req.params
try{

  const data = [
    {
      '$match': {
        '_id':  new mongoose.Types.ObjectId(id)
      }
    }, {
      '$unwind': '$services'
    }, {
      '$lookup': {
        'from': 'categories', 
        'localField': 'services.categoryId', 
        'foreignField': '_id', 
        'as': 'services.categoryId'
      }
    }, {
      '$unwind': {
        'path': '$services.categoryId', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unwind': '$services.products'
    }, {
      '$lookup': {
        'from': 'products', 
        'localField': 'services.products.productId', 
        'foreignField': '_id', 
        'as': 'services.products.productId'
      }
    }, {
      '$unwind': {
        'path': '$services.products.productId', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'users', 
        'localField': 'userid', 
        'foreignField': '_id', 
        'as': 'userid'
      }
    }, {
      '$unwind': {
        'path': '$userid', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'addresses', 
        'localField': 'userid.address', 
        'foreignField': '_id', 
        'as': 'userid.address'
      }
    }, {
      '$addFields': {
        'result': {
          '$map': {
            'input': {
              '$filter': {
                'input': '$userid.address', 
                'as': 'lastaddress', 
                'cond': {
                  '$eq': [
                    '$_id', '$$lastaddress.orderid'
                  ]
                }
              }
            }, 
            'as': 'filteredAddress', 
            'in': '$$filteredAddress'
          }
        }
      }
    }, {
      '$unwind': {
        'path': '$result', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$project': {
        'services': 1, 
        'collectionTime': 1, 
        'DeliveryTime': 1, 
        'description': 1, 
        'paymentId': 1, 
        'grossTotal': 1, 
        'serviceFee': 1, 
        'deliveryFee': 1, 
        'driverTip': 1, 
        'status': 1, 
        'Total': 1, 
        'orderNumber': 1, 
        'createdAt': 1, 
        'userid': {
          'firstName': '$userid.firstName', 
          'lastName': '$userid.lastName', 
          'role': '$userid.role', 
          'Reg_Date': '$userid.Reg_Date', 
          'address': '$result'
        }
      }
    }, {
      '$group': {
        '_id': {
          'orderId': '$_id', 
          'categoryId': '$services.categoryId'
        }, 
        'products': {
          '$push': {
            'productId': '$services.products.productId', 
            'quantity': '$services.products.quantity'
          }
        }, 
        'userid': {
          '$first': '$userid'
        }, 
        'collectionTime': {
          '$first': '$collectionTime'
        }, 
        'DeliveryTime': {
          '$first': '$DeliveryTime'
        }, 
        'description': {
          '$first': '$description'
        }, 
        'paymentId': {
          '$first': '$paymentId'
        }, 
        'grossTotal': {
          '$first': '$grossTotal'
        }, 
        'serviceFee': {
          '$first': '$serviceFee'
        }, 
        'deliveryFee': {
          '$first': '$deliveryFee'
        }, 
        'driverTip': {
          '$first': '$driverTip'
        }, 
        'Total': {
          '$first': '$Total'
        }, 
        'status': {
          '$first': '$status'
        }, 
        'orderNumber': {
          '$first': '$orderNumber'
        }, 
        'createdAt': {
          '$first': '$createdAt'
        }, 
        'updatedAt': {
          '$first': '$updatedAt'
        }, 
        '__v': {
          '$first': '$__v'
        }
      }
    }, {
      '$group': {
        '_id': '$_id.orderId', 
        'services': {
          '$push': {
            'categoryId': '$_id.categoryId', 
            'categoryDetails': '$categoryDetails', 
            'products': '$products'
          }
        }, 
        'userid': {
          '$first': '$userid'
        }, 
        'collectionTime': {
          '$first': '$collectionTime'
        }, 
        'DeliveryTime': {
          '$first': '$DeliveryTime'
        }, 
        'description': {
          '$first': '$description'
        }, 
        'paymentId': {
          '$first': '$paymentId'
        }, 
        'grossTotal': {
          '$first': '$grossTotal'
        }, 
        'serviceFee': {
          '$first': '$serviceFee'
        }, 
        'deliveryFee': {
          '$first': '$deliveryFee'
        }, 
        'driverTip': {
          '$first': '$driverTip'
        }, 
        'Total': {
          '$first': '$Total'
        }, 
        'status': {
          '$first': '$status'
        }, 
        'orderNumber': {
          '$first': '$orderNumber'
        }, 
        'createdAt': {
          '$first': '$createdAt'
        }, 
        'updatedAt': {
          '$first': '$updatedAt'
        }, 
        '__v': {
          '$first': '$__v'
        }
      }
    }, {
      '$sort': {
        'createdAt': -1
      }
    }
  ]
  const orders = await Order.aggregate(data)

 
res
.status(200)
.json(
  ApiResponse(
      {orders}, 
      "Order Fetched Successfully", 
      true,
      orders.length
  ));
}catch(error){
return res.status(500).json(ApiResponse({}, error.message, false));
}
}