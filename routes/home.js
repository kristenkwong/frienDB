var express = require('express');
var router = express.Router();

// Require controller modules.
var user_controller = require('../controllers/userController');
var post_controller = require('../controllers/postController');
var tag_controller = require('../controllers/tagController');
var location_controller = require('../controllers/locationController');

/// USER ROUTES ///

// GET home page
router.get('/', user_controller.index);

// GET request for creating a user.
// NOTE: this must come before routes that display the Book since this uses the id.
router.get('/user/create', user_controller.user_create_get);

// POST request for creating a user.
router.post('/user/create', user_controller.user_create_post);

// GET request to delete user.
router.get('/user/:id/delete', user_controller.user_delete_get);

// POST request to delete user.
router.post('/user/:id/delete', user_controller.user_delete_post);

// GET request to update user.
router.get('/user/:id/update', user_controller.user_update_get);

// POST request to update user
router.post('/user/:id/update', user_controller.user_update_post);

// GET request for one user
router.get('/user/:id', user_controller.user_detail);

// GET request for list of users.
router.get('/users', user_controller.user_list);

/// TAG ROUTES ///

// GET request for creating a tag.
router.get('/tag/create', tag_controller.tag_create_get);

// POST request for creating a tag.
router.post('/tag/create', tag_controller.tag_create_post);

// GET request to delete tag.
router.get('/tag/:id/delete', tag_controller.tag_delete_get);

// POST request to delete tag.
router.post('/tag/:id/delete', tag_controller.tag_delete_post);

// GET request to update tag.
router.get('/tag/:id/update', tag_controller.tag_update_get);

// POST request to update tag
router.post('/tag/:id/update', tag_controller.tag_update_post);

// GET request for one tag
router.get('/tag/:id', tag_controller.tag_detail);

// GET request for list of tag.
router.get('/tags', tag_controller.tag_list);

/// POST ROUTES ///

// GET request for creating a post.
router.get('/post/create', post_controller.post_create_get);

// POST request for creating a post.
router.post('/post/create', post_controller.post_create_post);

// GET request to delete post.
router.get('/post/:id/delete', post_controller.post_delete_get);

// POST request to delete post.
router.post('/post/:id/delete', post_controller.post_delete_post);

// GET request to update post.
router.get('/post/:id/edit', post_controller.post_update_get);

// POST request to update post
router.post('/post/:id/edit', post_controller.post_update_post);

// GET request for one post
router.get('/post/:id', post_controller.post_detail);

// GET request for list of post.
router.get('/posts', post_controller.post_list);

/// LOCATION ROUTES ///

// GET request for list of location.
router.get('/locations', location_controller.location_list);

module.exports = router;
