const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true
  },
  image: {
    type: String // S3 image URL
  }
});

module.exports = mongoose.model('Category', categorySchema);