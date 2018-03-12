// TODO replace with postgres

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema ({
  text: {type: String, required: true, max: 20}
})

TagSchema
.virtual('url')
.get(function() {
  return '/tag/' + this.text;
})

// Export model
module.exports = mongoose.model('Tag', TagSchema);
