const { ApiResponse } = require("../Helpers")
const { body, validationResult } = require('express-validator');

exports.newProductValidator = [
  
    body('subCatId').not().isEmpty().withMessage("Sub Category is Required"),
    body('title').not().isEmpty().withMessage("Title is Required"),
    body('price').not().isEmpty().withMessage("Price is Required"),
    
    
    function (req, res, next) {
        const errors = validationResult(req);
        console.log("errors",errors);
        if (!errors.isEmpty()) {
            return res.status(400).json(ApiResponse({}, errors.array()[0].msg, false));
        }
        next()
    }
]
