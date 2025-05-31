const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, adminOnly, appOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', appOnly, async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.location : undefined; // S3 URL

    const category = new Category({ name, description, image });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  // Update category logic
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  // Delete category logic
});

module.exports = router;