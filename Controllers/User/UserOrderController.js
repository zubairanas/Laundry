const Order = require('../../Models/Order')
const userAddress = require("../../Models/userAddress")
const user = require("../../Models/User")
const Payment = require("../../Models/Payment")
const stripKey = process.env.STRIPE_SECRET_KEY
const stripe = require("stripe")('sk_test_51PU7mXBRjHyJTsKfciEWvr859O8S07P7YoqS1zjCcC57KE1B1GukAsYoi9oRb9ApR7k5awbAX1XRW0tneJD7mUQf00tFL1WcQK');
const { ApiResponse} = require("../../Helpers");
const mongoose = require('mongoose')
const { generateEmail } = require('../../Helpers/email')


exports.createOrder = async (req, res) => {
  const {
    services, collectionTime, DeliveryTime, description,
    grossTotal, serviceFee, deliveryFee, driverTip, Total,
    postcode, address, addressType, Cardnumber, stripetoken,
    Expirydate, CVC, cardType, CardholderName, email , uid
  } = req.body;
  try {
    console.log("====>" , req.body)
    let userId;
    let isGuestUser = !uid

    if (isGuestUser) {
      // For guest user
      let guestUser = await user.create({
        email,
        password: "F696486c72!",
        role: "USER",
        isGuest : true
      });
      userId = guestUser?._id?.toString();
    } else {
      // For registered user
      userId = uid
    }

    let u_Address = await userAddress.findOne({ postcode, address, addressType, userid: userId });
    let orderno = ("Laundry_" + Math.round(Math.random() * 100000) + 900000).slice(0, 15);

    if (!u_Address) {
      const addressData = {
        postcode,
        address,
        addressType,
        userid: userId
      };
      u_Address = await userAddress.create(addressData);

      await user.updateOne(
        { _id: userId },
        { $push: { address: u_Address?._id?.toString() } },
        { new: true }
      );
    }

    let payment = await Payment.findOne({ CardholderName, Cardnumber, Expirydate, userid: userId });

    if (!payment) {
      const paymentData = { CardholderName, Cardnumber, Expirydate, userid: userId };
      payment = await Payment.create(paymentData);
    }

    const orderData = {
      services: services?.map(data => ({
        categoryId: data.categoryId,
        products: data.products?.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      })),
      userid: userId,
      email,
      collectionTime: collectionTime?.map(data => ({
        date: data.date,
        time: data.time,
        instructions: data.instructions
      })),
      DeliveryTime: DeliveryTime?.map(data => ({
        date: data.date,
        time: data.time,
        instructions: data.instructions
      })),
      description,
      paymentId: payment._id,
      grossTotal,
      serviceFee,
      deliveryFee,
      driverTip,
      Total,
      orderNumber: orderno
    };

    const OrderDetails = await Order.create(orderData);
    const userDetails = isGuestUser ? await user.findById(userId) : await user.findById(uid);

    const stripeData = {
      amount: OrderDetails.Total * 100,
      currency: 'usd',
      source: stripetoken,
      description: "Order payment",
      receipt_email: userDetails.email
    };

    const paymentHistory = await stripe.charges.create(stripeData);

    await Payment.updateOne({ _id: payment._id }, { $set: { cardType: paymentHistory.source.brand } }, { new: true });

    await userAddress.findOneAndUpdate(
      { _id: u_Address._id },
      { $set: { orderid: OrderDetails._id.toString() } },
      { new: true }
    );

    const receipt = paymentHistory.receipt_url;
    if(isGuestUser){
       html = `
        <div>
          <p>Your account was created and your password is F696486c72!</p>
          <p>Thank you for your payment. You can view your receipt <a href=${receipt} target="_blank">View</a>.</p>
        </div>
      `;
    }else{
       html = `
        <div>
          <p>Thank you for your payment. You can view your receipt <a href=${receipt} target="_blank">View</a>.</p>
        </div>
      `;
    }
   
    await generateEmail(userDetails.email, "Laundry Wash Order -- ", html);
    if (paymentHistory.status === "succeeded") {
      return res.status(201).json(ApiResponse({ OrderDetails, receipt }, "Order Created Successfully", true));
    } else {
      return res.status(400).json(ApiResponse({}, "Payment failed", false));
    }

  } catch (error) {
    // Ensure only one response is sent
    if (!res.headersSent) {
      return res.status(500).json(ApiResponse({}, error.message, false));
    }
    console.error("Error in createOrder:", error);
  }
};



exports.userOrderDetails = async (req,res) => {
    const { _id } = req.user
try{

    const data = [
        {
          '$match': {
            'userid':  new mongoose.Types.ObjectId(_id)
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

exports.OrderDetails = async (req,res) => {
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



