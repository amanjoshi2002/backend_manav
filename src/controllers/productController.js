const Product = require('../models/Product');
const { SubCategory } = require('../models/SubCategory');

function filterProductPrice(product, role) {
  const pricing = product.pricing || {};
  if (role === 'admin') {
    // Admin gets all prices
    return {
      ...product.toObject(),
      pricing: {
        mrp: pricing.mrp ?? null,
        regular: pricing.regular ?? null,
        reseller: pricing.reseller ?? null,
        special: pricing.special ?? null
      }
    };
  }
  // For other roles, always include mrp and the relevant price
  let priceKey = 'regular';
  if (role === 'reseller') priceKey = 'reseller';
  if (role === 'special') priceKey = 'special';
  return {
    ...product.toObject(),
    pricing: {
      mrp: pricing.mrp ?? null,
      [priceKey]: pricing[priceKey] ?? null
    }
  };
}

const productController = {
  // Create new product
  create: async (req, res) => {
    try {
      // Fetch subcategory and populate category
      const subCategory = await SubCategory.findById(req.body.subCategoryId).populate('category');
      if (!subCategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
      }
      if (!subCategory.category || !subCategory.category._id) {
        return res.status(400).json({ message: 'Subcategory does not have a valid category reference' });
      }

      const subSubCategory = subCategory.subCategories.id(req.body.subSubCategoryId);
      if (!subSubCategory) {
        return res.status(404).json({ message: 'Sub-subcategory not found' });
      }

      // Parse JSON string fields if needed
      let pricing = req.body.pricing;
      if (typeof pricing === "string") {
        try { pricing = JSON.parse(pricing); } catch { pricing = {}; }
      }
      let sizes = req.body.sizes;
      if (typeof sizes === "string") {
        try { sizes = JSON.parse(sizes); } catch { sizes = []; }
      }
      let colors = req.body.colors;
      if (typeof colors === "string") {
        try { colors = JSON.parse(colors); } catch { colors = []; }
      }
      let dynamicFields = req.body.dynamicFields;
      if (typeof dynamicFields === "string") {
        try { dynamicFields = JSON.parse(dynamicFields); } catch { dynamicFields = {}; }
      }

      // Handle main product images
      let imageUrls = [];
      if (req.files && req.files.images) {
        imageUrls = req.files.images.map(file => file.location || file.path);
      }

      // Handle color images: colorImages-0, colorImages-1, ...
      colors = Array.isArray(colors) ? colors : [];
      colors.forEach((color, idx) => {
        const fieldName = `colorImages-${idx}`;
        if (req.files && req.files[fieldName]) {
          color.images = req.files[fieldName].map(file => file.location || file.path);
        }
      });

      // Fix: set categoryId from populated subCategory.category._id
      const product = new Product({
        name: req.body.name,
        categoryId: subCategory.category?._id, // <-- Fix here
        subCategoryId: req.body.subCategoryId,
        subSubCategoryId: req.body.subSubCategoryId,
        pricing: pricing,
        description: req.body.description,
        colors: colors,
        sizes: sizes,
        dynamicFields: dynamicFields,
        images: imageUrls,
        stock: req.body.stock,
        isActive: req.body.isActive
      });

      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      console.error('Product Create Error:', error);
      console.error('Request Body:', req.body);
      console.error('Request Files:', req.files);
      res.status(400).json({ message: error.message });
    }
  },

  // Get all products
  getAll: async (req, res) => {
    try {
      const products = await Product.find({ isActive: true })
        .populate('subCategoryId', 'name');
      const role = req.user?.role || 'regular';
      const filtered = products.map(p => filterProductPrice(p, role));
      res.json(filtered);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get products by category
  getByCategory: async (req, res) => {
    try {
      const products = await Product.find({
        categoryId: req.params.category,
        isActive: true
      }).populate('subCategoryId', 'name');
      const role = req.user?.role || 'regular';
      const filtered = products.map(p => filterProductPrice(p, role));
      res.json(filtered);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get products by subcategory
  getBySubCategory: async (req, res) => {
    try {
      const products = await Product.find({
        subCategoryId: req.params.subCategoryId,
        isActive: true
      }).populate('subCategoryId', 'name');
      const role = req.user?.role || 'regular';
      const filtered = products.map(p => filterProductPrice(p, role));
      res.json(filtered);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get products by sub-subcategory
  getBySubSubCategory: async (req, res) => {
    try {
      const products = await Product.find({
        subCategoryId: req.params.subCategoryId,
        subSubCategoryId: req.params.subSubCategoryId,
        isActive: true
      }).populate('subCategoryId', 'name');
      const role = req.user?.role || 'regular';
      const filtered = products.map(p => filterProductPrice(p, role));
      res.json(filtered);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get single product
  getById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
        .populate('subCategoryId', 'name');
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      const role = req.user?.role || 'regular';
      res.json(filterProductPrice(product, role));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update product
  update: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // If changing sub-subcategory, verify it exists
      if (req.body.subSubCategoryId && req.body.subSubCategoryId !== product.subSubCategoryId.toString()) {
        const subCategory = await SubCategory.findById(req.body.subCategoryId || product.subCategoryId);
        if (!subCategory) {
          return res.status(404).json({ message: 'Subcategory not found' });
        }

        const subSubCategory = subCategory.subCategories.id(req.body.subSubCategoryId);
        if (!subSubCategory) {
          return res.status(404).json({ message: 'Sub-subcategory not found' });
        }
      }

      // Handle main product images
      if (req.files && req.files.images) {
        req.body.images = req.files.images.map(file => file.location || file.path);
      }

      // Handle color images: colorImages-0, colorImages-1, ...
      let colors = req.body.colors || [];
      if (typeof colors === 'string') {
        colors = JSON.parse(colors);
      }
      colors = Array.isArray(colors) ? colors : [];

      colors.forEach((color, idx) => {
        const fieldName = `colorImages-${idx}`;
        if (req.files && req.files[fieldName]) {
          color.images = req.files[fieldName].map(file => file.location || file.path);
        }
      });

      // Parse JSON string fields
      let pricing = req.body.pricing;
      if (typeof pricing === "string") {
        pricing = JSON.parse(pricing);
      }
      let sizes = req.body.sizes;
      if (typeof sizes === "string") {
        sizes = JSON.parse(sizes);
      }
      let dynamicFields = req.body.dynamicFields;
      if (typeof dynamicFields === "string") {
        dynamicFields = JSON.parse(dynamicFields);
      }

      req.body.colors = colors;
      req.body.pricing = pricing;
      req.body.sizes = sizes;
      req.body.dynamicFields = dynamicFields;

      Object.keys(req.body).forEach(key => {
        product[key] = req.body[key];
      });

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } catch (error) {
      console.error('Product Update Error:', error);
      console.error('Request Body:', req.body);
      console.error('Request Files:', req.files);
      res.status(400).json({ message: error.message });
    }
  },

  // Delete product (soft delete)
  delete: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      product.isActive = false;
      await product.save();
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = productController;