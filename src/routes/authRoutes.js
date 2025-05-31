const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updateRole,
  getUsers,
  deleteUser,
  getProfile,
  updateProfile,
  updatePassword
} = require('../controllers/authController');

// Public auth routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotpassword', forgotPassword); // Send OTP
router.put('/resetpassword', resetPassword); // Reset password with OTP

// User profile routes
router.get('/profile', protect, getProfile); // Get the logged-in user's profile
router.put('/profile', protect, updateProfile); // Update the logged-in user's profile
router.put('/profile/password', protect, updatePassword); // Update the logged-in user's password

// Admin only routes
router.put('/users/:id/role', protect, adminOnly, updateRole);
router.get('/users', protect, adminOnly, getUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;