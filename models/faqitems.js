var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var faqItemsSchema = new Schema({
  question: {
    type: String,
    unique: false
  },
  answer: {
    type: String
  }
});

module.exports = mongoose.model('FaqItems', faqItemsSchema, 'faq_items');