var mongoose = require('mongoose');

var Blogs = require('./../models/blogs');
const Files = require('./../models/files');

exports.getBlogs = function(callback) {
  Blogs.find({}, (err, blogs) => {
    if(err) {
      return callback(err, null);
    }
    return callback(null, blogs);
  }).populate("cover").sort({createdAt: -1});
}

exports.getArticle = function(id, callback) {
  Blogs.findById(id, (err, blogs) => {
    if(err) {
      return callback(err, null);
    }
    return callback(null, blogs);
  }).populate("cover");
}