var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movesSchema = new Schema({
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  fromPlaceID: {
    type: String,
    required: true
  },
  toPlaceID: {
    type: String,
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
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  fromLatLng: {
    type: JSON,
    required: true
  },
  toLatLng: {
    type: JSON,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  container: {
    type: String,
    required: true
  },
  containerIndex: {
    type: Number
  },
  originPort: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Port'
  },
  destPort: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Port'
  },
  minDays: {
    type: Number,
    required: true
  },
  maxDays: {
    type: Number,
    required: true
  },
  max20: {
    type: Number,
    required: true
  },
  max40: {
    type: Number,
    required: true
  },
  max40HC: {
    type: Number,
    required: true
  },
  distToOriginPort: {
    type: Number
  },
  distFromDestPort: {
    type: Number
  },
  originPortName: {
    type: String
  },
  destPortName: {
    type: String
  },
  booked: {
    type: Boolean,
    default: false,
    required: true
  },
  platformUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Platform_User'
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  paid: {
    type: Boolean,
    required: true
  }
},
{
  timestamps: true
});

//TODO: Add paid field (or tie it to booked)

module.exports = mongoose.model('Moves', movesSchema, 'moves');