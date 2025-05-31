const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  categoryId: {
    type: String,
    enum: ['apparels', 'trophies', 'corporate_gifts', 'personalised_gifts'],
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
    images: [String]
  }],
  sizes: [String],
  dynamicFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  images: [
    {
      type: String, // S3 URL of the product image
    }
  ],
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