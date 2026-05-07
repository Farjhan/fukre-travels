const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  excerpt: String,
  content: { type: String, required: true },
  coverImage: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
  category: { type: String, enum: ['Travel Tips', 'Destination Guide', 'Bike Tips', 'Road Safety', 'Culture', 'Food'] },
  published: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

blogSchema.pre('save', function(next) {
  if (this.title && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
