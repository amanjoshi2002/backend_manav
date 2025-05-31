const express = require('express');
const router = express.Router();
const { protect, adminOnly, staffOnly } = require('../middleware/auth');
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

// Public routes - Flutter app
router.get('/', protect, productController.getAll);
router.get('/:id', protect, productController.getById);
router.get('/category/:category', protect, productController.getByCategory);
router.get('/subcategory/:subCategoryId', protect, productController.getBySubCategory);
router.get('/subcategory/:subCategoryId/sub/:subSubCategoryId', protect, productController.getBySubSubCategory);

// Staff routes
router.post('/', protect, staffOnly, productController.create); // Staff creates a product
router.put('/:id', protect, staffOnly, productController.update); // Staff updates a product

// Admin routes - Next.js admin panel
router.put('/:id/approve', protect, adminOnly, productController.approveProduct); // Admin approves/rejects a product
router.get('/pending-rejected', protect, adminOnly, productController.getPendingAndRejectedProducts); // Admin fetches pending/rejected products

module.exports = router;