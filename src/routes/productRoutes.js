const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, adminOnly, appOnly, authorize } = require('../middleware/auth');

// Public routes - Flutter app
router.get('/', protect, appOnly, productController.getAll);
router.get('/:id', protect, appOnly, productController.getById);
router.get('/category/:category', protect, appOnly, productController.getByCategory);
router.get('/subcategory/:subCategoryId', protect, appOnly, productController.getBySubCategory);
router.get('/subcategory/:subCategoryId/sub/:subSubCategoryId', protect, appOnly, productController.getBySubSubCategory);

// Admin routes - Next.js admin panel
router.post('/', protect, adminOnly, productController.create);
router.put('/:id', protect, adminOnly, productController.update);
router.delete('/:id', protect, adminOnly, productController.delete);

module.exports = router;