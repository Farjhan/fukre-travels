import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { ArrowLeft, Eye, Calendar, User, Tag, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/blog/${slug}`)
      .then(r => {
  setBlog(r.data?.blog || r.data);

  return axios.get('/api/blog', {
    params: { category: r.data?.category || r.data?.blog?.category }
  });
})
.then(r => {
  const blogs = Array.isArray(r.data)
    ? r.data
    : r.data.blogs || [];

  setRelated(
    blogs.filter(b => b.slug !== slug).slice(0, 3)
  );
})
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner text="Loading article..." />;
  if (!blog) return (
    <div className="min-h-screen pt-20 flex items-center justify-center text-center">
      <div>
        <p className="text-4xl mb-4">📝</p>
        <h2 className="font-display text-2xl text-white mb-3">Article not found</h2>
        <Link to="/blog" className="text-forest-400">← Back to Blog</Link>
      </div>
    </div>
  );

  // Simple markdown-like rendering
  const renderContent = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="font-display text-3xl font-bold text-white mt-8 mb-4">{line.slice(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="font-display text-2xl font-semibold text-white mt-6 mb-3">{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="font-display text-xl font-semibold text-forest-300 mt-5 mb-2">{line.slice(4)}</h3>;
      if (line.startsWith('- ')) return <li key={i} className="text-gray-300 mb-1.5 flex items-start gap-2"><span className="text-forest-500 mt-1.5">●</span>{line.slice(2)}</li>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-gray-300 leading-relaxed mb-3">{line}</p>;
    });
  };

  return (
    <>
      <Helmet>
        <title>{blog.title} – Fukre Travels Blog</title>
        <meta name="description" content={blog.excerpt} />
        <meta name="keywords" content={blog.tags?.join(', ')} />
      </Helmet>

      <div className="pt-20 min-h-screen">
        {/* Hero */}
        <div className="relative h-72 md:h-96 overflow-hidden">
          {blog.coverImage ? (
            <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-forest-900 to-earth-900 flex items-center justify-center text-8xl">
              {blog.category === 'Bike Tips' ? '🏍️' : blog.category === 'Destination Guide' ? '🗺️' : '✍️'}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-earth-900 via-earth-900/30 to-transparent" />
          <Link to="/blog" className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/20 text-white rounded-full px-4 py-2 text-sm hover:bg-black/60 transition-all">
            <ArrowLeft size={14} /> Blog
          </Link>
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-10">
          {/* Article Card */}
          <div className="bg-earth-800 border border-forest-800/30 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-8 md:p-12">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {blog.category && (
                  <span className="text-xs font-mono text-forest-400 bg-forest-900/40 px-3 py-1 rounded-full uppercase tracking-widest">
                    {blog.category}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Eye size={11} /> {blog.views} views
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar size={11} /> {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                {blog.author?.name && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <User size={11} /> {blog.author.name}
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 leading-snug">{blog.title}</h1>
              {blog.excerpt && <p className="text-lg text-gray-400 leading-relaxed mb-8 pb-8 border-b border-forest-900/40">{blog.excerpt}</p>}

              {/* Content */}
              <div className="prose-custom">
                <ul className="list-none space-y-1">
                  {renderContent(blog.content)}
                </ul>
              </div>

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="mt-10 pt-6 border-t border-forest-900/40">
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 text-xs text-gray-400 bg-earth-900 border border-forest-900/30 px-3 py-1.5 rounded-full">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="my-10 bg-gradient-to-r from-forest-900/60 to-earth-800 border border-forest-800/30 rounded-2xl p-8 text-center">
            <h3 className="font-display text-2xl font-bold text-white mb-2">Ready for Your Northeast Adventure?</h3>
            <p className="text-gray-400 mb-5">Browse our curated bike and car trips across Arunachal, Meghalaya, Assam & Mizoram.</p>
            <Link to="/trips" className="inline-flex items-center gap-2 bg-forest-600 hover:bg-forest-500 text-white font-semibold px-6 py-3 rounded-full transition-all hover:shadow-lg">
              Explore Trips <ArrowRight size={16} />
            </Link>
          </div>

          {/* Related Posts */}
          {related.length > 0 && (
            <div className="mb-16">
              <h2 className="font-display text-2xl font-bold text-white mb-6">More Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {related.map(b => (
                  <Link key={b._id} to={`/blog/${b.slug}`}
                    className="group bg-earth-800 border border-forest-900/30 rounded-xl p-4 hover:border-forest-700/50 transition-all">
                    <div className="text-xs text-forest-400 font-mono mb-2">{b.category}</div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-forest-300 transition-colors line-clamp-2">{b.title}</h4>
                    <div className="flex items-center gap-1 mt-3 text-xs text-forest-500">
                      Read more <ArrowRight size={10} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
