var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  body: {
    type: String
  },
  author: {
    type: String
  },
  date: {
    type: Date
  },
  cover: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadFile'
  }
});

module.exports = mongoose.model('Blogs', blogSchema, 'blogs');