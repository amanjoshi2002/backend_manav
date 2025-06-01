const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyOtp, // <-- Add this
  updateRole,
  getUsers, // New function to get users
  deleteUser, // New function to delete user
  getMe // <-- Add this
} = require('../controllers/authController');

// Public auth routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.post('/verify-otp', verifyOtp); // New route for OTP verification

// Authenticated user route to get own details
router.get('/me', protect, getMe);

// Admin only routes
router.put('/users/:id/role', protect, adminOnly, updateRole);
router.get('/users', protect, adminOnly, getUsers); // New route to get users
router.delete('/users/:id', protect, adminOnly, deleteUser); // New route to delete user

module.exports = router;