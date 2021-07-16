var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var homeSchema = new Schema({
  MainTitle: {
    type: String
  },
  SubTitle: {
    type: String
  },
  GetQuoteHeader: {
    type: String
  },
  GetQuoteSubText: {
    type: String
  },
  GetQuoteButtonText: {
    type: String
  },
  MainBody: {
    type: String
  },
  MainInBorders: {
    type: String
  },
  ProcessHeader: {
    type: String
  },
  PromiseHeader: {
    type: String
  },
  PromiseText: {
    type: String
  },
  OfferHeader: {
    type: String
  },
  OfferText: {
    type: String
  },
  FirstStepTitle: {
    type: String
  },
  FirstStepDescription: {
    type: String
  },
  FirstStepBody: {
    type: String
  },
  FirstStepImg1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadFile'
  },
  FirstStepImg2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadFile'
  },
  SecondStepTitle: {
    type: String
  },
  SecondStepDescription: {
    type: String
  },
  SecondStepBody: {
    type: String
  },
  SecondStepImg1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadFile'
  },
  SecondStepImg2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadFile'
  },
  ThirdStepTitle: {
    type: String
  },
  ThirdStepDescription: {
    type: String
  },
  ThirdStepBody: {
    type: String
  },
  ThirdStepImg1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadFile'
  },
  ThirdStepImg2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadFile'
  },
  FourthStepTitle: {
    type: String
  },
  FourthStepDescription: {
    type: String
  },
  FourthStepBody: {
    type: String
  },
  FourthStepImg1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadFile'
  },
  FourthStepImg2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadFile'
  },
  testimonials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Testimonials'
  }],
  MainHeader: {
    type: String
  }
});

module.exports = mongoose.model('Homes', homeSchema, 'homes');