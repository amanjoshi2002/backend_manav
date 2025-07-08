const { SubCategory } = require('../models/SubCategory');
const mongoose = require('mongoose');
const subCategoryController = {
  // Create new subcategory with sub-subcategories
  create: async (req, res) => {
    try {
      const data = req.body;
      if (req.file) {
        data.image = req.file.location; // S3 URL
      }
      const subCategory = new SubCategory(data);
      const savedSubCategory = await subCategory.save();
      res.status(201).json(savedSubCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all subcategories by main category
  getByCategory: async (req, res) => {
    try {
      const categoryId = req.params.categoryId; // <-- fix here
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: 'Invalid category id' });
      }
      
      // When querying subcategories by categoryId, check both fields
      let subCategories = await SubCategory.find({
        $or: [
          { categoryId: categoryId },
          { category: categoryId }
        ]
      });

      // Filter based on user role
      if (req.user && req.user.role !== 'admin') {
        const userRole = req.user.role;
        const roleField = `showFor${userRole.charAt(0).toUpperCase() + userRole.slice(1)}`;
        
        subCategories = subCategories.filter(subcat => {
          // Check if subcategory is visible for this role
          if (!subcat[roleField]) return false;
          
          // Filter sub-subcategories within each subcategory
          subcat.subCategories = subcat.subCategories.filter(subSubcat => {
            return subSubcat[roleField] !== false;
          });
          
          return true;
        });
      }

      res.json(subCategories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get specific subcategory with its sub-subcategories
  getById: async (req, res) => {
    try {
      let subCategory = await SubCategory.findById(req.params.id);
      if (!subCategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
      }

      // Filter based on user role
      if (req.user && req.user.role !== 'admin') {
        const userRole = req.user.role;
        const roleField = `showFor${userRole.charAt(0).toUpperCase() + userRole.slice(1)}`;
        
        // Check if subcategory is visible for this role
        if (!subCategory[roleField]) {
          return res.status(404).json({ message: 'Subcategory not found' });
        }
        
        // Filter sub-subcategories
        subCategory.subCategories = subCategory.subCategories.filter(subSubcat => {
          return subSubcat[roleField] !== false;
        });
      }

      res.json(subCategory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add new sub-subcategory to existing subcategory
  addSubSubCategory: async (req, res) => {
    try {
      const subCategory = await SubCategory.findById(req.params.id);
      if (!subCategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
      }
      const subSubCat = req.body;
      if (req.file) {
        subSubCat.image = req.file.location; // S3 URL
      }
      subCategory.subCategories.push(subSubCat);
      const updatedSubCategory = await subCategory.save();
      res.json(updatedSubCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update sub-subcategory
  updateSubSubCategory: async (req, res) => {
    try {
      const subCategory = await SubCategory.findById(req.params.id);
      if (!subCategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
      }
      const subSubCat = subCategory.subCategories.id(req.params.subId);
      if (!subSubCat) {
        return res.status(404).json({ message: 'Sub-subcategory not found' });
      }
      Object.assign(subSubCat, req.body);
      if (req.file) {
        subSubCat.image = req.file.location; // S3 URL
      }
      await subCategory.save();
      res.json(subCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete sub-subcategory
 deleteSubSubCategory: async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    // Remove sub-subcategory by _id
    const before = subCategory.subCategories.length;
    subCategory.subCategories = subCategory.subCategories.filter(
      (sub) => sub._id.toString() !== req.params.subId
    );
    if (subCategory.subCategories.length === before) {
      return res.status(404).json({ message: 'Sub-subcategory not found' });
    }
    await subCategory.save();
    res.json({ message: 'Sub-subcategory deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
},

  // Get all subcategories
  getAllSubCategories: async (req, res) => {
    try {
      let subCategories = await SubCategory.find();
      
      // Filter based on user role
      if (req.user && req.user.role !== 'admin') {
        const userRole = req.user.role;
        const roleField = `showFor${userRole.charAt(0).toUpperCase() + userRole.slice(1)}`;
        
        subCategories = subCategories.filter(subcat => {
          // Check if subcategory is visible for this role
          if (!subcat[roleField]) return false;
          
          // Filter sub-subcategories within each subcategory
          subcat.subCategories = subcat.subCategories.filter(subSubcat => {
            return subSubcat[roleField] !== false;
          });
          
          return true;
        });
      }

      res.status(200).json({
        success: true,
        data: subCategories
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Update main subcategory
  update: async (req, res) => {
    try {
      const data = req.body;
      if (req.file) {
        data.image = req.file.location; // S3 URL
      }
      
      const subCategory = await SubCategory.findByIdAndUpdate(
        req.params.id, 
        data, 
        { new: true, runValidators: true }
      );
      
      if (!subCategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
      }
      
      res.json(subCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete main subcategory
  delete: async (req, res) => {
    try {
      const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
      
      if (!subCategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
      }
      
      res.json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = subCategoryController;