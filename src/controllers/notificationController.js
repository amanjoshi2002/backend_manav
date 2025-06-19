const Notification = require('../models/Notification');

// Create notification (admin only)
exports.createNotification = async (req, res) => {
  try {
    const { title, message, startDate, endDate } = req.body;
    let image = req.body.image;
    if (req.file && req.file.location) {
      image = req.file.location; // S3 URL from multer-s3
    }
    const notification = await Notification.create({ title, message, image, startDate, endDate });
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all notifications (public)
exports.getNotifications = async (req, res) => {
  try {
    // Remove date filter for testing:
    const notifications = await Notification.find().sort({ startDate: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all notifications (admin, including expired/future)
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ startDate: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single notification (public)
exports.getNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update notification (admin only)
exports.updateNotification = async (req, res) => {
  try {
    const { title, message, startDate, endDate } = req.body;
    let updateData = { title, message, startDate, endDate };
    if (req.file && req.file.location) {
      updateData.image = req.file.location; // S3 URL from multer-s3
    } else if (req.body.image) {
      updateData.image = req.body.image;
    }
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete notification (admin only)
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
 