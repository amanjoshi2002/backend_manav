const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', policyController.getPolicies);
router.get('/:id', policyController.getPolicy);

// Admin-only routes
router.post('/', protect, adminOnly, policyController.createPolicy);
router.put('/:id', protect, adminOnly, policyController.updatePolicy);
router.delete('/:id', protect, adminOnly, policyController.deletePolicy);

module.exports = router;
