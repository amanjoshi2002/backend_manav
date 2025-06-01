const express = require('express');
const router = express.Router();
const { protect, adminOnly, appOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const categoryController = require('../controllers/categoryController');

// Public routes
router.get('/', categoryController.listCategories);

// Admin routes
router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  categoryController.createCategory
);

router.put(
  '/:id',
  protect,
  adminOnly,
  upload.single('image'),
  categoryController.updateCategory
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  categoryController.deleteCategory
);

module.exports = router;