const express = require('express');
const router = express.Router();
const { protect, adminOnly, staffOnly } = require('../middleware/auth');
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

// Public routes - Flutter app
router.get('/pending-rejected', protect, adminOnly, productController.getPendingAndRejectedProducts);
router.get('/', protect, productController.getAll);
router.get('/category/:category', protect, productController.getByCategory);
router.get('/subcategory/:subCategoryId', protect, productController.getBySubCategory);
router.get('/subcategory/:subCategoryId/sub/:subSubCategoryId', protect, productController.getBySubSubCategory);
router.get('/:id', protect, productController.getById);

// Staff routes
router.post('/', protect, staffOnly, upload.any(), productController.create);
router.put('/:id', protect, staffOnly, productController.update); // Staff updates a product

// Admin routes - Next.js admin panel
router.put('/:id/approve', protect, adminOnly, productController.approveProduct); // Admin approves/rejects a product

module.exports = router;