const Pdf = require('../models/Pdf');

const pdfController = {
  // Create new PDF with file upload
  create: async (req, res) => {
    try {
      const fileUrl = req.file ? req.file.location : null; // S3 URL for the uploaded PDF

      const pdf = new Pdf({
        ...req.body,
        pdfLink: fileUrl, // Changed from fileUrl to pdfLink
      });

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

  // Update PDF with file upload
  update: async (req, res) => {
    try {
      const fileUrl = req.file ? req.file.location : null;

      const updatedData = {
        ...req.body,
      };

      if (fileUrl) {
        updatedData.pdfLink = fileUrl; // Changed from fileUrl to pdfLink
      }

      const pdf = await Pdf.findByIdAndUpdate(req.params.id, updatedData, { new: true });
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