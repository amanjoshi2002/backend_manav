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
  gst: {
    type: Number,
    required: false,
    default: 0
  },
  pricing: {
    mrp: {
      type: Number,
      required: true
    },
    customer: {
      type: Number,
      required: true
    },
    reseller: {
      type: Number,
      required: true
    },
    reseller1: {
      type: Number,
      required: true
    },
    reseller2: {
      type: Number,
      required: true
    },
    reseller3: {
      type: Number,
      required: true
    },
    reseller4: {
      type: Number,
      required: true
    },
    reseller5: {
      type: Number,
      required: true
    },
    reseller6: {
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
  stock: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
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

module.exports = mongoose.model('Product', productSchema);