const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');
const {Client} = require('pg'); //newer version of Javascript to get the client

var moment = require('moment');
const location_controller = require('../controllers/locationController')
const tag_controller = require('../controllers/tagController')
const login_controller = require('../controllers/loginController')

// Display list of all Post.
exports.post_list = async function(req, res) {

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect();

  try {
    const posts = await client.query('SELECT * FROM post ORDER BY post_date DESC');
    const postsTags = await Promise.all(posts.rows.map(async (post) => {
      let tags = await tag_controller.tagsForPost(post.postid)
      tags = tags.map(tag => {
        return tag.tag_text;
      })
      return {post: post, tags: tags};
    }));
    await client.end();
    res.render('post_list', {title: 'Post List', postTag_list: postsTags})
  } catch(e) {
    res.render('error', {error: e})
  }

};

function niceDate(date) {
  console.log(date);
  return moment(date).format('MMMM D HH:MM:SS');
}

async function post_liked (req, res, postid) {
  // return true or false flag to indicate if the post has already been liked by the current user_result
  const curr_user = login_controller.get_user();

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect();

  try {
    const sql = 'SELECT * FROM likes where username = $1 and postid = $2;'
    const params = [curr_user, postid];
    const result = await client.query(sql, params);
    await client.end();

    if (result.rowCount != 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    res.render('error', {error: err})
  }
}

async function return_likers (req, res, postid) {
  // return all usernames who have liked the post
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect();

  try {
    const sql = 'SELECT username FROM likes WHERE postid = $1;'
    const params = [postid]
    const result = await client.query(sql, params);
    await client.end();
    console.log('likers', result.rows)
    return result.rows;
  } catch (err) {
    res.render('error', {error: err})
  }
}

// Display detail page for a specific Post.
exports.post_detail = async function(req, res) {

  const curr_user = login_controller.get_user();

  const likers = await return_likers(req, res, req.params.id);
  console.log(likers);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect();
  try {
    const liked_flag = await post_liked(req, res, req.params.id)
    const post = await client.query('SELECT * FROM post WHERE postid = $1 ORDER BY post_date ASC', [req.params.id]);
    let tags = await tag_controller.tagsForPost(post.rows[0].postid);
    tags = tags.map(tag => {
      return tag.tag_text;
    })
    console.log(tags);
    await client.end();
    res.render('post_detail', {title: 'Post id ' + req.params.id, post: post.rows[0], tags: tags, date: niceDate(post.rows[0].post_date), curr_user: curr_user, liked_flag: liked_flag, likers: likers})
  } catch(e) {
    res.render('error', {error: e})
  }

};

// Display Post create form on GET
exports.post_create_get = function(req, res) {

  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

  const curr_user = localStorage.getItem('user');

  res.render('post_form', {title: 'Create New Post', curr_user: curr_user});
};

// Return true if the location tuple already exists in the location table
// Else create new tuple
async function checkIfLocationExists2(res, city, country) {

  var result = {};
  result.location_get = [];
  result.location_set = [];

  console.log("location: ", city, country);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  })

  client.connect();

  try {
    const sql = "SELECT * FROM location WHERE city = $1 and country = $2;";
    params = [city, country];
    console.log(sql, params);
    result.location_get = await client.query(sql, params);

    if (result.location_get.rowCount == 0) { // location tuple was not found

      const sql = "INSERT INTO location (city, country) VALUES ($1, $2);";
      params = [city, country];
      console.log("Inserting tuple: ", sql, params);
      result.location_set = await client.query(sql, params);
      console.log("Inserted tuple: ", result.location_set.rows)
    }

    await client.end();
  } catch (e) {
    res.render('error', {error: e});
  }

  console.log("Result of location query", result.location_get);
  console.log("Number of tuples found: ", result.location_get.rowCount);
  console.log((result.location_get.rowCount ==0));

  return result;
}

// Handle Post create for on POST
exports.post_create_post = [

  // Validate fields
  //body('text').isLength({min:1}).trim().withMessage('Text is required.'),

  // Sanitize fields
  sanitizeBody('user').trim().escape(),
  sanitizeBody('text').trim(),
  sanitizeBody('city').trim().escape(),
  sanitizeBody('country').trim().escape(),
  sanitizeBody('tags').trim().escape(),

  async (req, res, next) => {

    if (typeof localStorage === "undefined" || localStorage === null) {
      var LocalStorage = require('node-localstorage').LocalStorage;
      localStorage = new LocalStorage('./scratch');
    }

    const curr_user = localStorage.getItem('user');

    // Extract the validation errors from a request
    const errors = validationResult(req);

    var results = {};
    results.post_result = [];

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render('post_form', {title: 'Create New Post', curr_user: curr_user, post: req.body, errors: errors.array()});
      return;
    }
    else {

      try {

        if ((req.body.city == '' || req.body.country == '') && ((req.body.city == '' && req.body.country == '') != true)) {
          res.render('post_form', {title: 'Create New Post', post: req.body, db_error: 'If you choose to use a location, you must input both a city and a country', curr_user: curr_user});
        }

        const client = new Client({
          connectionString: process.env.DATABASE_URL,
          ssl: true
        });

        client.connect();

        const sql = 'INSERT INTO post (username, post_date, text, image_link, city, country) VALUES ($1, $2, $3, $4, $5, $6);';
        var today = new Date().toISOString().slice(0, 19).replace('T', ' ');
        console.log(today);

        var params = [];

        if (curr_user == 'admin') { //if admin, get the username from the form
          params = [req.body.username, today, req.body.text, req.body.image, req.body.city, req.body.country];
        } else { //if not admin, get currently logged in user
          params = [curr_user, today, req.body.text, req.body.image, req.body.city, req.body.country];
        }

        for (i = 0; i < params.length; i++) {
          if (params[i] == '') {
            params[i] = null;
          }
        }

        if (params[4] && params[5]) {
          await location_controller.checkIfLocationExists(res, params[4], params[5]);
        }

        const post = await client.query(sql, params);
        await client.end();

        results.post_result = post.rows;
      } catch (e) {
        res.render('post_form', {title: 'Create New Post', post: req.body, db_error: e, curr_user: curr_user});
        console.log(e);
      }

      res.redirect('/home/posts');
    }}
]

// Display Post delete form on GET
exports.post_delete_get = function(req,res) {

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect()
    .then(()=> {
      const sql = 'DELETE FROM post WHERE postid = $1;';
      const params = [req.params.id]
      return client.query(sql, params);
    })
    .then((results) => {
      console.log('delete results', results);
      client.end();
      res.redirect('/home/posts')
    })
    .catch((err) => {
      res.render('error', {error: err})
    })
};

// Handle Post delete form on POST
exports.post_delete_post = function(req, res) {
  res.redirect('/home/posts');
};

// Display Post update form on GET
exports.post_update_get = async function(req, res) {

  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

  const curr_user = await localStorage.getItem('user');
  console.log(curr_user)

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect()
    .then(() => {
      const sql = 'SELECT * FROM post WHERE postid = $1;';
      const params = [req.params.id];
      return client.query(sql, params);
    })
    .then((results) => {
      console.log('Results?', results);
      client.end();
      res.render('post_edit', {
        title: 'Edit Post',
        post: results.rows[0],
        curr_user: curr_user
      });
    })
    .catch((err) => {
      console.log('edit get err', err);
      res.render('post_edit', {error: err, curr_user: curr_user});
    });
};

// Handle Post update on POST
exports.post_update_post = function(req, res) {
  // Sanitize fields
  sanitizeBody('user').trim().escape(),
  sanitizeBody('text').trim(),
  sanitizeBody('city').trim().escape(),
  sanitizeBody('country').trim().escape(),
  sanitizeBody('tags').trim().escape(),

  async (req, res, next) => {

    if (typeof localStorage === "undefined" || localStorage === null) {
      var LocalStorage = require('node-localstorage').LocalStorage;
      localStorage = new LocalStorage('./scratch');
    }

    const curr_user = localStorage.getItem('user');

    // Extract the validation errors from a request
    const errors = validationResult(req);

    var results = {};
    results.post_result = [];

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render('post_form', {title: 'Edit Post', curr_user: curr_user, post: req.body, errors: errors.array()});
      return;
    }
    else {

      try {

        if ((req.body.city == '' || req.body.country == '') && ((req.body.city == '' && req.body.country == '') != true)) {
          res.render('post_form', {title: 'Edit Post', post: req.body, db_error: 'If you choose to use a location, you must input both a city and a country', curr_user: curr_user});
        }

        const client = new Client({
          connectionString: process.env.DATABASE_URL,
          ssl: true
        });

        client.connect();

        const sql = 'UPDATE post SET username = $1, text = $2, image_link = $3, city = $4, country = $5;';
        var today = new Date().toISOString().slice(0, 19).replace('T', ' ');

        var params = [];

        if (curr_user == 'admin') { //if admin, get the username from the form
          params = [req.body.username, req.body.text, req.body.image, req.body.city, req.body.country];
        } else { //if not admin, get currently logged in user
          params = [curr_user, req.body.text, req.body.image, req.body.city, req.body.country];
        }

        for (i = 0; i < params.length; i++) {
          if (params[i] == '') {
            params[i] = null;
          }
        }

        if (params[4] && params[5]) {
          await location_controller.checkIfLocationExists(res, params[4], params[5]);
        }

        const post = await client.query(sql, params);
        await client.end();

        results.post_result = post.rows;
      } catch (e) {
        res.render('post_form', {title: 'Edit Post', post: req.body, db_error: e, curr_user: curr_user});
        console.log(e);
      }

      res.redirect('/home/post/' + req.params.id)
    }}
};

// use ID to create tuple in friends_with table
exports.post_like = async function (req, res) {

  const curr_user = login_controller.get_user();

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  try {
    await client.connect();

    const sql = 'INSERT INTO likes VALUES ($1, $2)';
    const params = [curr_user, req.params.id]
    await client.query(sql, params);
    await client.end();
    res.redirect('/home/post/' + req.params.id)
  } catch (err) {
    res.render('error', {error: err})
  }

}

// use ID to create tuple in friends_with table
exports.post_unlike = async function (req, res) {

  const curr_user = login_controller.get_user();

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  try {
    await client.connect();

    const sql = 'DELETE FROM likes WHERE (username=$1 AND postid=$2)';
    const params = [curr_user, req.params.id]
    await client.query(sql, params);
    await client.end();
    res.redirect('/home/post/' + req.params.id)
  } catch (err) {
    res.render('error', {error: err})
  }

}
