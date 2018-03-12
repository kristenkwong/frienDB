// TODO replace with postgres

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema ({
  user: {type: Schema.ObjectId, ref: 'User', required: true}, //reference to associated User -> need to change to email if sql
  date: {type: Date, default: Date.now},
  lat: {type: Number},
  long: {type: Number}
});

PostSchema
.virtual('url')
.get(function() {
  return '/post/' + this._id;
})

module.exports = mongoose.model('Post', PostSchema);
