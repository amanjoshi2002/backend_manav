const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true
  },
  subSubCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  pricing: {
    mrp: {
      type: Number,
      required: true
    },
    regular: {
      type: Number,
      required: true
    },
    reseller: {
      type: Number,
      required: true
    },
    special: {
      type: Number,
      required: true
    }
  },
  description: String,
  colors: [{
    name: String,
    images: [String] // S3 URLs
  }],
  sizes: [String],
  dynamicFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  images: [String], // S3 or local URLs
  isAvailable: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);