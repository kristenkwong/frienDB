//var Post = require('../models/post'); this was for mongo

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

// Display list of all Post.
exports.post_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Post list GET')
};

// Display detail page for a specific Post.
exports.post_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Post detail GET')
};

// Display Post create form on GET
exports.post_create_get = function(req, res) {
  // TODO the form isn't done
  res.render('post_form', {title: 'Create Post'});
};

// Handle Post create for on POST
exports.post_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Post create GET')
}

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
