const Policy = require('../models/Policy');

// Create a new policy (admin only)
exports.createPolicy = async (req, res) => {
  try {
    const { title, content } = req.body;
    const policy = await Policy.create({ title, content });
    res.status(201).json({ success: true, data: policy });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all policies (public)
exports.getPolicies = async (req, res) => {
  try {
    const policies = await Policy.find();
    res.status(200).json({ success: true, data: policies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single policy by ID (public)
exports.getPolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ success: false, error: 'Policy not found' });
    }
    res.status(200).json({ success: true, data: policy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a policy (admin only)
exports.updatePolicy = async (req, res) => {
  try {
    const { title, content } = req.body;
    const policy = await Policy.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );
    if (!policy) {
      return res.status(404).json({ success: false, error: 'Policy not found' });
    }
    res.status(200).json({ success: true, data: policy });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a policy (admin only)
exports.deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndDelete(req.params.id);
    if (!policy) {
      return res.status(404).json({ success: false, error: 'Policy not found' });
    }
    res.status(200).json({ success: true, message: 'Policy deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
