//var Post = require('../models/post'); this was for mongo

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

// Display list of all Post.
exports.post_list = function(req, res) {
  Post.find()
  .populate('user')
  .sort([['date', 'descending']])
  .exec(function(err, list_posts) {
    if (err) {return next(err)};
    // Successful, so render
    res.render('post_list', {title: 'Post List', post_list: list_posts});
  });
};

// Display detail page for a specific Post.
exports.post_detail = function(req, res) {
  Post.findById(req.params.id)
  .populate('user')
  .exec(function(err, post) {
    if (err) { return next(err); }
    if (post == null) { //no results
      var err = new Error('Post not found.')
      err.status = 404;
      return next(err);
    }
    // Successful, so render
    res.render('post_detail', {title: 'Post', post: post})
  })
};

// Display Post create form on GET
exports.post_create_get = function(req, res) {
  res.render('post_form', {title: 'Create Post'});
};

// Handle Post create for on POST
exports.post_create_post = [

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
