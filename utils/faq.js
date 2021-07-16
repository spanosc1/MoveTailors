var mongoose = require('mongoose');

var FAQs = require('./../models/faqcategories');
var FAQItems = require('./../models/faqitems');

exports.getFAQs = function(callback) {
  FAQs.find({}, (err, faqs) => {
    if(err) {
      return callback(err, null);
    }
    return callback(null, faqs);
  }).populate('faq_items');
}