var express = require('express');
var router = express.Router();
var cookies = require('js-cookie');

/* GET home page. */
router.get('/', function(req, res) {
  //res.render('db');
  res.redirect('/home');
});

router.get('/home/statistics', function(req, res) {
  res.render('statistics', {title: 'Site Statistics'});
});

router.get('/home/login', function(req, res) {
  res.render('login', {title: 'Login'});
})

router.post('/home/login', function(req, res) {
  res.redirect('/home');
})

module.exports = router;
