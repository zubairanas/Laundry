const express = require("express");
const { userRegisterValidator, signinValidator, emailCodeValidator, verifyCodeValidator, resetPasswordValidator  } = require("../../Validator/userValidator");
const {changePassword ,editProfile , userProfile , register,dogRegister, emailVerificationCode, verifyRecoverCode, resetPassword, signin } = require("../../Controllers/User/UserAuthController");
const { user } = require('../../Helpers/images')

const {validateToken , verifyUserToken} = require('../../Helpers/index')
const {createUserQuery } = require("../../Controllers/User/QueryController")
const { createQueryValidator } = require("../../Validator/queryValidator")
const { createOrder ,userOrderDetails , OrderDetails } = require("../../Controllers/User/UserOrderController")
const router = express.Router()
const { getallSubCategory ,getSubcategorybyCategory } = require("../../Controllers/Admin/adminSubCategoryController")
const { getallCategory } = require("../../Controllers/Admin/adminCategoryController")
const { getProductsBysubCategoryId } = require("../../Controllers/Admin/adminProductController")
const { userCoupenCode } = require("../../Controllers/Admin/adminCoupenController")
const { getAllReferalCode , getReferalDetails } = require("../../Controllers/Admin/adminReferalCodeController")


// user auth api start here
    router.post("/register"  , userRegisterValidator, register);
    router.post("/signin", signinValidator, signin);
    router.post("/emailVerificationCode", emailCodeValidator, emailVerificationCode);
    router.post("/verifyRecoverCode", verifyCodeValidator, verifyRecoverCode);
    router.post("/resetPassword", resetPasswordValidator, resetPassword);
// user auth api end here


// user's api start here
router.get("/userprofile" ,validateToken , verifyUserToken  , userProfile)
router.put("/update" ,user , validateToken , verifyUserToken  , editProfile )
router.put("/changepassword" , validateToken , verifyUserToken  , changePassword)
// user's api end here

// user query api start here 
router.post("/query/create" , createQueryValidator   ,createUserQuery)
// user query api end here 

// order api start here
router.post("/order/create" , createOrder)
router.get("/order/userorder"  ,validateToken , verifyUserToken , userOrderDetails)
router.get("/order/:id" , validateToken , verifyUserToken , OrderDetails)
// order api end here


// category api start here
router.get("/category/get" ,getallCategory )
// category api end here



// sub category api start here
router.get("/subcategory/get"   , getallSubCategory)
router.get("/subcategory/get/:catid" , getSubcategorybyCategory)

// sub category api end here

// products api start here
router.get("/product/get/:catId"  , getProductsBysubCategoryId)
// products api end here


// CoupenCode api start here
router.put("/coupen/redeem/:code" , userCoupenCode);
// CoupenCode api end here


// referal code api start here
router.get("/referal/get" , validateToken , verifyUserToken , getAllReferalCode)
router.put("/referal/get/:code"  , getReferalDetails)
// referal code api end here







module.exports = router
