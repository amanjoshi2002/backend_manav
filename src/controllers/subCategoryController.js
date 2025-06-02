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
      const subCategories = await SubCategory.find({
        $or: [
          { categoryId: categoryId },
          { category: categoryId }
        ]
      });
      res.json(subCategories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get specific subcategory with its sub-subcategories
  getById: async (req, res) => {
    try {
      const subCategory = await SubCategory.findById(req.params.id);
      if (!subCategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
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
      subCategory.subCategories.id(req.params.subId).isActive = false;
      await subCategory.save();
      res.json({ message: 'Sub-subcategory deactivated successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all subcategories
  getAllSubCategories: async (req, res) => {
    try {
      const subCategories = await SubCategory.find();
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
  }
};

module.exports = subCategoryController;