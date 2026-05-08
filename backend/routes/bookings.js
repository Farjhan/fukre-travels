const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const { protect, adminOnly } = require('../middleware/auth');

// Create booking
router.post('/', protect, async (req, res) => {
  try {
    const { tripId, bookingDate, vehicleType, groupSize, specialRequests, emergencyContact } = req.body;
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    const totalPrice = trip.price * (groupSize || 1);
    const booking = await Booking.create({
      user: req.user._id, trip: tripId, bookingDate, vehicleType,
      groupSize: groupSize || 1, totalPrice, specialRequests, emergencyContact
    });
     await booking.populate('trip', 'name coverImage duration');
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's bookings
router.get('/my-bookings', protect, async (req, res) => {
  try {
     const bookings = await Booking.find({ user: req.user._id }).populate('trip', 'name coverImage duration location state price').sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel booking
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Simulate payment (dummy Razorpay)
router.post('/:id/pay', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    booking.paymentId = 'PAY_' + Date.now();
    await booking.save();
    res.json({ success: true, paymentId: booking.paymentId, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: all bookings
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
     const bookings = await Booking.find({}).populate('user', 'name email').populate('trip', 'name state').sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
