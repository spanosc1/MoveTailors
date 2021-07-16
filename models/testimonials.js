var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var testimonialSchema = new Schema({
  name: {
    type: String
  },
  body: {
    type: String
  }
});

module.exports = mongoose.model('Testimonials', testimonialSchema, 'testimonials');