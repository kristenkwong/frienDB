var Tag = require('../models/tag');

// Display list of all Tags.
exports.tag_list = function(req, res) {
  Tag.find()
  .sort([['text', 'ascending']])
  .exec(function(err, list_tags) {
    if (err) {return next(err);}
    // Successful, so render
    res.render('tag_list', {title: 'Tag List', tag_list: list_tags});
  });
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
