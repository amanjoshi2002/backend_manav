const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');
const { protect, adminOnly, appOnly } = require('../middleware/auth');
const upload = require('../middleware/upload'); // S3 upload middleware

// Public routes
router.get('/category/:category', protect, appOnly, subCategoryController.getByCategory);
router.get('/:id', protect, appOnly, subCategoryController.getById);

// New route to get all subcategories
router.get('/', protect, (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return adminOnly(req, res, next);
  }
  return appOnly(req, res, next);
}, subCategoryController.getAllSubCategories);

// Admin routes
router.post('/', protect, adminOnly, upload.single('image'), subCategoryController.create); // Add image upload for subcategory creation
router.post('/:id/sub', protect, adminOnly, subCategoryController.addSubSubCategory);
router.put('/:id/sub/:subId', protect, adminOnly, subCategoryController.updateSubSubCategory);
router.put('/:id', protect, adminOnly, upload.single('image'), subCategoryController.update); // Add image upload for subcategory update
router.delete('/:id/sub/:subId', protect, adminOnly, subCategoryController.deleteSubSubCategory);

module.exports = router;