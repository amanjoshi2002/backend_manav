const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', protect, pdfController.getAll);
router.get('/:id', protect, pdfController.getById);

// Admin routes
router.post(
  '/',
  protect,
  adminOnly,
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  pdfController.create
);
router.put(
  '/:id',
  protect,
  adminOnly,
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  pdfController.update
);
router.delete('/:id', protect, adminOnly, pdfController.delete);

module.exports = router;