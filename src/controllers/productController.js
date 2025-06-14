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
        customer: pricing.customer ?? null,
        reseller: pricing.reseller ?? null,
        special: pricing.special ?? null
      }
    };
  }
  // For other roles, always include mrp and the relevant price
  let priceKey = 'customer';
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

      // Debug: Log ALL incoming fields
      console.log('Full request body:', req.body);

      // Ensure booleans for showFor* fields with proper conversion
      const showForCustomer = req.body.showForCustomer === 'true' || req.body.showForCustomer === true;
      const showForReseller = req.body.showForReseller === 'true' || req.body.showForReseller === true;
      const showForSpecial = req.body.showForSpecial === 'true' || req.body.showForSpecial === true;
      // If field is missing (checkbox not checked), treat as false
      const showForCustomerFinal = req.body.showForCustomer !== undefined ? showForCustomer : false;
      const showForResellerFinal = req.body.showForReseller !== undefined ? showForReseller : false;
      const showForSpecialFinal = req.body.showForSpecial !== undefined ? showForSpecial : false;
      const isActive = req.body.isActive === 'true' || req.body.isActive === true;

      // Convert stock to number and set isAvailable based on stock
      const stock = Number(req.body.stock) || 0;
      const isAvailable = stock > 0;

      // Debug log
      console.log('Creating product with all boolean fields:', {
        showForCustomer,
        showForReseller,
        showForSpecial,
        isActive,
        stock,
        isAvailable
      });

      // Fix: set categoryId from populated subCategory.category._id
      const product = new Product({
        name: req.body.name,
        categoryId: subCategory.category?._id,
        subCategoryId: req.body.subCategoryId,
        subSubCategoryId: req.body.subSubCategoryId,
        gst: req.body.gst,
        pricing: pricing,
        description: req.body.description,
        colors: colors,
        sizes: sizes,
        dynamicFields: dynamicFields,
        images: imageUrls,
        stock: stock,
        isAvailable: isAvailable,
        isActive: isActive,
        showForCustomer: showForCustomerFinal,
        showForReseller: showForResellerFinal,
        showForSpecial: showForSpecialFinal
      });

      const savedProduct = await product.save();
      console.log('Product saved with all fields:', {
        showForCustomer: savedProduct.showForCustomer,
        showForReseller: savedProduct.showForReseller,
        showForSpecial: savedProduct.showForSpecial,
        isActive: savedProduct.isActive,
        stock: savedProduct.stock,
        isAvailable: savedProduct.isAvailable
      });
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
      const role = req.user?.role || 'customer';
      // Build visibility filter
      let visibilityFilter = { isActive: true };
      if (role === 'customer') visibilityFilter.showForCustomer = true;
      if (role === 'reseller') visibilityFilter.showForReseller = true;
      if (role === 'special') visibilityFilter.showForSpecial = true;

      const products = await Product.find(visibilityFilter)
        .populate('subCategoryId', 'name');
      const filtered = products.map(p => filterProductPrice(p, role));
      res.json(filtered);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get products by category
  getByCategory: async (req, res) => {
    try {
      const role = req.user?.role || 'customer';
      let visibilityFilter = { categoryId: req.params.category, isActive: true };
      if (role === 'customer') visibilityFilter.showForCustomer = true;
      if (role === 'reseller') visibilityFilter.showForReseller = true;
      if (role === 'special') visibilityFilter.showForSpecial = true;

      const products = await Product.find(visibilityFilter)
        .populate('subCategoryId', 'name');
      const filtered = products.map(p => filterProductPrice(p, role));
      res.json(filtered);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get products by subcategory
  getBySubCategory: async (req, res) => {
    try {
      const role = req.user?.role || 'customer';
      let visibilityFilter = { subCategoryId: req.params.subCategoryId, isActive: true };
      if (role === 'customer') visibilityFilter.showForCustomer = true;
      if (role === 'reseller') visibilityFilter.showForReseller = true;
      if (role === 'special') visibilityFilter.showForSpecial = true;

      const products = await Product.find(visibilityFilter)
        .populate('subCategoryId', 'name');
      const filtered = products.map(p => filterProductPrice(p, role));
      res.json(filtered);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get products by sub-subcategory
  getBySubSubCategory: async (req, res) => {
    try {
      const role = req.user?.role || 'customer';
      let visibilityFilter = {
        subCategoryId: req.params.subCategoryId,
        subSubCategoryId: req.params.subSubCategoryId,
        isActive: true
      };
      if (role === 'customer') visibilityFilter.showForCustomer = true;
      if (role === 'reseller') visibilityFilter.showForReseller = true;
      if (role === 'special') visibilityFilter.showForSpecial = true;

      const products = await Product.find(visibilityFilter)
        .populate('subCategoryId', 'name');
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
      const role = req.user?.role || 'customer';
      // Check visibility for the user type
      if (
        (role === 'customer' && !product.showForCustomer) ||
        (role === 'reseller' && !product.showForReseller) ||
        (role === 'special' && !product.showForSpecial)
      ) {
        return res.status(403).json({ message: 'Product not available for your user type' });
      }
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

      // Debug: Log what we received
      console.log('Full update request body:', req.body);
      // Log the relevant fields for debugging
      console.log('showForCustomer:', req.body.showForCustomer, 'showForReseller:', req.body.showForReseller, 'showForSpecial:', req.body.showForSpecial);

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

      // Fix: Explicitly handle all boolean and numeric fields
      if (req.body.gst !== undefined) {
        req.body.gst = Number(req.body.gst);
      }

      if (req.body.stock !== undefined) {
        req.body.stock = Number(req.body.stock);
        // Also update isAvailable based on stock
        req.body.isAvailable = req.body.stock > 0;
      }

      // Handle boolean fields explicitly
      if (req.body.showForCustomer !== undefined) {
        req.body.showForCustomer = req.body.showForCustomer === 'true' || req.body.showForCustomer === true;
      } else {
        // Do not overwrite if not present
        delete req.body.showForCustomer;
      }
      if (req.body.showForReseller !== undefined) {
        req.body.showForReseller = req.body.showForReseller === 'true' || req.body.showForReseller === true;
      } else {
        delete req.body.showForReseller;
      }
      if (req.body.showForSpecial !== undefined) {
        req.body.showForSpecial = req.body.showForSpecial === 'true' || req.body.showForSpecial === true;
      } else {
        delete req.body.showForSpecial;
      }
      if (req.body.isActive !== undefined) {
        req.body.isActive = req.body.isActive === 'true' || req.body.isActive === true;
      }

      // Debug: Log converted values
      console.log('Converted all values:', {
        showForCustomer: req.body.showForCustomer,
        showForReseller: req.body.showForReseller,
        showForSpecial: req.body.showForSpecial,
        isActive: req.body.isActive,
        stock: req.body.stock,
        isAvailable: req.body.isAvailable
      });

      // Update fields one by one to ensure they're set
      Object.keys(req.body).forEach(key => {
        if (req.body[key] !== undefined) {
          product[key] = req.body[key];
        }
      });

      const updatedProduct = await product.save();
      
      // Debug: Log what was actually saved
      console.log('Product updated - final values:', {
        showForCustomer: updatedProduct.showForCustomer,
        showForReseller: updatedProduct.showForReseller,
        showForSpecial: updatedProduct.showForSpecial,
        isActive: updatedProduct.isActive,
        stock: updatedProduct.stock,
        isAvailable: updatedProduct.isAvailable,
        _id: updatedProduct._id
      });
      
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