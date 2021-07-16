var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fileSchema = new Schema({
  url: {
    type: String
  }
});

module.exports = mongoose.model('UploadFile', fileSchema, 'upload_file');