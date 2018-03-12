// TODO: remove mongoose and change to POSTGRES

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FriendsWithSchema = new Schema ({
  email_1: {type: Schema.ObjectId, ref: 'User', required: true},
  email_2: {type: Schema.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('FriendsWith', FriendsWithSchema);
