const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', protect, videoController.getAll);
router.get('/:id', protect, videoController.getById);

// Admin routes
router.post('/', protect, adminOnly, videoController.create);
router.put('/:id', protect, adminOnly, videoController.update);
router.delete('/:id', protect, adminOnly, videoController.delete);

module.exports = router;