var User = require('../models/user');

// Display index of site
exports.index = function(req, res) {
  res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of all Users.
exports.user_list = function(req, res) {
  res.send('NOT IMPLEMENTED: User list');
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
