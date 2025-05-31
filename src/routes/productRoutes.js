const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes - Flutter app
router.get('/', protect, productController.getAll);
router.get('/:id', protect, productController.getById);
router.get('/category/:category', protect, productController.getByCategory);
router.get('/subcategory/:subCategoryId', protect, productController.getBySubCategory);
router.get('/subcategory/:subCategoryId/sub/:subSubCategoryId', protect, productController.getBySubSubCategory);

// Admin routes - Next.js admin panel
// For multiple images (up to 10)
router.post('/', protect, adminOnly, upload.array('images', 10), productController.create);
router.put('/:id', protect, adminOnly, productController.update);
router.delete('/:id', protect, adminOnly, productController.delete);

module.exports = router;