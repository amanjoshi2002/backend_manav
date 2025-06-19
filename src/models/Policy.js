const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String, // Can be plain text or HTML/Markdown
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Policy', policySchema);
