var mongoose = require('mongoose');

var Homes = require('../models/homes');
const Files = require('./../models/files');
const Testimonials = require('./../models/testimonials');

exports.getHome = function(callback) {
  Homes.find({}, (err, home) => {
    if(err) {
      return callback(err, null);
    }
    return callback(null, home[0]);
  })
  .populate("FirstStepImg1")
  .populate("FirstStepImg2")
  .populate("SecondStepImg1")
  .populate("SecondStepImg2")
  .populate("ThirdStepImg1")
  .populate("ThirdStepImg2")
  .populate("FourthStepImg1")
  .populate("FourthStepImg2")
  .populate("testimonials");

}