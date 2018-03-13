var Post = require('../models/post');

// Display list of all Post.
exports.post_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Post list');
};

// Display detail page for a specific Post.
exports.post_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Post detail page: ' + req.params.id);
};

// Display Post create form on GET
exports.post_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Post create GET')
};

// Handle Post create for on POST
exports.post_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Post create POST');
};

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
