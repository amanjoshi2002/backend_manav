const Video = require('../models/Video');

const videoController = {
  // Create new video (admin only)
  create: async (req, res) => {
    try {
      const video = new Video(req.body);
      const savedVideo = await video.save();
      res.status(201).json(savedVideo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all videos (public)
  getAll: async (req, res) => {
    try {
      const videos = await Video.find();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get single video by ID (public)
  getById: async (req, res) => {
    try {
      const video = await Video.findById(req.params.id);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update video (admin only)
  update: async (req, res) => {
    try {
      const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      res.json(video);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete video (admin only)
  delete: async (req, res) => {
    try {
      const video = await Video.findByIdAndDelete(req.params.id);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      res.json({ message: 'Video deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = videoController;