const Category = require('../models/Category');

// List active categories
exports.listCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const image = req.file ? req.file.location : undefined;
    const category = new Category({
      name,
      description,
      isActive,
      image
    });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing category
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const updateData = { name, description, isActive };
    if (req.file) {
      updateData.image = req.file.location;
    }
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
