var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var faqCategoriesSchema = new Schema({
  title: {
    type: String
  },
  faq_items: [
    {
      type: Schema.Types.ObjectId,
      ref: 'FaqItems'
    }
  ]
});

module.exports = mongoose.model('FaqCategories', faqCategoriesSchema, 'faq_categories');