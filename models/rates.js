var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ratesSchema = new Schema({
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  rate40HC: {
    type: Number,
    required: true
  },
  fromCountryCode: {
    type: String,
    required: true
  },
  toCountryCode: {
    type: String,
    required: true
  },
  shippingTimeMin: {
    type: Number
  },
  shippingTimeMax: {
    type: Number
  },
  grossProfit20: {
    type: Number
  },
  grossProfit40: {
    type: Number
  },
  grossProfit40HC: {
    type: Number
  },
  rate40: {
    type: Number,
    required: true
  },
  rate20: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Rates', ratesSchema, 'shipping_rates');