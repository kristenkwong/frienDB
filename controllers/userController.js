var User = require('../models/user');
var Tag = require('../models/tag');
var Post = require('../models/post')

var async = require('async');

// Display index of site
exports.index = function(req, res) {
  async.parallel({
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
  });
};

// Display list of all Users.
exports.user_list = function(req, res) {
  // TODO change to SQL from NoSQL
  User.find({}, 'first_name family_name')
  .exec(function(err, list_authors) {
    if (err) {return next(err);}
    // Successful, so render
    res.render('user_list', { title: 'User List', user_list: list_authors});
  });
};

// Display detail page for a specific User.
exports.user_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: User detail page: ' + req.params.id);
};

// Display User create form on GET
exports.user_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: User create GET')
};

// Handle User create for on POST
exports.user_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: User create POST');
};

// Display User delete form on GET
exports.user_delete_get = function(req,res) {
  res.send('NOT IMPLEMENTED: User delete GET');
};

// Handle User delete form on POST
exports.user_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: User delete POST');
};

// Display User update form on GET
exports.user_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: User update GET');
};

// Handle User update on POST
exports.user_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: User update POST');
};
