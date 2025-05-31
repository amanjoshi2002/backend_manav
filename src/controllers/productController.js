const Product = require('../models/Product');

const { SubCategory } = require('../models/SubCategory');

const productController = {
  // Create new product
  create: async (req, res) => {
    try {
      // Parse JSON fields if they are sent as strings
      if (typeof req.body.colors === 'string') {
        req.body.colors = JSON.parse(req.body.colors);
      }
      if (typeof req.body.dynamicFields === 'string') {
        req.body.dynamicFields = JSON.parse(req.body.dynamicFields);
      }

      // Ensure pricing fields are present
      if (!req.body.pricing || !req.body.pricing.reseller) {
        return res.status(400).json({ message: 'Pricing.reseller is required' });
      }

      // Handle images
      const images = req.files ? req.files.map(file => file.location) : [];

      // Create the product
      const product = new Product({
        name: req.body.name,
        categoryId: req.body.categoryId,
        subCategoryId: req.body.subCategoryId,
        subSubCategoryId: req.body.subSubCategoryId,
        pricing: req.body.pricing,
        description: req.body.description,
        colors: req.body.colors || [],
        sizes: req.body.sizes || [],
        dynamicFields: req.body.dynamicFields || {},
        images,
      });

      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all products
  getAll: async (req, res) => {
    try {
      const products = await Product.find({ isActive: true })
        .populate('subCategoryId', 'name');
      res.json(products);
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
      res.json(products);
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
      res.json(products);
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
      res.json(products);
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
      res.json(product);
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

      Object.keys(req.body).forEach(key => {
        product[key] = req.body[key];
      });

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } catch (error) {
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