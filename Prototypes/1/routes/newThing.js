var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/newThing', function(req, res, next) {
  res.send('newThing');
});

module.exports = router;
