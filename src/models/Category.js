const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['apparels', 'trophies', 'corporate_gifts', 'personalised_gifts']
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Category', categorySchema);