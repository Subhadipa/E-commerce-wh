let express = require("express");
let router = express.Router();
//Auth Import
let adminAuth = require("../../Controllers/Auth/admin");
let userAuth = require("../../Controllers/Auth/user");

//Controller Import
let adminController = require("../../Controllers/admin/adminController");
let categoryController = require("../../Controllers/admin/categoryController");
let productController = require("../../Controllers/admin/productController");

//User Import
let userController = require("../../Controllers/user/userController");
let userProductController = require("../../Controllers/user/productController");
let cartController = require("../../Controllers/user/cartController");
let wishlistController = require("../../Controllers/user/whislistController");
//calling our middleware
var middleware = require("../../Service/middleware").middleware;
//Admin Profile
// -------------------------Admin Auth routes--------------------------
router.post("/admin/register", adminAuth.register);
router.post("/admin/login", adminAuth.login);

// -------------------------User Auth routes--------------------------
router.post("/user/register", userAuth.register);
router.post("/user/login", userAuth.login);

router.use(middleware);

//from here after using middleware all defined routes will use middleware surely.
// -------------------------Admin routes--------------------------
router.get("/admin", adminController.adminView);
router.put("/admin/:adminId", adminController.adminUpdateData);
router.delete("/admin/:adminId", adminController.adminDelete);
//-------------------------Category routes---------------------------
router.post("/admin/category", categoryController.categoryCreate);
router.get("/admin/category", categoryController.categoryView);
router.put(
  "/admin/category/:categoryId",
  categoryController.categoryUpdateData
);
router.delete("/admin/category/:categoryId", categoryController.categoryDelete);
// -------------------------Admin Product routes---------------------------
router.post("/admin/product", productController.productCreate);
router.get("/admin/product", productController.productView);
router.put("/admin/product/:productId", productController.productUpdateData);
router.delete("/admin/product/:productId", productController.productDelete);

//User Profile
// -------------------------User routes--------------------------
router.get("/user", userController.userView);
router.put("/user/:userId", userController.userUpdateData);
router.delete("/user/:userId", userController.userDelete);

// -------------------------User Product routes---------------------------
router.get("/user/product", userProductController.productView);

//--------------------------User Cart Routes------------------------------
router.post("/user/cart", cartController.cartCreate);
router.get("/user/cart/:userId", cartController.getCart);
router.put("/user/cart/:userId/:cartId", cartController.cartUpdate);
router.delete("/user/cart/:userId/:cartId", cartController.cartDelete);
// ---------------------------User WishList Routes------------------------
router.post("/user/wishlist", wishlistController.whisList);
router.get("/user/wishlist/:userId", wishlistController.getWishList);
//----------------------------User Checkout Routes------------------------
module.exports = router;
