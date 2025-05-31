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
    ref: 'SubSubCategory',
    required: true
  },
  pricing: {
    mrp: { type: Number, required: true },
    regular: { type: Number, required: true },
    reseller: { type: Number, required: true },
    special: { type: Number, required: true }
  },
  description: String,
  colors: [
    {
      name: String,
      images: [String] // S3 URLs for color-specific images
    }
  ],
  sizes: [String],
  dynamicFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed // Flexible fields for additional product data
  },
  images: [
    {
      type: String // S3 URLs for product images
    }
  ],
  isAvailable: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'], // Approval workflow
    default: 'approved' // Default to approved for admin actions
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who created the product
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to the user who last updated the product
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);