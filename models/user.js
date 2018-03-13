// TODO: remove mongoose
var mongoose = require('mongoose');

var moment = require('moment'); // this is for date formatting

var Schema = mongoose.Schema;

var UserSchema = new Schema ({
  email: {type: String, required: true, max: 100},
  password: {type: String, required: true, max: 100},
  first_name: {type: String, required: true, max: 100},
  family_name: {type: String, required: true, max: 100},
  gender: {type: String, enum: ['Female', 'Male', 'Other']},
  birthdate: {type: Date},
  born_lat: {type: Number},
  born_long: {type: Number},
  lives_lat: {type: Number},
  lives_long: {type: Number}
});

// Virtual for User's full name
UserSchema
.virtual('name')
.get(function() {
  var full_name = this.first_name + ' ' + this.family_name;
  return full_name;
});

// Virtual for User's URL
UserSchema
.virtual('url')
.get(function() {
  return '/home/user/' + this._id;
});

UserSchema
.virtual('birthday_formatted')
.get(function() {
  return moment(this.birthdate).format('MMMM D');
});

// Export model
module.exports = mongoose.model('User', UserSchema);
