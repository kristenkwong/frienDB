const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');
const {Client} = require('pg'); //newer version of Javascript to get the client

var moment = require('moment');

// Display list of all Post.
exports.post_list = async function(req, res) {

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect();

  try {
    const posts = await client.query('SELECT * FROM post ORDER BY post_date DESC');
    console.log(posts);
    await client.end();
    res.render('post_list', {title: 'Post List', post_list: posts.rows})
  } catch(e) {
    res.render('error', {error: e})
  }

};

function niceDate(date) {
  console.log(date);
  return moment(date).format('MMMM D HH:MM:SS');
}

// Display detail page for a specific Post.
exports.post_detail = async function(req, res) {
  console.log('RETRIEVING DETAILS')
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect()
    .then(() => {
      console.log('connection complete');
      const sql = 'SELECT * FROM post WHERE postid = $1 ORDER BY post_date ASC';
      const params = [req.params.id];
      return client.query(sql, params);
    })
    .then((results) => {
      console.log("results?", results)
      client.end();
      res.render('post_detail', {title: 'Post id ' + req.body.id, post: results.rows[0], date: niceDate(results.rows[0].post_date)})
    })

};

// Display Post create form on GET
exports.post_create_get = function(req, res) {
  res.render('post_form', {title: 'Create New Post'});
};

// Handle Post create for on POST
exports.post_create_post = [

  // Validate fields
  body('username').isLength({min:1}).trim().withMessage('Username is required.'),
  body('text').isLength({min:1}).trim().withMessage('Text is required.'),

  // Sanitize fields
  sanitizeBody('user').trim().escape(),
  sanitizeBody('text').trim().escape(),
  sanitizeBody('city').trim().escape(),
  sanitizeBody('country').trim().escape(),

  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render('post_form', {title: 'Create New Post', post: req.body, errors: errors.array()});
      return;
    }
    else {

      const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true
      });

      client.connect()
      .then(()=> {
        console.log('connection complete');
        //TODO need to check if city/country combinations are in location
        // if not, add tuples into location table as well

        // sql to insert new user into db
        const sql = 'INSERT INTO post (username, post_date, text, image_link, city, country) VALUES ($1, $2, $3, $4, $5, $6)';
        var today = new Date();
        const params = [req.body.username, today, req.body.text, req.body.image, req.body.city, req.body.country];
        return client.query(sql, params);
      })
      .then((results) => {
        res.redirect('/home/posts')
      })
}
    }

]

// Display Post delete form on GET
exports.post_delete_get = function(req,res) {
  res.send('NOT IMPLEMENTED: Post delete GET');
};

// Handle Post delete form on POST
exports.post_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Post delete POST');
};

// Display Post update form on GET
exports.post_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Post update GET');
};

// Handle Post update on POST
exports.post_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Post update POST');
};
