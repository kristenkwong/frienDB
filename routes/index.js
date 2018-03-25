var express = require('express');
var router = express.Router();
var app = express();

const cookieParser = require('cookie-parser');

var username = 'username';

/* GET home page. */
router.get('/', function(req, res) {
  //res.render('db');
  res.redirect('/home');
});

router.get('/home/statistics', function(req, res) {
  res.render('statistics', {title: 'Site Statistics'});
});

function isAuthenticated(req, res, next) {
  var getUser = req.cookies.user;
  console.log(getUser);
  if (getUser == undefined) {
    res.render('login', {title: 'Log in'})
  } else {
    console.log('success')
  }
  next()
}

function login(req, res, next) {
  res.send('login');
}

function logout(req, res, next) {
  res.send('logout');
}

router.get('/home/login', isAuthenticated, login);
router.get('/home/logout', isAuthenticated, logout);

module.exports = router;
