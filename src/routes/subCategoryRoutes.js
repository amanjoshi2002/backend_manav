const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');
const { protect, adminOnly, appOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/category/:categoryId', protect, appOnly, subCategoryController.getByCategory);
router.get('/:id', protect, appOnly, subCategoryController.getById);

// New route to get all subcategories
router.get('/', protect, (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return adminOnly(req, res, next);
  }
  return appOnly(req, res, next);
}, subCategoryController.getAllSubCategories);

// Admin routes for main subcategories
router.post('/', protect, adminOnly, upload.single('image'), subCategoryController.create);
router.put('/:id', protect, adminOnly, upload.single('image'), subCategoryController.update);
router.delete('/:id', protect, adminOnly, subCategoryController.delete);

// Admin routes for sub-subcategories
router.post('/:id/sub', protect, adminOnly, upload.single('image'), subCategoryController.addSubSubCategory);
router.put('/:id/sub/:subId', protect, adminOnly, upload.single('image'), subCategoryController.updateSubSubCategory);
router.delete('/:id/sub/:subId', protect, adminOnly, subCategoryController.deleteSubSubCategory);

module.exports = router;