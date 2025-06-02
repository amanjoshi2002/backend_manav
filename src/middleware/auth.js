const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - used for both admin and app routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin only routes
exports.adminOnly = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'This route is restricted to admin users only'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// App routes - block admin routes from being accessed
exports.appOnly = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      return res.status(403).json({ 
        message: 'Admin users should use the admin panel'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Role-based authorization for app users (customer, reseller, special)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Allow admin users to access all routes
    if (req.user.role === 'admin') {
      return next();
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};