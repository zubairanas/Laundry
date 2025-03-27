const User = require("../../Models/User");
const {
  ApiResponse
} = require("../../Helpers");

 //const {GetAllUsers , getUserSearchFilter , FilterUser } = require("../../utils/Aggregation/Admin/User/index")

exports.UserStatus = async (req, res) => {
  const {
    id
  } = req.params;
  const {
    status
  } = req.body
  try {
    await User.updateOne({
      _id: id
    }, {
      $set: {
        status: status
      }
    }, {
      new: true
    });

    return res
      .status(200)
      .json(
        ApiResponse({},
          true,
          "User Status Changed Successfully"
        )
      );
  } catch (err) {
    return res.status(500).json(ApiResponse({}, error.message, false));
  }
}

exports.GetAllUsers = async (req, res) => {
  try {

    
    const getallUser = await User.find({ role : "USER"})

    return res
      .status(200)
      .json(
        ApiResponse({
            getallUser
          },
          true,
          "Users Fetched Successfully",
          getallUser.length
        )
      );

  } catch (error) {
    return res.status(500).json(ApiResponse({}, error.message, false));
  }
}

exports.GetOneUser = async (req, res) => {
  const {
    id
  } = req.params
  try {

    const singleUser = await User.findById(id).populate('dogid')
    return res
      .status(200)
      .json(
        ApiResponse({
            singleUser
          },
          true,
          "User Data Fetched Successfully",

        )
      );


  } catch (err) {
    return res.status(500).json(ApiResponse({}, error.message, false));
  }
}



exports.UserDateFilter = async (req,res) => {
  let { fromDate , toDate  } = req.query

  fromDate = fromDate.split('T')[0]
  toDate = toDate.split('T')[0]
try{

  const data =  [
    {
      '$match': {
        'status': 'ACTIVE'
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
        firstName : 1,
        lastName : 1,
        email :1,
        image :1,
      }
    },
    {
      '$match': {
        'createdAt': {
          '$gte': fromDate , 
          '$lte': toDate
          // '$lte': new Date(new Date(toDate).getTime() + 24 * 60 * 60 * 1000).toISOString()
        }
      }
    }, 
  ]

  const datefilter = await User.aggregate(data)
  res.status(200).json(
    ApiResponse(
      {datefilter},
      "User Date Filter Successfully",
      true,
      datefilter.length
      
    )
  );
}catch(error){
  res.status(500).json(ApiResponse({}, error.message, false));
}
}

exports.getUserSearchFilter = async (req, res) => {
  const {
    text
  } = req.params
  try {

    const regexPattern = new RegExp(text, 'i');

    const data  = [
      {
        '$addFields': {
          'result': {
            '$cond': {
              'if': {
                '$or': [
                  { '$regexMatch': { 'input': '$firstName', 'regex': regexPattern } },
                  { '$regexMatch': { 'input': '$lastName', 'regex': regexPattern } },
                  { '$regexMatch': { 'input': '$email', 'regex': regexPattern } },
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


    const  AlreadyService = await User.aggregate(data)

    if (AlreadyService.length === 0) {
        // No matches found
        return res.status(404).json(ApiResponse({}, "No matching employees found", false));
      }
      res.status(200).json(
        ApiResponse({
            AlreadyService
          },
          true,
          "User Filtered Successfully",
          AlreadyService.length
        )
      );


  } catch (error) {
    console.log("======>",error)
    res.status(500).json(ApiResponse({}, error.message, false));
  }
}