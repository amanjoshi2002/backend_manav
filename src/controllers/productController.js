const Product = require('../models/Product');
const { SubCategory } = require('../models/SubCategory');

const productController = {
  // Create new product
  create: async (req, res) => {
    try {
      console.log('Request body:', req.body); // Debug log

      // Initialize default values
      const productData = {
        name: req.body.name,
        categoryId: req.body.categoryId,
        subCategoryId: req.body.subCategoryId,
        subSubCategoryId: req.body.subSubCategoryId,
        pricing: req.body.pricing,
        description: req.body.description || '',
        colors: [],
        sizes: [],
        dynamicFields: {},
        images: [],
        createdBy: req.user.id,
        approvalStatus: req.user.role === 'admin' ? 'approved' : 'pending'
      };

      // Parse JSON fields if they are sent as strings
      if (req.body.colors) {
        try {
          productData.colors = typeof req.body.colors === 'string' 
            ? JSON.parse(req.body.colors) 
            : req.body.colors;
        } catch (e) {
          console.log('Error parsing colors:', e);
          productData.colors = [];
        }
      }

      if (req.body.sizes) {
        try {
          productData.sizes = typeof req.body.sizes === 'string'
            ? JSON.parse(req.body.sizes)
            : req.body.sizes;
        } catch (e) {
          console.log('Error parsing sizes:', e);
          productData.sizes = [];
        }
      }

      if (req.body.dynamicFields) {
        try {
          productData.dynamicFields = typeof req.body.dynamicFields === 'string'
            ? JSON.parse(req.body.dynamicFields)
            : req.body.dynamicFields;
        } catch (e) {
          console.log('Error parsing dynamicFields:', e);
          productData.dynamicFields = {};
        }
      }

      if (req.body.pricing) {
        try {
          productData.pricing = typeof req.body.pricing === 'string'
            ? JSON.parse(req.body.pricing)
            : req.body.pricing;
        } catch (e) {
          console.log('Error parsing pricing:', e);
          return res.status(400).json({ message: 'Invalid pricing format' });
        }
      }

      // Ensure pricing fields are present
      if (!productData.pricing || !productData.pricing.reseller) {
        return res.status(400).json({ message: 'Pricing.reseller is required' });
      }

      // Handle images
      if (req.files) {
        productData.images = req.files.map(file => file.location);
      }

      // Create the product
      const product = new Product(productData);
      const savedProduct = await product.save();

      res.status(201).json({
        success: true,
        message: productData.approvalStatus === 'approved' ? 'Product created successfully' : 'Product created and sent for approval',
        product: savedProduct
      });
    } catch (error) {
      console.log('Error in create product:', error); // Debug log
      res.status(400).json({ success: false, message: error.message });
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

      const { name, categoryId, subCategoryId, description, pricing, images } = req.body;

      const approvalStatus = req.user.role === 'admin' ? 'approved' : 'pending';

      const updatedData = {
        name,
        categoryId,
        subCategoryId,
        description,
        pricing,
        images,
        updatedBy: req.user.id,
        approvalStatus
      };

      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
      res.status(200).json({
        success: true,
        message: approvalStatus === 'approved' ? 'Product updated successfully' : 'Product updated and sent for approval',
        product: updatedProduct
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Approve or reject a product (Admin only)
  approveProduct: async (req, res) => {
    try {
      const { approvalStatus } = req.body;

      if (!['approved', 'rejected'].includes(approvalStatus)) {
        return res.status(400).json({ success: false, message: 'Invalid approval status' });
      }

      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      product.approvalStatus = approvalStatus;
      await product.save();

      res.status(200).json({
        success: true,
        message: `Product ${approvalStatus} successfully`,
        product
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Get all approved products
  getApprovedProducts: async (req, res) => {
    try {
      const products = await Product.find({ approvalStatus: 'approved', isActive: true });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get pending and rejected products
  getPendingAndRejectedProducts: async (req, res) => {
    try {
      const products = await Product.find({
        approvalStatus: { $in: ['pending', 'rejected'] },
        isActive: true
      }).populate('categoryId', 'name').populate('subCategoryId', 'name').populate('subSubCategoryId', 'name');

      res.status(200).json({
        success: true,
        products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
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