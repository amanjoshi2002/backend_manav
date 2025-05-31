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
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Reference to the Category model
    required: true
  },
  description: String,
  image: String, // S3 URL for the subcategory image
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

module.exports = mongoose.model('SubCategory', subCategorySchema);