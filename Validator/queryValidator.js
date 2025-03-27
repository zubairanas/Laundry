const { ApiResponse } = require("../Helpers")
const { body, validationResult, check } = require('express-validator');

exports.createQueryValidator = [
    check('email', "Email is Required").not().isEmpty().isEmail().withMessage("Email is Invalid"),
    body('firstName').not().isEmpty().withMessage("First Name is Required"),
    body('lastName').not().isEmpty().withMessage("Last Name is Required"),
    body('subject').not().isEmpty().withMessage("Subject is Required"),
    body('message').not().isEmpty().withMessage("Message is Required"),
    function (req, res, next) {
        const errors = validationResult(req);
        console.log("errors",errors);
        if (!errors.isEmpty()) {
            return res.status(400).json(ApiResponse({}, errors.array()[0].msg, false));
        }
        next()
    }
]
