let express = require('express');
let router = express.Router();

let adminController=require("../../Controllers/adminController")

router.post("/admin-register",adminController.register)




module.exports = router;
