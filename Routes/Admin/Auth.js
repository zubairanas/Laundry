const express = require("express");
const { adminRegisterValidator, signinValidator, emailCodeValidator, verifyCodeValidator, resetPasswordValidator  } = require("../../Validator/authValidator");
const { newCoupenCodeValidator } = require("../../Validator/coupenValidator");
const { register, emailVerificationCode, verifyRecoverCode,editProfile,getAdminProfile, resetPassword, signin } = require("../../Controllers/Admin/adminAuthController");
const { user , contentimage ,catImage } = require('../../Helpers/images')
const {verifyToken ,validateToken} = require('../../Helpers/index')
const {UserStatus , GetAllUsers , GetOneUser ,UserDateFilter , getUserSearchFilter} = require('../../Controllers/Admin/adminUserController')
const { updateContentData , getOneContentData , getAllContent } = require("../../Controllers/Admin/contentController")
const { changeQueryStatus , QuerySearchFilter , getallQuery , QueryDateFilter , getOneQuery } = require("../../Controllers/Admin/adminQueryController")
const { newCategoryValidator ,newSubCategoryValidator } = require("../../Validator/categoryValidator")
const { DateFilter , TextSearchFilter , FilterCategoryStatus,editCategory , editNumberOfDaysCategory ,createCategory ,getallCategory ,getSelectedCategory ,CategoryStatusChanged } = require("../../Controllers/Admin/adminCategoryController")
const { editSubCategory , getSubCategoryById , DateFilters , TextSearchFilters , subCategorystatusChanged , createSubCategory , getSubcategorybyCategory ,getallSubCategory ,FiltersubCategoryStatus} = require("../../Controllers/Admin/adminSubCategoryController")
const { editProduct ,  createProduct ,getProductsBysubCategoryId , ProductStatusChanged , getAllProducts , ProductSearchFilters , DateFiltersforProduct  , getProductById } = require("../../Controllers/Admin/adminProductController")
const { newProductValidator } = require("../../Validator/productValidators")
const { AllOrders , userOrderDetails,OrderDetailss  , OrderDetails ,OrderStatusChanged , SearchOrders , OrderDateFilter} = require("../../Controllers/Admin/adminOrderController")
const { createCoupenCode , getAllCoupenCode , deleteCoupenCode } = require("../../Controllers/Admin/adminCoupenController")
const { createReferalCode , getAllReferalCode , getReferalDetails , deleteReferalCode } = require("../../Controllers/Admin/adminReferalCodeController")
const verifyadmin =require('../../middleware/admin')
const router = express.Router()

// Admin auth api start here
router.post("/register" , adminRegisterValidator, register);
router.post("/signin", signinValidator, signin);
// adminRoutes.js (or wherever your routes are defined)
router.get("/profile", validateToken, verifyToken, getAdminProfile);

router.post("/updateAdmin/:id", validateToken, verifyToken, editProfile);

router.post("/emailVerificationCode", emailCodeValidator, emailVerificationCode);
router.post("/verifyRecoverCode", verifyCodeValidator, verifyRecoverCode);
router.post("/resetPassword", resetPasswordValidator, resetPassword);
// Admin auth api end here


// user api start here
router.put("/user/status/:id" , validateToken ,verifyToken , UserStatus);
router.get("/user/get" , validateToken ,verifyToken , GetAllUsers);
router.get("/user/get/:id" , validateToken ,verifyToken , GetOneUser);
router.get("/user/filter" , validateToken ,verifyToken , UserDateFilter);
router.get("/user/search/:text" , validateToken ,verifyToken , getUserSearchFilter);
router.get("/user/userorder/:id"  ,validateToken , verifyToken , userOrderDetails)
router.get("/user/userorderdetails/:id" , validateToken , verifyToken , OrderDetailss)
// user api end here

// content api start here
router.put("/content/edit/:id" , contentimage ,validateToken ,verifyToken , updateContentData );
router.get("/content/get/:id"  ,validateToken ,verifyToken , getOneContentData );
router.get("/content/get"  ,validateToken ,verifyToken , getAllContent );
// content api end here


// query api start here
router.get("/query/search/:text" , validateToken ,verifyToken , QuerySearchFilter);
router.get("/query/get/:id" , validateToken ,verifyToken , getOneQuery);
router.get("/query/get" , validateToken ,verifyToken , getallQuery);
router.get("/query/datefilter" , validateToken ,verifyToken , QueryDateFilter);
router.put("/query/status/:id" , validateToken ,verifyToken , changeQueryStatus);
// query api end here

// category api start here
router.post("/category/create",catImage ,newCategoryValidator , validateToken ,verifyToken  ,createCategory )
router.get("/category/get" , validateToken ,verifyToken  ,getallCategory )
router.get("/category/get/:id" , validateToken ,verifyToken  ,getSelectedCategory )
router.put("/category/status/:id" , validateToken ,verifyToken  ,CategoryStatusChanged )
router.get("/category/filter" , validateToken ,verifyToken  ,FilterCategoryStatus )
router.get("/category/search/:text" , validateToken ,verifyToken  ,TextSearchFilter )
router.get("/category/datefilter" , validateToken ,verifyToken  ,DateFilter )
router.put("/category/updated/:id" ,catImage, validateToken ,verifyToken  ,editCategory )
router.put("/category/edit/:id"  , validateToken ,verifyToken  ,editNumberOfDaysCategory )

// category api end here

// sub category api start here
router.post("/subcategory/create",newSubCategoryValidator , validateToken ,verifyToken  , createSubCategory )
router.get("/subcategory/get" , validateToken ,verifyToken  , getallSubCategory)
router.get("/subcategory/filter" , validateToken ,verifyToken  , FiltersubCategoryStatus )
router.get("/subcategory/get/:catid" ,validateToken ,verifyToken  , getSubcategorybyCategory)
router.put("/subcategory/status/:id"  ,validateToken ,verifyToken  , subCategorystatusChanged)
router.get("/subcategory/search/:text" ,validateToken ,verifyToken  , TextSearchFilters)
router.get("/subcategory/datefilter" ,validateToken ,verifyToken  , DateFilters)
router.get("/subcategory/data/:id" ,validateToken ,verifyToken  , getSubCategoryById)
router.put("/subcategory/edit/:id" ,validateToken ,verifyToken  , editSubCategory)
// sub category api end here


// products api start here
router.post("/product/create",newProductValidator , validateToken ,verifyToken  , createProduct )
router.get("/product/get/:catId" ,validateToken ,verifyToken  , getProductsBysubCategoryId)
router.put("/product/status/:id" ,validateToken ,verifyToken  , ProductStatusChanged)
router.get("/product/get" ,validateToken ,verifyToken  , getAllProducts)
router.get("/product/search/:text" ,validateToken ,verifyToken  , ProductSearchFilters)
router.get("/product/datefilter" ,validateToken ,verifyToken  , DateFiltersforProduct)
router.get("/product/Data/:id" ,validateToken ,verifyToken  , getProductById)
router.put("/product/edit/:id" ,validateToken ,verifyToken  , editProduct)
// products api end here

// order api start here
router.get("/order/get" , validateToken ,verifyToken  , AllOrders )
router.get("/order/get/:id" , validateToken ,verifyToken  , OrderDetails )
router.get("/order/search/:text" , validateToken ,verifyToken  , SearchOrders )
router.put("/order/status/:id" , validateToken ,verifyToken  , OrderStatusChanged )
router.get("/order/datefilter" , validateToken ,verifyToken  , OrderDateFilter )
// order api end here


// CoupenCode api start here
router.post("/coupen/create" ,  newCoupenCodeValidator , validateToken ,verifyToken , createCoupenCode);
router.get("/coupen/get"  , getAllCoupenCode);
router.delete("/coupen/delete/:id" , validateToken ,verifyToken , deleteCoupenCode);
// CoupenCode api end here


// ReferalCode api start here

router.post("/referal/create" , validateToken ,verifyToken , createReferalCode);
router.get("/referal/get" , validateToken ,verifyToken , getAllReferalCode);
router.get("/referal/get/:code" , validateToken ,verifyToken , getReferalDetails);
router.delete('/referal/delete/:id' , validateToken ,verifyToken , deleteReferalCode)


// ReferalCode api end here




module.exports = router

/**
 * @swagger
 *  /admin/auth/register:
 *      post: 
 *          summary: asdf asd fs
 *          description: asdf asd fasdf 
 *          responses: 
 *              200: 
 *                  description: To get test
 */