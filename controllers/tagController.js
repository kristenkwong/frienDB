var Tag = require('../models/tag');

// Display list of all Tags.
exports.tag_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Tag list GET')
};

// Display detail page for a specific Tag.
exports.tag_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Tag detail page: ' + req.params.id);
};

// Display Tag create form on GET
exports.tag_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Tag create GET')
};

// Handle Tag create for on POST
exports.tag_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Tag create POST');
};

// Display Tag delete form on GET
exports.tag_delete_get = function(req,res) {
  res.send('NOT IMPLEMENTED: Tag delete GET');
};

// Handle Tag delete form on POST
exports.tag_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Tag delete POST');
};

// Display Tag update form on GET
exports.tag_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Tag update GET');
};

// Handle Tag update on POST
exports.tag_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Tag update POST');
};
