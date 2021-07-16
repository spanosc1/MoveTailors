var mongoose = require('mongoose');

var Landings = require('../models/landings');
const Files = require('./../models/files');

exports.getLanding = function(url, callback) {
  Landings.findOne({URL: url}, (err, landing) => {
    if(err) {
      return callback(err, null);
    }
    return callback(null, landing);
  })
  .populate("Carousel");
}