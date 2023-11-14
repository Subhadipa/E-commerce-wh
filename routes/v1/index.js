let express = require('express');
let router = express.Router();

let adminController = require("../../Controllers/adminController")
let categoryController=require("../../Controllers/categoryController")
let productController=require("../../Controllers/productController")
// -------------------------Admin routes--------------------------
router.post("/admin-register", adminController.register)
router.post("/admin-login", adminController.login)
router.get("/admin-view", adminController.adminView)
router.put("/admin-update", adminController.adminUpdateData)
router.delete("/admin-delete", adminController.adminDelete)
//-------------------------Category routes---------------------------
router.post("/category-create",categoryController.categoryCreate)
router.get("/category-view",categoryController.categoryView)
router.put("/category-update", categoryController.categoryUpdateData)
router.delete("/category-delete", categoryController.categoryDelete)
// -------------------------Product routes---------------------------
router.post("/product-create",productController.productCreate)
router.get("/product-view",productController.productView)
router.put("/product-update", productController.productUpdateData)
router.delete("/product-delete", productController.productDelete)
module.exports = router;
