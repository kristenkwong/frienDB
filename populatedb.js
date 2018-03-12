// TODO: we need to change this when we actually populate our postgres database

console.log('This script populates the database.')

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async');
var FriendsWith = require('./models/friends_with');
var ImagePost = require('./models/image_post');
var Likes = require('./models/likes');
var Location = require('./models/location');
var Post = require('./models/post');
var Tag = require('./models/tag');
var Tagged = require('./models/tagged');
var TextPost = require('./models/text_post');
var User = require('./models/user');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var posts = [];
var tags = [];
var users = [];

function userCreate(email, password, first_name, family_name, gender, birthdate, born_lat, born_long, lives_lat, lives_long, cb) {
  userdetail = {email: email, password: password, first_name: first_name, family_name: family_name};
  if (gender != false) userdetail.gender = gender;
  if (birthdate != false) userdetail.birthdate = birthdate;
  if (born_lat != false) userdetail.born_lat = born_lat;
  if (born_long != false) userdetail.born_long = born_long;
  if (lives_lat != false) userdetail.lives_lat = lives_lat;
  if (lives_long != false) userdetail.lives_long = lives_long;

  var user = new User(userdetail);

  user.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New User: ' + user);
    users.push(user);
    cb(null, user);
  });
}

function tagCreate(text, cb) {
  tagdetail = {text: text};
  var tag = new Tag(tagdetail);

  tag.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Tag: ' + tag);
    tags.push(tag);
    cb(null, tag);
  });
}

function postCreate(user, date, lat, long, cb) {
  postdetail = {
    user: user,
    date: date
  }
  if (lat != false) postdetail.lat = lat;
  if (long != false) postdetail.long = long;

  var post = new Post(postdetail);

  post.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Post: ' + post);
    posts.push(post);
    cb(null, post);
  });
}

function createUsers(cb) {
  async.parallel ([
    function(callback) {
      userCreate('kristen@gmail.com', 'password', 'Kristen', 'Kwong', 'Female', '1997-02-05', 49.2827, 123.1207, 49.2827, 123.1207, callback)
    },
  function(callback) {
    userCreate('milton@hotmail.com', 'password', 'Milton', 'Leung', 'Male', false, false, false, false, false, callback);
  },],
cb);
}

function createTags(cb) {
  async.parallel ([
    function(callback) {
      tagCreate('#tgif', callback)
    },
    function(callback) {
      tagCreate('#ootd', callback);
    },],
cb);
}

function createPosts(cb) {
  async.parallel ([
    function(callback) {
      postCreate(users[0], '2018-03-12', false, false, callback);
    },
    function(callback) {
      postCreate(users[1], '2017-04-08', 49.2827, 123.1207, callback)
    },],
cb);
}

async.series([
  createUsers,
  createTags,
  createPosts
],
// Optional callback
function(err, results) {
  if (err) {
    console.log('FINAL ERR: ' + err);
  }
  else {
    console.log('Posts: ' + posts);
  }
  mongoose.connection.close();
});
