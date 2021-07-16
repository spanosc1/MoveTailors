var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var queriesSchema = new Schema({
  from: {
    type: String
  },
  to: {
    type: String
  },
  email: {
    type: String
  }
});

module.exports = mongoose.model('Queries', queriesSchema, 'queries');