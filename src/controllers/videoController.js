const Video = require('../models/Video');

const videoController = {
  // Create new video (admin only)
  create: async (req, res) => {
    try {
      const data = req.body;
      if (req.files && req.files.video && req.files.video[0]) {
        data.videoLink = req.files.video[0].location;
      }
      if (req.files && req.files.image && req.files.image[0]) {
        data.image = req.files.image[0].location;
      }
      const video = new Video(data);
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
      const data = req.body;
      if (req.files && req.files.video && req.files.video[0]) {
        data.videoLink = req.files.video[0].location;
      }
      if (req.files && req.files.image && req.files.image[0]) {
        data.image = req.files.image[0].location;
      }
      const video = await Video.findByIdAndUpdate(req.params.id, data, { new: true });
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