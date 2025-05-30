const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', protect, pdfController.getAll);
router.get('/:id', protect, pdfController.getById);

// Admin routes
router.post('/', protect, adminOnly, pdfController.create);
router.put('/:id', protect, adminOnly, pdfController.update);
router.delete('/:id', protect, adminOnly, pdfController.delete);

module.exports = router;