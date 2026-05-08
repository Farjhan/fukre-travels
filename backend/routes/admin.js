const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');
const Blog = require('../models/Blog');
const { protect, adminOnly } = require('../middleware/auth');

// Dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [users, trips, bookings, blogs] = await Promise.all([
      User.countDocuments(),
      Trip.countDocuments(),
      Booking.countDocuments(),
      Blog.countDocuments()
    ]);
    const revenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const recentBookings = await Booking.find({}).populate('user', 'name').populate('trip', 'title').sort('-createdAt').limit(5);
    res.json({ users, trips, bookings, blogs, revenue: revenue[0]?.total || 0, recentBookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// All users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort('-createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update booking status
router.put('/bookings/:id', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;