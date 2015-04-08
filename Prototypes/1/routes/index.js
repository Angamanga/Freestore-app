var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'the Free and functional', things:"The place to find free things", test:"testar nodemon"});
});

module.exports = router;
