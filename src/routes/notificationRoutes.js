const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload'); // <-- Add this

// Public routes
router.get('/', notificationController.getNotifications);
router.get('/:id', notificationController.getNotification);

// Admin-only routes
router.get('/admin/all', protect, adminOnly, notificationController.getAllNotifications);
router.post('/', protect, adminOnly, upload.single('image'), notificationController.createNotification); // <-- Add upload.single
router.put('/:id', protect, adminOnly, upload.single('image'), notificationController.updateNotification); // <-- Add upload.single
router.delete('/:id', protect, adminOnly, notificationController.deleteNotification);

module.exports = router;
