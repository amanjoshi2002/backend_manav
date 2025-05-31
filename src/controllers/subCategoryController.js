const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');

const subCategoryController = {
  // Create new subcategory with image upload
  create: async (req, res) => {
    try {
      const { name, categoryId, description } = req.body;
      const image = req.file ? req.file.location : null; // S3 URL for the uploaded image

      // Ensure the category exists
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      const subCategory = new SubCategory({
        name,
        categoryId,
        description,
        image
      });

      const savedSubCategory = await subCategory.save();
      res.status(201).json(savedSubCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update subcategory with image upload
  update: async (req, res) => {
    try {
      const { name, categoryId, description } = req.body;
      const image = req.file ? req.file.location : null;

      // Ensure the category exists if categoryId is provided
      if (categoryId) {
        const category = await Category.findById(categoryId);
        if (!category) {
          return res.status(404).json({ message: 'Category not found' });
        }
      }

      const updatedData = {
        name,
        categoryId,
        description
      };

      if (image) {
        updatedData.image = image; // Update the image if a new one is uploaded
      }

      const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, updatedData, { new: true });
      if (!subCategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
      }

      res.json(subCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all subcategories by main category
  getByCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;

      const subCategories = await SubCategory.find({
        categoryId,
        isActive: true
      }).populate('categoryId', 'name'); // Populate category name
      res.json(subCategories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get specific subcategory with its sub-subcategories
  getById: async (req, res) => {
    try {
      const subCategory = await SubCategory.findById(req.params.id).populate('categoryId', 'name');
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
      subCategory.subCategories.push(req.body);
      const updatedSubCategory = await subCategory.save();
      res.json(updatedSubCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update sub-subcategory
  updateSubSubCategory: async (req, res) => {
    try {
      const subCategory = await SubCategory.findOneAndUpdate(
        {
          '_id': req.params.id,
          'subCategories._id': req.params.subId
        },
        {
          $set: {
            'subCategories.$': req.body
          }
        },
        { new: true }
      );
      if (!subCategory) {
        return res.status(404).json({ message: 'Subcategory or sub-subcategory not found' });
      }
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
      const subCategories = await SubCategory.find().populate('categoryId', 'name');
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