const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updateRole
} = require('../controllers/authController');

// Public auth routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Admin only routes
router.put('/users/:id/role', protect, adminOnly, updateRole);

module.exports = router;