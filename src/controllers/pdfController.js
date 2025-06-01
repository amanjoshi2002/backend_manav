const Pdf = require('../models/Pdf');

const pdfController = {
  // Create new PDF (admin only)
  create: async (req, res) => {
    try {
      const data = req.body;
      if (req.files && req.files.pdf && req.files.pdf[0]) {
        data.pdfLink = req.files.pdf[0].location;
      }
      if (req.files && req.files.image && req.files.image[0]) {
        data.image = req.files.image[0].location;
      }
      const pdf = new Pdf(data);
      const savedPdf = await pdf.save();
      res.status(201).json(savedPdf);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all PDFs (public)
  getAll: async (req, res) => {
    try {
      const pdfs = await Pdf.find();
      res.json(pdfs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get single PDF by ID (public)
  getById: async (req, res) => {
    try {
      const pdf = await Pdf.findById(req.params.id);
      if (!pdf) {
        return res.status(404).json({ message: 'PDF not found' });
      }
      res.json(pdf);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update PDF (admin only)
  update: async (req, res) => {
    try {
      const data = req.body;
      if (req.files && req.files.pdf && req.files.pdf[0]) {
        data.pdfLink = req.files.pdf[0].location;
      }
      if (req.files && req.files.image && req.files.image[0]) {
        data.image = req.files.image[0].location;
      }
      const pdf = await Pdf.findByIdAndUpdate(req.params.id, data, { new: true });
      if (!pdf) {
        return res.status(404).json({ message: 'PDF not found' });
      }
      res.json(pdf);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete PDF (admin only)
  delete: async (req, res) => {
    try {
      const pdf = await Pdf.findByIdAndDelete(req.params.id);
      if (!pdf) {
        return res.status(404).json({ message: 'PDF not found' });
      }
      res.json({ message: 'PDF deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = pdfController;