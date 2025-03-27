const { ApiResponse } = require("../Helpers")
const { body, validationResult } = require('express-validator');

exports.newCategoryValidator = [
  
    body('title').not().isEmpty().withMessage("Title is Required"),
    body('description').not().isEmpty().withMessage("Description is Required"),
    body('price').not().isEmpty().withMessage("Price is Required"),
    body('Includes').not().isEmpty().withMessage("Includes is Required"),
    
    function (req, res, next) {
        const errors = validationResult(req);
        console.log("errors",errors);
        if (!errors.isEmpty()) {
            return res.status(400).json(ApiResponse({}, errors.array()[0].msg, false));
        }
        next()
    }
]


exports.newSubCategoryValidator = [
  
    body('catId').not().isEmpty().withMessage("Category is Required"),
    body('title').not().isEmpty().withMessage("Title is Required"),
   
    
    function (req, res, next) {
        const errors = validationResult(req);
        console.log("errors",errors);
        if (!errors.isEmpty()) {
            return res.status(400).json(ApiResponse({}, errors.array()[0].msg, false));
        }
        next()
    }
]