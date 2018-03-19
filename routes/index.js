var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  //res.render('db');
  res.redirect('/home');
});

router.get('/home/statistics', function(req, res) {
  res.render('statistics', {title: 'Site Statistics'});
})

module.exports = router;
