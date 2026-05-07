const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const { protect, adminOnly } = require('../middleware/auth');

// Get all trips with filters
router.get('/', async (req, res) => {
  try {
    const { state, minPrice, maxPrice, duration, difficulty, vehicleType, featured } = req.query;
    const filter = { available: true };
    if (state) filter.state = state;
    if (difficulty) filter.difficulty = difficulty;
    if (vehicleType) filter.vehicleType = { $in: [vehicleType, 'Both'] };
    if (featured) filter.featured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (duration) filter.duration = { $lte: Number(duration) };
    const trips = await Trip.find(filter).sort({ featured: -1, rating: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single trip
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findOne({ $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { slug: req.params.id }] });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create trip (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const trip = await Trip.create(req.body);
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update trip (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete trip (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
