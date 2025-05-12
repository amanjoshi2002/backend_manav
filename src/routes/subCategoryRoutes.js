const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');
const { protect, adminOnly, appOnly } = require('../middleware/auth');

// Public routes
router.get('/category/:category', appOnly, subCategoryController.getByCategory);
router.get('/:id', appOnly, subCategoryController.getById);

// Admin routes
router.post('/', protect, adminOnly, subCategoryController.create);
router.post('/:id/sub', protect, adminOnly, subCategoryController.addSubSubCategory);
router.put('/:id/sub/:subId', protect, adminOnly, subCategoryController.updateSubSubCategory);
router.delete('/:id/sub/:subId', protect, adminOnly, subCategoryController.deleteSubSubCategory);

module.exports = router;