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

// Add a route to get all products for analytics (without auth for admin panel)
router.get('/all/analytics', productController.getAll);

// Accept main images and dynamic color images
const productUploadFields = [
  { name: 'images', maxCount: 1000 },
  // Accept up to 100 colors, each with up to 1000 images
  ...Array.from({ length: 100 }).map((_, idx) => ({
    name: `colorImages-${idx}`,
    maxCount: 1000
  }))
];

// Admin routes - Next.js admin panel
router.post(
  '/',
  protect,
  adminOnly,
  upload.fields(productUploadFields),
  productController.create
);
router.put(
  '/:id',
  protect,
  adminOnly,
  upload.fields(productUploadFields),
  productController.update
);
router.delete('/:id', protect, adminOnly, productController.delete);

module.exports = router;