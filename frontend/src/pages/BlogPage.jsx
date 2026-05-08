import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Clock, Eye, Tag, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = ['All', 'Travel Tips', 'Destination Guide', 'Bike Tips', 'Road Safety', 'Culture', 'Food'];

const categoryColors = {
  'Travel Tips': 'bg-blue-400/10 text-blue-400',
  'Destination Guide': 'bg-forest-400/10 text-forest-400',
  'Bike Tips': 'bg-orange-400/10 text-orange-400',
  'Road Safety': 'bg-red-400/10 text-red-400',
  'Culture': 'bg-purple-400/10 text-purple-400',
  'Food': 'bg-yellow-400/10 text-yellow-400',
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const params = activeCategory !== 'All' ? { category: activeCategory } : {};
     axios.get(`${import.meta.env.VITE_API_URL}/api/blog`, { params })
  .then(r => {
    const blogData = Array.isArray(r.data)
      ? r.data
      : r.data.blogs || [];

    setBlogs(blogData);
    setLoading(false);
  })
  .catch(() => setLoading(false));
  }, [activeCategory]);

  return (
    <>
      <Helmet>
        <title>Travel Blog – Fukre Travels | Northeast India Tips & Guides</title>
        <meta name="description" content="Travel tips, destination guides, and bike maintenance advice for Northeast India road trips. Arunachal Pradesh, Meghalaya, Assam, Mizoram." />
        <meta name="keywords" content="Northeast India travel blog, Arunachal Pradesh guide, Meghalaya travel tips, Northeast bike tips" />
      </Helmet>

      <div className="pt-20 min-h-screen">
        {/* Header */}
        <div className="relative py-20 px-4 overflow-hidden bg-earth-800/50">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,rgba(21,128,61,0.12)_0,transparent_70%)]" />
          <div className="max-w-4xl mx-auto text-center relative">
            <p className="text-forest-400 text-sm font-mono tracking-widest uppercase mb-3">From the Road</p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">Travel Stories &<br />Rider Tips</h1>
            <p className="text-gray-400 max-w-xl mx-auto">Real insights from Northeast India's roads — permit guides, bike tips, hidden spots, and cultural tales.</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`text-sm px-4 py-2 rounded-full border transition-all ${activeCategory === cat ? 'bg-forest-600 border-forest-600 text-white' : 'border-forest-900/40 text-gray-400 hover:border-forest-700 hover:text-white'}`}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? <LoadingSpinner fullScreen={false} /> : blogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="font-display text-2xl text-white mb-2">No posts yet</h3>
              <p className="text-gray-400">Check back soon for travel stories!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(Array.isArray(blogs) ? blogs : []).map((blog, i) => (
                <Link key={blog._id} to={`/blog/${blog.slug}`}
                  className="group bg-earth-800 border border-forest-900/30 rounded-2xl overflow-hidden hover:border-forest-700/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-forest-900/30">
                  {/* Image */}
                  <div className="h-48 overflow-hidden bg-earth-900">
                    {blog.coverImage ? (
                      <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        {blog.category === 'Bike Tips' ? '🏍️' : blog.category === 'Destination Guide' ? '🗺️' : '✍️'}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[blog.category] || 'bg-gray-400/10 text-gray-400'}`}>
                        {blog.category}
                      </span>
                    </div>
                    <h2 className="font-display font-semibold text-white text-lg leading-snug mb-2 group-hover:text-forest-300 transition-colors line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">{blog.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-forest-900/30">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Eye size={11} /> {blog.views}</span>
                        <span className="flex items-center gap-1"><Clock size={11} /> {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>
                      <span className="flex items-center gap-1 text-forest-500 group-hover:text-forest-400 transition-colors">
                        Read <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
