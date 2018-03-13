// TODO change this to Postgres when it's implemented
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LocationSchema = new Schema ({
  lat: {type: Number, required: true},
  long: {type: Number, required: true}
});

module.exports = mongoose.model('Location', LocationSchema);
