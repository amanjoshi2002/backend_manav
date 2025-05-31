const Category = require('../models/Category');

const categoryController = {
  // Create a new category
  create: async (req, res) => {
    try {
      const { name, description } = req.body;
      const image = req.file ? req.file.location : null; // S3 URL for the uploaded image

      const category = new Category({
        name,
        description,
        image
      });

      const savedCategory = await category.save();
      res.status(201).json(savedCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all categories
  getAll: async (req, res) => {
    try {
      const categories = await Category.find({ isActive: true });
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a single category by ID
  getById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update a category
  update: async (req, res) => {
    try {
      const { name, description } = req.body;
      const image = req.file ? req.file.location : null; // S3 URL for the uploaded image

      const updatedData = {
        name,
        description
      };

      if (image) {
        updatedData.image = image; // Update the image if a new one is uploaded
      }

      const category = await Category.findByIdAndUpdate(req.params.id, updatedData, { new: true });
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.status(200).json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a category (soft delete)
  delete: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      category.isActive = false; // Soft delete by marking as inactive
      await category.save();

      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = categoryController;