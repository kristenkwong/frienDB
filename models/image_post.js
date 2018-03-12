var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImagePostSchema = new Schema ({
  post: {type: Schema.ObjectId, ref: 'Post', required: true},
  link: {type: String, required: true, max: 40}
});

// Export model
module.exports = mongoose.model('ImagePost', ImagePostSchema);
