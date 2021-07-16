var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var portsSchema = new Schema({
  portName: {
    type: String
  },
  countryCode: {
    type: String
  },
  country: {
    type: String
  },
  servingCountryCode: {
    type: String
  },
  servingCountry: {
    type: String
  },
  googlePlaceID: {
    type: String
  },
  truckingRate: {
    type: Number
  },
  location: {
    type: {
      type: String
    },
    coordinates: {
      type: [Number]
    }
  }
});

module.exports = mongoose.model('Ports', portsSchema, 'ports');