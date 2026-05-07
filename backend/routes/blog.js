const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category, tag } = req.query;
    const filter = { published: true };
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    const blogs = await Blog.find(filter).populate('author', 'name').sort('-createdAt');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate({ slug: req.params.slug, published: true }, { $inc: { views: 1 } }, { new: true }).populate('author', 'name');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body, author: req.user._id });
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
