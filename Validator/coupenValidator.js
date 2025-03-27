const { ApiResponse } = require("../Helpers")
const { body, validationResult } = require('express-validator');

exports.newCoupenCodeValidator = [
  
    body('title').not().isEmpty().withMessage("Title is Required"),
    body('discount').not().isEmpty().withMessage("discount amount is Required"),
    body('expireDate').not().isEmpty().withMessage("expire Date is Required"),
    
    function (req, res, next) {
        const errors = validationResult(req);
        console.log("errors",errors);
        if (!errors.isEmpty()) {
            return res.status(400).json(ApiResponse({}, errors.array()[0].msg, false));
        }
        next()
    }
]