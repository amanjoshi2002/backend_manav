const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', protect, videoController.getAll);
router.get('/:id', protect, videoController.getById);

// Admin routes
router.post(
  '/',
  protect,
  adminOnly,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  videoController.create
);
router.put(
  '/:id',
  protect,
  adminOnly,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  videoController.update
);
router.delete('/:id', protect, adminOnly, videoController.delete);

module.exports = router;