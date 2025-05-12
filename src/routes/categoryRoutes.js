const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, adminOnly, appOnly } = require('../middleware/auth');

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
router.post('/', protect, adminOnly, async (req, res) => {
  // Create category logic
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  // Update category logic
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  // Delete category logic
});

module.exports = router;