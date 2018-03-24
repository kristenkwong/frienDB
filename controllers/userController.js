const {Client} = require('pg'); //newer version of Javascript to get the client
const {Pool} = require('pg');
const pool = new Pool();

var async = require('async');
var dotenv = require('dotenv');
var moment = require('moment');
const pgp = require('pg-promise');
const promise = require('bluebird'); //for promises
dotenv.load(); //load environmental variables

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

function getCookie(name) {
  var value = '; ' + document.cookie;
  var parts = value.split('; ' + name + '=');
  if (parts.length == 2) return parts.pop().split(';').shift();
}

// Display index of site
exports.index = function(req, res) {

  // TODO: make the index page

  res.render('index')

};

// Display list of all Users.
exports.user_list = function(req, res) {

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
  console.log(process.env.DATABASE_URL);
  client.connect() //this is async so we need promises
    .then(() => {
      console.log("connected");
      return client.query('SELECT * FROM users');
    })
    .then((results) => {
      console.log('results?', results);
      res.render('user_list', {title: 'User List', user_list: results.rows});
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Something bad happened');
    })

};

// Formats birthday to look nicer
function birthday(date) {
  console.log("date:", date);
  return moment(date).format('MMMM D');
};

// Calculate age based on current time
function userAge(date) {
  console.log("calculating age")
  var ageDifference = Date.now() - date.getTime();
  var ageDate = new Date(ageDifference);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// Display detail page for a specific User.
exports.user_detail = function(req, res) {

  var result = {};
  result.user_result = [];
  result.post_result = [];

  console.log("RETRIEVING DETAILS FOR " + req.params.id);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect()
    .then(()=> {
      const sql = 'SELECT * FROM users WHERE username = $1;';
      const params = [req.params.id];
      return client.query(sql, params);
    })
    .then ((results) => {
      console.log(results.rows[0])
      result.user_result.push(results.rows[0]);
    })
    .then(() => {
      console.log('results??', result.user_result);
      res.render('user_detail', {title: req.params.id, user: result.user_result[0], birthday: birthday(result.user_result[0].birthdate), age: userAge(result.user_result[0].birthdate)})
    })

  // TODO figure out how to send multiple sql queries and render results of posts

  /* async.parallel({
    user: function(callback) {
      User.findById(req.params.id).exec(callback);
    },
    posts: function(callback) {
      Post.find({'user': req.params.id}, 'date').exec(callback);
    },
  }, function(err, results) {
    if (err) {return next(err);} //error in api usage
    if (results.user == null) {
      var err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    // Successful, so render
    res.render('user_detail', {title: results.user.name, user: results.user, user_posts: results.posts});
  });*/
};

// Display User create form on GET
exports.user_create_get = function(req, res) {
  res.render('user_form', {title: 'Create New User'});
};

// Handle User create for on POST
exports.user_create_post = [
  // Validate fields
  body('username').isLength({min:1}).trim().withMessage('Username is required.'),
  body('password').isLength({min:1}).withMessage('Password is required'),
  body('first_name').isLength({min:1}).trim().withMessage('First name is required.'),
  body('last_name').isLength({min:1}).trim().withMessage('Last name is required.'),
  body('birthdate', 'Invalid date of birth.').optional({checkFalsy: true}).isISO8601(),

  // Sanitize fields
  sanitizeBody('username').trim().escape(),
  sanitizeBody('first_name').trim().escape(),
  sanitizeBody('last_name').trim().escape(),
  sanitizeBody('birthdate').toDate(),

  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render('user_form', {title: 'Create New User', user: req.body, errors: errors.array()});
      return;
    }
    else {
      // Data from form is valid.

      // insert into database
      // 1. connect to database
      // 2. send a query
      // 3. do the database thingy
      // 4. profit???

      const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true
      });
      console.log(process.env.DATABASE_URL); //uses env settings to connect
      client.connect()
        .then(()=> {
          console.log('connection complete');
          // do query stuff

          //TODO need to check if city/country combinations are in location
          // if not, add tuples into location table as well


          // sql to insert new user into db
          const sql = 'INSERT INTO users (username, password, first_name, last_name, gender, birthdate, born_city, born_country, lives_city, lives_country) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
          const params = [req.body.username, req.body.password, req.body.first_name, req.body.last_name, req.body.gender, req.body.birthdate, req.body.born_city, req.body.born_country, req.body.lives_city, req.body.lives_country];

          // this thing checks if any of the form values are empty
          // if they are empty, set them to null to avoid broke constraints in db
          for (i = 0; i < params.length; i++) {
            if (params[i] == '') {
              params[i] = null;
            }
          }

          console.log(params);
          return client.query(sql, params);
        })
        .then((result) => {
          console.log('result?', result);
          //TODO need to redirect to the new user's detail page
          res.redirect('/home/user/' + req.body.username);
        })
    }
  }
];

// Display User delete form on GET
exports.user_delete_get = function(req,res) {
  res.send('NOT IMPLEMENTED: User delete GET')
};

// Handle User delete form on POST
exports.user_delete_post = function(req, res) {
  // TODO not done
  console.log('deleting id', req.params.id);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect()
    .then(()=> {
      const sql = 'DELETE FROM users WHERE username = $1;';
      const params = [req.params.id]
      return client.query(sql, params);
    })
    .then((results) => {
      console.log('delete results', results);
      res.redirect('/home/users')
    })
};

// Display User update form on GET
exports.user_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: User update GET');
};

// Handle User update on POST
exports.user_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: User update POST');
};
