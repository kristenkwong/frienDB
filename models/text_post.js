var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TextPostSchema = new Schema ({
  post: {type: Schema.ObjectId, ref: 'Post', required: true},
  content: {type: String, max: 240}
});

module.exports = mongoose.model('TextPost', TextPostSchema);
