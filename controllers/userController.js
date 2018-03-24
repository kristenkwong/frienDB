var User = require('../models/user');
var Tag = require('../models/tag');
var Post = require('../models/post')
const {Client} = require('pg'); //newer version of Javascript to get the client

var async = require('async');
var dotenv = require('dotenv');
dotenv.load();

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

// Display index of site
exports.index = function(req, res) {

  res.render('index');

  /* async.parallel({
    user_count: function(callback) {
      User.count(callback);
    },
    tag_count: function(callback) {
      Tag.count(callback);
    },
    post_count: function(callback) {
      Post.count(callback);
    },
  }, function(err, results) {
    res.render('index', { title: 'FrienDB Home', error: err, data: results });
  }); */

  // when rendering, we need title, error, and data
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

// Display detail page for a specific User.
exports.user_detail = function(req, res) {

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect()
    .then(()=> {
      const sql = 'SELECT * FROM users WHERE user_id = $1;'
      const params = [req.params.id];
      return client.query(sql, params);
    })
    .then ((results) => {
      console.log('results?', results);
    })


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
  body('email').isLength({min:1}).trim().withMessage('Email is required.').isEmail().withMessage('Must be a valid email'),
  body('password').isLength({min:1}).withMessage('Password is required'),
  body('first_name').isLength({min:1}).trim().withMessage('First name is required.'),
  body('family_name').isLength({min:1}).trim().withMessage('Last name is required.'),
  body('birthdate', 'Invalid date of birth.').optional({checkFalsy: true}).isISO8601(),

  // Sanitize fields
  sanitizeBody('email').trim().escape(),
  sanitizeBody('first_name').trim().escape(),
  sanitizeBody('family_name').trim().escape(),
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
          const sql = 'INSERT INTO users (email, password, first_name, family_name, birthdate, born_city, born_country, lives_city, lives_country) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
          const params = [req.body.email, req.body.password, req.body.first_name, req.body.family_name, req.body.gender, req.body.birthdate, req.body.born_city, req.body.born_country, req.body.lives_city, req.body.lives_country];

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
          res.redirect('/');
          //TODO need to redirect to the new user's detail page
          res.redirect(user.url);
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
  console.log('deleting id', req.params.id);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
  console.log(process.env.DATABASE_URL);
  client.connect()
    .then(()=> {
      const sql = 'DELETE FROM books WHERE email = $1';
      const params = [req.params.id]
      return client.query(sql, params);
    })
    .then((results) => {
      console.log('delete results', results);
      res.redirect('/users')
    })
    .catch(()=> {
      console.log('err', err);
      res.redirect('/books');
    });
};

// Display User update form on GET
exports.user_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: User update GET');
};

// Handle User update on POST
exports.user_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: User update POST');
};
