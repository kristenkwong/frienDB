var express = require('express');
var router = express.Router();
var app = express();

const cookieParser = require('cookie-parser');

var username = 'username';

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/home');
});

router.get('/home/database', function(req, res) {
  res.render('database', {title: 'Database Queries'});
});

module.exports = router;
