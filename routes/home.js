var express = require('express');
var router = express.Router();

// Require controller modules.
var user_controller = require('../controllers/userController');
var post_controller = require('../controllers/postController');
var tag_controller = require('../controllers/tagController');
var location_controller = require('../controllers/locationController');
var query_controller = require('../controllers/queryController');
var login_controller = require('../controllers/loginController');

/// USER ROUTES ///

// GET home page
router.get('/', user_controller.index);

/// ADMIN PAGES ///

// GET request for Admin page
router.get('/user/admin', function (req, res) {
  res.render('admin');
});

// POST request for Admin page
router.post('/user/admin', function (req, res) {
  res.render('admin');
});

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

// GEt request for adding user as friend
router.get('/user/:id/add-friend', user_controller.user_addfriend);

// GET request for adding user as friend
router.get('/user/:id/remove-friend', user_controller.user_removefriend);

/// TAG ROUTES ///

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

// POST request for adding user as friend
router.get('/post/:id/like', post_controller.post_like);

// POST request for adding user as friend
router.get('/post/:id/unlike', post_controller.post_unlike);

/// LOCATION ROUTES ///

// GET request for list of location.
router.get('/locations', location_controller.location_list);

router.get('/location/:city/:country', location_controller.location_get);

/// QUERY ROUTES ///

// GET request for Selection
router.get('/selection', query_controller.selection_get);

// POST request for selection
router.post('/selection', query_controller.selection_post);

// GET request for Join
router.get('/join', query_controller.join_get);

// POST request for Join
router.post('/join', query_controller.join_post);

// GET request for Division
router.get('/division', query_controller.division_get);

// GET request for Division - Users
router.post('/division/users', query_controller.division_post_users);

// POST request for Division - Users
router.post('/division/users', function (req, res) {
  res.redirect('/home/division')
});

// GET request for Division - Users
router.post('/division/locations', query_controller.division_post_locations);

// POST request for Division - Users
router.post('/division/locations', function (req, res) {
  res.redirect('/home/division')
});

// GET request for Aggregation
router.get('/aggregation', query_controller.aggregation_get);

// POST request for Aggregation
//router.post('/aggregation', query_controller.aggregation_post);

// GET request for aggregation avg/min/max function
router.get('/aggregation/avgminmax', query_controller.aggregation_post_avgminmax);

// GET request for aggregation count function
router.get('/aggregation/count', query_controller.aggregation_post_count);

// POST request for aggregation avg/min/max function
router.post('/aggregation/avgminmax', query_controller.aggregation_post_avgminmax);

// POST request for aggregation count function
router.post('/aggregation/count', query_controller.aggregation_post_count);

// GET request for Nested Aggregation
router.get('/nested-aggregation', query_controller.nested_aggregation_get);

// POST request for Nested Aggregation – this is after the second submit
//router.post('/nested-aggregation', query_controller.nested_aggregation_post);

// GET request for Nested Aggregation
router.get('/nested-aggregation/result_nested', function(req, res) {
  redirect('/home/nested-aggregation');
});

// POST request for Nested Aggregation
router.post('/nested-aggregation/result_nested', query_controller.nested_aggregation_post);

// GET request for Delete
router.get('/delete', query_controller.delete_get);

// POST request for Delete
router.post('/delete', query_controller.delete_post);

// GET request for Update
router.get('/update', query_controller.update_get);

// POST request for Update
router.get('/update', query_controller.update_post);


/// LOGIN CONTROLLER ///

// GET request for Login
router.get('/login', login_controller.login_get);

// GET request for Login
router.post('/login', login_controller.login_post);

// GET request for Logout
router.get('/logout', login_controller.logout_get);

// GET request for Logout
router.post('/logout', login_controller.logout_post);


module.exports = router;
