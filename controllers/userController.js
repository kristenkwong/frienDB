const {Client} = require('pg'); //newer version of Javascript to get the client
const {Pool} = require('pg');
const pool = new Pool();

var async = require('async');
var dotenv = require('dotenv');
var moment = require('moment');
dotenv.load(); //load environmental variables

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

const location_controller = require('../controllers/locationController')

// Display index of site
exports.index = async function(req, res) {

  var result = {};
  result.users_result = [];
  result.posts_result = [];

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect();

  try {
    const users = await client.query('SELECT * FROM users ORDER BY username ASC;');
    const posts = await client.query('SELECT * FROM post ORDER BY post_date DESC;');
    await client.end();

    result.users_result = users.rows;
    result.posts_result = posts.rows;
  } catch (e) {
    console.log(e);
    res.render('error', {error: e});
  }

  res.render('index', {users: result.users_result, posts: result.posts_result})

};

// Display list of all Users.
exports.user_list = function(req, res) {

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect() //this is async so we need promises
    .then(() => {
      console.log("connected");
      return client.query('SELECT * FROM users ORDER BY username ASC');
    })
    .then((results) => {
      console.log('results?', results);
      client.end();
      res.render('user_list', {title: 'User List', user_list: results.rows});
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Something bad happened');
    })

};

// Formats birthday to look nicer
function birthday(date) {
  //console.log("date:", date);
  return moment(date).format('MMMM D');
};

// Calculate age based on current time
function userAge(date) {
  if (date == null) {
    return;
  }
  console.log("calculating age")
  var ageDifference = Date.now() - date.getTime();
  var ageDate = new Date(ageDifference);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// Display detail page for a specific User.
exports.user_detail = async function(req, res) {

  var result = {};
  result.user_result = [];
  result.posts_result = [];

  console.log("RETRIEVING DETAILS FOR " + req.params.id);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect();

  try {
    const sql_user = 'SELECT * FROM users WHERE username = $1;';
    const sql_posts = 'SELECT * FROM post WHERE username = $1;';
    const params = [req.params.id];
    const user = await client.query(sql_user, params);
    const posts = await client.query(sql_posts, params);
    await client.end();

    if (user.rows[0]) {
      result.user_result = user.rows[0];
    } else {
      const err = new Error('User not found');
      res.render('error', {message: "Whoops! User @" + req.params.id + " doesn't exist.", error: err});
      return;
    }
    console.log(result.user_result);
    result.posts_result = posts.rows;
    console.log(result.posts_result);
  } catch (e) {
    console.log(e);
  }

  res.render('user_detail', {title: req.params.id, user: result.user_result, birthday: birthday(result.user_result.birthdate), age: userAge(result.user_result.birthdate), posts: result.posts_result});

};

// Display User create form on GET
exports.user_create_get = function(req, res) {
  res.render('user_form', {title: 'Create New User'});
};

// return true if the user with the username already exists
async function checkIfUserExists(value) {

  console.log("value", value)

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  })

  client.connect()
    .then(() => {
      const sql = "SELECT * FROM users WHERE username='" + value + "';";
      console.log(sql);
      return client.query(sql);
    })
    .then((result) => {
      client.end();
      console.log(result.rowCount != 0);
      if (result.rowCount != 0) {
        console.log("return true");
        return true;
      } else {
        console.log("return false")
        return false;
      }
    })
}
// Handle User create for on POST
exports.user_create_post = [

  // TODO: add check for when the username already exists

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
  sanitizeBody('lives_city').trim().escape(),
  sanitizeBody('lives_country').trim().escape(),
  sanitizeBody('born_city').trim().escape(),
  sanitizeBody('born_country').trim().escape(),

  // Process request after validation and sanitization
  async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render('user_form', {title: 'Create New User', user: req.body, errors: errors.array()});
      return;
    }

    else if ((req.body.lives_city == '' || req.body.lives_country == '') && ((req.body.lives_city == '' && req.body.lives_country == '') != true)) {
      res.render('user_form', {title: 'Create New User', user: req.body, db_error: 'If you choose to use a location, you must input both a city and a country'});
    }

    else if ((req.body.born_city == '' || req.body.born_country == '') && ((req.body.born_city == '' && req.body.born_country == '') != true)) {
      res.render('user_form', {title: 'Create New User', user: req.body, db_error: 'If you choose to use a location, you must input both a city and a country'});
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

      try {
        await client.connect();

        // sql to insert new user into db
        const sql = 'INSERT INTO users (username, password, first_name, last_name, gender, birthdate, born_city, born_country, lives_city, lives_country) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
        const params = [req.body.username, req.body.password, req.body.first_name, req.body.last_name, req.body.gender, req.body.birthdate, req.body.born_city, req.body.born_country, req.body.lives_city, req.body.lives_country];

        console.log(params);

        // this thing checks if any of the form values are empty
        // if they are empty, set them to null to avoid broke constraints in db
        for (i = 0; i < params.length; i++) {
          if (params[i] == '') {
            params[i] = null;
          }
        }

        // if location tuples do not exist yet, add them to the table
        if (params[6] && params[7]) {
          await location_controller.checkIfLocationExists(res, params[6], params[7]);
        }
        if (params[8], params[9]) {
          await location_controller.checkIfLocationExists(res, params[8], params[9]);
        }

        await client.query(sql, params);
        await client.end();
        res.redirect('/home/user/' + req.body.username);

      } catch (e) {
        res.render('error', {error: e});
      }
    }
  }
];

// Display User delete form on GET
exports.user_delete_get = function(req,res) {
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
      client.end();
      res.redirect('/home/users')
    })
    .catch((err) => {
      res.redirect('/books')
    })
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
      client.end();
      res.redirect('/home/users')
    })
    .catch((err) => {
      res.redirect('/books')
    })
};

// Display User update form on GET
exports.user_update_get = function(req, res) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect()
    .then(() => {
      const sql = 'SELECT * FROM users WHERE username = $1;';
      const params = [req.params.id];
      return client.query(sql, params);
    })
    .then((results) => {
      console.log('Results?', results);
      client.end();
      res.render('user_edit', {
        user: results.rows[0]
      });
    })
    .catch((err) => {
      console.log('edit get err', err);
      res.redirect('/home/users/')
    });
};

// Handle User update on POST
exports.user_update_post = function(req, res) {
  res.redirect('/home/user/' + req.params.id)
};
