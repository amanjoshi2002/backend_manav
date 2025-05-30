const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  pdfLink: {
    type: String,
    required: true
  },
  image: String,
  description: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Pdf', pdfSchema);