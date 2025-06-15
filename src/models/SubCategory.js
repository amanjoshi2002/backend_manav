const mongoose = require('mongoose');

// Schema for attributes (brands, materials, etc.)
const attributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['brand', 'material', 'size', 'color', 'style', 'other']
  },
  image: String,
  description: String,
  isActive: {
    type: Boolean,
    default: true
  }
});

// Schema for sub-subcategories
const subSubCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  image: String, // S3 image URL will be stored here
  // Optionally reference Category here if needed:
  // category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  // Attributes specific to this sub-subcategory (like specific brands or materials)
  attributes: [attributeSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  // Add visibility controls for each user type
  showForCustomer: {
    type: Boolean,
    default: true
  },
  showForReseller: {
    type: Boolean,
    default: true
  },
  showForReseller1: {
    type: Boolean,
    default: true
  },
  showForReseller2: {
    type: Boolean,
    default: true
  },
  showForReseller3: {
    type: Boolean,
    default: true
  },
  showForReseller4: {
    type: Boolean,
    default: true
  },
  showForReseller5: {
    type: Boolean,
    default: true
  },
  showForReseller6: {
    type: Boolean,
    default: true
  },
  showForSpecial: {
    type: Boolean,
    default: true
  }
});

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  description: String,
  image: String, // S3 image URL will be stored here
  // Common attributes that apply to all sub-subcategories
  commonAttributes: [attributeSchema],
  // Sub-subcategories array
  subCategories: [subSubCategorySchema],
  isActive: {
    type: Boolean,
    default: true
  },
  // Add visibility controls for each user type
  showForCustomer: {
    type: Boolean,
    default: true
  },
  showForReseller: {
    type: Boolean,
    default: true
  },
  showForReseller1: {
    type: Boolean,
    default: true
  },
  showForReseller2: {
    type: Boolean,
    default: true
  },
  showForReseller3: {
    type: Boolean,
    default: true
  },
  showForReseller4: {
    type: Boolean,
    default: true
  },
  showForReseller5: {
    type: Boolean,
    default: true
  },
  showForReseller6: {
    type: Boolean,
    default: true
  },
  showForSpecial: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Export only the model now
module.exports = {
  SubCategory: mongoose.model('SubCategory', subCategorySchema)
};