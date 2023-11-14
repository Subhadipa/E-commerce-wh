let express = require('express');
let router = express.Router();
let v1 = require('./v1');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use("/api", v1);
module.exports = router;
