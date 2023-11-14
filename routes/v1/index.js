let express = require('express');
let router = express.Router();

let adminController = require("../../Controllers/adminController")

router.post("/admin-register", adminController.register)

router.post("/admin-login", adminController.login)


module.exports = router;
