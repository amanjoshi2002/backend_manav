const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload'); // S3 upload middleware

// Public routes
router.get('/', categoryController.getAll); // Get all active categories
router.get('/:id', categoryController.getById); // Get a single category by ID

// Admin routes
router.post('/', protect, adminOnly, upload.single('image'), categoryController.create); // Create a new category with image upload
router.put('/:id', protect, adminOnly, upload.single('image'), categoryController.update); // Update a category with image upload
router.delete('/:id', protect, adminOnly, categoryController.delete); // Soft delete a category

module.exports = router;