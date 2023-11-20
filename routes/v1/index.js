let express = require('express');
let router = express.Router();
//Auth Import
let adminAuth=require("../../Controllers/Auth/admin")
let userAuth=require("../../Controllers/Auth/user")

//Controller Import
let adminController = require("../../Controllers/admin/adminController")
let categoryController=require("../../Controllers/admin/categoryController")
let productController=require("../../Controllers/admin/productController")

//User Import
let userController=require('../../Controllers/user/userController')
let userProductController=require("../../Controllers/user/productController")
let cartController=require("../../Controllers/user/cartController")
let wishlistController=require("../../Controllers/user/whislistController")
//calling our middleware
var middleware = require('../../Service/middleware').middleware;
//Admin Profile
// -------------------------Admin Auth routes--------------------------
router.post("/admin/register", adminAuth.register)
router.post("/admin/login", adminAuth.login)

// -------------------------User Auth routes--------------------------
router.post("/user/register", userAuth.register)
router.post("/user/login", userAuth.login)


router.use(middleware);

//from here after using middleware all defined routes will use middleware surely.
// -------------------------Admin routes--------------------------
router.get("/admin/view", adminController.adminView)
router.put("/admin/update", adminController.adminUpdateData)
router.delete("/admin/delete", adminController.adminDelete)
//-------------------------Category routes---------------------------
router.post("/admin/category/create",categoryController.categoryCreate)
router.get("/admin/category/view",categoryController.categoryView)
router.put("/admin/category/update", categoryController.categoryUpdateData)
router.delete("/admin/category/delete", categoryController.categoryDelete)
// -------------------------Admin Product routes---------------------------
router.post("/admin/product/create",productController.productCreate)
router.get("/admin/product/view",productController.productView)
router.put("/admin/product/update", productController.productUpdateData)
router.delete("/admin/product/delete", productController.productDelete)

//User Profile
// -------------------------User routes--------------------------
router.get("/user/view", userController.userView)
router.put("/user/update", userController.userUpdateData)
router.delete("/user/delete", userController.userDelete)

// -------------------------User Product routes---------------------------
router.get("/user/product/view",userProductController.productView)

//--------------------------User Cart Routes------------------------------
router.post("/user/cart/create",cartController.cartCreate)
router.get("/user/cart/view",cartController.getCart)
router.put("/user/cart/update",cartController.cartUpdate)
router.delete("/user/cart/delete",cartController.cartDelete)
// ---------------------------User WishList Routes------------------------
router.post("/user/wishlist",wishlistController.whisList)
router.get("/user/wishlist/view",wishlistController.getWishList)
//----------------------------User Checkout Routes------------------------
module.exports = router;
