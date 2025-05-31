const Video = require('../models/Video');

const videoController = {
  // Create new video with file upload
  create: async (req, res) => {
    try {
      const videoUrl = req.file ? req.file.location : null; // S3 URL for the uploaded video

      const video = new Video({
        ...req.body,
        videoUrl, // Save the S3 URL
      });

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

  // Update video with file upload
  update: async (req, res) => {
    try {
      const videoUrl = req.file ? req.file.location : null;

      const updatedData = {
        ...req.body,
      };

      if (videoUrl) {
        updatedData.videoUrl = videoUrl; // Update the video URL if a new one is uploaded
      }

      const video = await Video.findByIdAndUpdate(req.params.id, updatedData, { new: true });
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