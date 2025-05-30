const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  videoLink: {
    type: String,
    required: true
  },
  image: String,
  description: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Video', videoSchema);