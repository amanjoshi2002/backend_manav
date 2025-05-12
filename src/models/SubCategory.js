const mongoose = require('mongoose');

// Define fixed categories as an enum
const CATEGORIES = {
  APPARELS: 'apparels',
  TROPHIES: 'trophies',
  CORPORATE_GIFTS: 'corporate_gifts',
  PERSONALISED_GIFTS: 'personalised_gifts'
};

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
  image: String,
  // Attributes specific to this sub-subcategory (like specific brands or materials)
  attributes: [attributeSchema],
  isActive: {
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
    type: String,
    enum: Object.values(CATEGORIES),
    required: true
  },
  description: String,
  image: String,
  // Common attributes that apply to all sub-subcategories
  commonAttributes: [attributeSchema],
  // Sub-subcategories array
  subCategories: [subSubCategorySchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Export both the model and categories enum
module.exports = {
  SubCategory: mongoose.model('SubCategory', subCategorySchema),
  CATEGORIES
};