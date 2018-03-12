var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LikesSchema = new Schema({
  user: {type: Schema.ObjectId, ref: 'User'},
  post: {type: Schema.ObjectId, ref: 'Post'}
})

module.exports = mongoose.model('Likes', LikesSchema);
