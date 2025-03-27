const Query = require("../../Models/Query");
const { ApiResponse} = require("../../Helpers");
const mongoose = require('mongoose')


exports.getallQuery = async (req,res) => {
    try{
        const data = [
            {
              '$project': {
                'name': {
                  '$concat': [
                    '$firstName', ' ', '$lastName'
                  ]
                }, 
                'email': 1, 
                'recievedOn': '$date',
                'subject' : 1,
                'message' : 1,
                'status' : 1
              }
            }, {
              '$sort': {
                'recievedOn': -1
              }
            }
          ]
    
          const allqueries = await Query.aggregate(data)
    
          res
          .status(200)
          .json(
            ApiResponse(
                {allqueries}, 
                "Query Created Successfully", 
                true,
                allqueries.length
            ));
    }catch(error){
        return res.status(500).json(ApiResponse({}, error.message, false));
    }
    }
    
    
    exports.QuerySearchFilter = async (req,res) => {
        const { text } = req.params
        try{
            const regexPattern = new RegExp(text, 'i');
    
            const data = [
                {
                  '$project': {
                    'name': {
                      '$concat': [
                        '$firstName', ' ', '$lastName'
                      ]
                    }, 
                    'email': 1, 
                    'subject' : 1,
                    'message' : 1,
                    'recievedOn': '$date',
                    'status' : 1
                  }
                },
                {
                    '$addFields': {
                      'result': {
                        '$cond': {
                          'if': {
                            '$or': [
                              { '$regexMatch': { 'input': '$name', 'regex': regexPattern } },
                              { '$regexMatch': { 'input': '$email', 'regex': regexPattern } },
                              { '$regexMatch': { 'input': '$subject', 'regex': regexPattern } },
                              { '$regexMatch': { 'input': '$message', 'regex': regexPattern } },
                             
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
                {
                  '$sort': {
                    'recievedOn': -1
                  }
                }
              ]
    
              const allqueries = await Query.aggregate(data)
    
              if (allqueries.length === 0) {
                // No matches found
                return res.status(404).json(ApiResponse({}, "No matching data found", false));
              }
              res
              .status(200)
              .json(
                ApiResponse(
                    {allqueries}, 
                    "Query Created Successfully", 
                    true,
                    allqueries.length
                ));
        }catch(error){
            return res.status(500).json(ApiResponse({}, error.message, false));
        }
    }
    
    
    exports.QueryDateFilter = async (req,res) => {
        const {fromDate , toDate} = req.query
     
        try{
            const data = [
                {
                    '$match': {
                      'date': {
                        '$gte': fromDate , 
                        // '$lte': new Date(new Date(toDate).getTime() + 24 * 60 * 60 * 1000).toISOString()
                        '$lte': toDate
                      }
                    }
                  }, 
                {
                  '$project': {
                    'name': {
                      '$concat': [
                        '$firstName', ' ', '$lastName'
                      ]
                    }, 
                    'email': 1, 
                    'message' : 1,
                    'subject' : 1,
                    'recievedOn': '$date',
                    'status' : 1
                  }
                }, {
                  '$sort': {
                    'recievedOn': -1
                  }
                }
              ]
              const allqueries = await Query.aggregate(data)
              res
              .status(200)
              .json(
                ApiResponse(
                    {allqueries}, 
                    "Query Created Successfully", 
                    true,
                    allqueries.length
                ));
        }catch(error){
            return res.status(500).json(ApiResponse({}, error.message, false));
        }
    }
    
    exports.getOneQuery = async (req,res) => {
        const { id } = req.params;
        try{
            
            const data = [
                {
                  '$match': {
                    '_id': new mongoose.Types.ObjectId(id),
                  }
                }, {
                  '$project': {
                    'name': {
                      '$concat': [
                        '$firstName', ' ', '$lastName'
                      ]
                    }, 
                    'email': 1, 
                    'message': 1,
                    'status' : 1
                  }
                }, {
                  '$sort': {
                    'recievedOn': -1
                  }
                }
              ]
          const oneQuery =  await Query.aggregate(data)
    
          res
          .status(200)
          .json(
            ApiResponse(
                {oneQuery}, 
                "Query Fetched Successfully", 
                true
            ));
        }catch(error){
            return res.status(500).json(ApiResponse({}, error.message, false));
        }
    }

    exports.changeQueryStatus = async (req,res) => {
        const { id } = req.params
        
        try{

      let updatedPro =  await Query.updateOne({_id : id},{ $set : { status : "Responded" } },{new : true})

            const {  acknowledged , modifiedCount} = updatedPro

            if(acknowledged === true && modifiedCount === 1){
                res
                .status(200)
                .json(
                  ApiResponse(
                      {}, 
                      "Query status Successfully", 
                      true
                  ));
            }

        }catch(error){
            return res.status(500).json(ApiResponse({}, error.message, false));
        }
    }