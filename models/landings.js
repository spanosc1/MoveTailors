var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var landingSchema = new Schema({
  URL: {
    type: String
  },
  Header: {
    type: String
  },
  Description: {
    type: String
  },
  Carousel: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadFile'
  }]
});

module.exports = mongoose.model('Landings', landingSchema, 'landings');