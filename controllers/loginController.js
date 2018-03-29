const {Client} = require('pg'); //newer version of Javascript to get the client

exports.get_user = function(req, res) {
  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

  const curr_user = localStorage.getItem('user');
  return curr_user;
}


exports.login_get = function(req, res) {

  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

  const curr_user = localStorage.getItem('user');
  console.log(curr_user);

  if (curr_user == null) {
    res.render('login', {title: 'Login'});
  } else {
    res.render('login', {title: "You're already logged in!", curr_user: curr_user});
  }

}

exports.login_post = async function(req, res) {

  if (req.body.username === 'admin' && req.body.password === 'admin') {

    if (typeof localStorage === "undefined" || localStorage === null) {
      var LocalStorage = require('node-localstorage').LocalStorage;
      localStorage = new LocalStorage('./scratch');
    }

    localStorage.setItem('user', 'admin');
    res.render('logout', {title: "You're logged in!", curr_user: localStorage.getItem('user')});

  } else {

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true
    });

    try {

      await client.connect();

      const sql = 'SELECT password FROM users WHERE username = $1;'
      const params = [req.body.username]

      var result = await client.query(sql, params);
      await client.end();
      console.log(result);

      console.log(result.rowCount);

      if (result.rowCount === 0) {
        throw new Error('User does not exist!');
      }

      else if (result.rows[0].password === req.body.password) {

        if (typeof localStorage === "undefined" || localStorage === null) {
          var LocalStorage = require('node-localstorage').LocalStorage;
          localStorage = new LocalStorage('./scratch');
        }

        localStorage.setItem('user', req.body.username);
        console.log("setting user", localStorage.getItem('user'));

        res.render('logout', {title: "You're logged in!", curr_user: localStorage.getItem('user')});
    } else {
      throw new Error('Password or username is invalid, please try again');
    }

  } catch (err) {
    res.render('login', {error: err});
  }
}}

exports.logout_get = function(req, res) {

  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

  const curr_user = localStorage.getItem('user');

  res.render('logout', {curr_user: curr_user, title: 'Log out'});
}

exports.logout_post = function(req, res) {
  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

  localStorage.removeItem('user');

  res.redirect('/home/login');
}
