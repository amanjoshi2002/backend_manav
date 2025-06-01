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

// Accept main images and dynamic color images
const productUploadFields = [
  { name: 'images', maxCount: 10 },
  // Accept up to 10 colors, each with up to 10 images
  ...Array.from({ length: 10 }).map((_, idx) => ({
    name: `colorImages-${idx}`,
    maxCount: 10
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