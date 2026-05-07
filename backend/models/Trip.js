const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  state: { type: String, enum: ['Arunachal Pradesh', 'Meghalaya', 'Assam', 'Mizoram', 'Multi-State'], required: true },
  route: { type: String, required: true },
  duration: { type: Number, required: true }, // days
  price: { type: Number, required: true },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard', 'Expert'], required: true },
  vehicleType: [{ type: String, enum: ['Bike', 'Car', 'Both'] }],
  description: { type: String, required: true },
  highlights: [String],
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    distance: String,
    stay: String
  }],
  images: [String],
  coverImage: String,
  maxGroupSize: { type: Number, default: 12 },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  startDates: [Date],
  mapEmbedUrl: String,
  createdAt: { type: Date, default: Date.now }
});

tripSchema.pre('save', function(next) {
  if (this.title && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Trip', tripSchema);
