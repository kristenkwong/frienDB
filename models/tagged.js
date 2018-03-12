// TODO replace with POSTGRES

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaggedSchema = new Schema ({
  tag: {type: Schema.ObjectId, ref: 'Tag', required: true},
  post: {type: Schema.ObjectId, ref: 'Post', required: true}
});

module.exports = mongoose.model('Tagged', TaggedSchema);
