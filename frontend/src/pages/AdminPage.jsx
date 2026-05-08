import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Map, BookOpen, Users, FileText,
  Plus, Edit2, Trash2, Eye, Check, X, TrendingUp,
  IndianRupee, RefreshCw
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'trips', label: 'Trips', icon: Map },
  { id: 'bookings', label: 'Bookings', icon: BookOpen },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'blogs', label: 'Blogs', icon: FileText },
];

 const EMPTY_TRIP = {
   name: '', state: 'Arunachal Pradesh', location: '', duration: 5,
   price: 10000, difficulty: 'Moderate', vehicleType: ['Bike'],
   description: '', featured: false, available: true, rating: 5,
   coverImage: '', highlights: '', maxGroupSize: 10
 };

export default function AdminPage() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTripForm, setShowTripForm] = useState(false);
  const [editTrip, setEditTrip] = useState(null);
  const [tripForm, setTripForm] = useState(EMPTY_TRIP);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab === 'overview') {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/stats`);
        setStats(data);
      } else if (tab === 'trips') {
         const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/trips`);
        setTrips(data);
      } else if (tab === 'bookings') {
         const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/admin/all`);
        setBookings(data);
      } else if (tab === 'users') {
         const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`);
        setUsers(data);
      } else if (tab === 'blogs') {
         const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/blog`);
        setBlogs(data);
      }
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const openTripForm = (trip = null) => {
    if (trip) {
      setEditTrip(trip._id);
      setTripForm({
        name: trip.name || '',
        location: trip.location || '',
        state: trip.state,
        duration: trip.duration,
        price: trip.price,
        difficulty: trip.difficulty,
        vehicleType: trip.vehicleType || ['Bike'],
        description: trip.description || '',
        featured: trip.featured || false,
        available: trip.available !== false,
        rating: trip.rating || 5,
        coverImage: trip.coverImage || '',
        highlights: trip.highlights?.join('\n') || '',
        maxGroupSize: trip.maxGroupSize || 10
      });
    } else {
      setEditTrip(null);
      setTripForm(EMPTY_TRIP);
    }
    setShowTripForm(true);
  };

  const saveTrip = async () => {
    setSaving(true);
    try {
      const payload = {
        ...tripForm,
        highlights: tripForm.highlights.split('\n').filter(h => h.trim()),
        duration: Number(tripForm.duration),
        price: Number(tripForm.price),
        maxGroupSize: Number(tripForm.maxGroupSize),
      };
      if (editTrip) {
         await axios.put(`${import.meta.env.VITE_API_URL}/api/trips/${editTrip}`, payload);
        toast.success('Trip updated!');
      } else {
         await axios.post(`${import.meta.env.VITE_API_URL}/api/trips`, payload);
        toast.success('Trip created!');
      }
      setShowTripForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteTrip = async (id) => {
    if (!window.confirm('Delete this trip? This cannot be undone.')) return;
    try {
       await axios.delete(`${import.meta.env.VITE_API_URL}/api/trips/${id}`);
      setTrips(prev => prev.filter(t => t._id !== id));
      toast.success('Trip deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
       await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/bookings/${id}`, { status });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
      toast.success('Status updated');
    } catch {
      toast.error('Update failed');
    }
  };

  const statusColors = {
    pending: 'text-yellow-400 bg-yellow-400/10',
    confirmed: 'text-green-400 bg-green-400/10',
    cancelled: 'text-red-400 bg-red-400/10',
    completed: 'text-blue-400 bg-blue-400/10',
  };

  return (
    <>
      <Helmet><title>Admin Panel – Fukre Travels</title></Helmet>
      <div className="pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-forest-400 text-xs font-mono uppercase tracking-widest mb-1">Admin Panel</p>
              <h1 className="font-display text-3xl font-bold text-white">Fukre Travels Dashboard</h1>
            </div>
            <button onClick={fetchData} className="flex items-center gap-2 bg-earth-800 border border-forest-900/40 rounded-xl px-4 py-2 text-sm text-gray-400 hover:text-white hover:border-forest-700 transition-all">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-earth-800 border border-forest-900/30 rounded-xl p-1 mb-8 overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${tab === id ? 'bg-forest-700 text-white' : 'text-gray-400 hover:text-white'}`}>
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>

          {loading ? <LoadingSpinner fullScreen={false} /> : (
            <>
              {/* ── OVERVIEW ─────────────────────────────── */}
              {tab === 'overview' && stats && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-400' },
                      { label: 'Total Trips', value: stats.trips, icon: Map, color: 'text-forest-400' },
                      { label: 'Bookings', value: stats.bookings, icon: BookOpen, color: 'text-yellow-400' },
                      { label: 'Revenue', value: `₹${(stats.revenue || 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-green-400' },
                    ].map(({ label, value, icon: Icon, color }) => (
                      <div key={label} className="bg-earth-800 border border-forest-900/30 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-400 uppercase font-mono">{label}</span>
                          <Icon size={16} className={color} />
                        </div>
                        <div className={`font-display text-3xl font-bold ${color}`}>{value}</div>
                      </div>
                    ))}
                  </div>

                  {stats.recentBookings?.length > 0 && (
                    <div className="bg-earth-800 border border-forest-900/30 rounded-2xl p-6">
                      <h3 className="font-display text-lg font-semibold text-white mb-4">Recent Bookings</h3>
                      <div className="space-y-3">
                        {stats.recentBookings.map(b => (
                          <div key={b._id} className="flex items-center justify-between py-2.5 border-b border-forest-900/20 last:border-0 text-sm">
                            <div>
                              <span className="text-white font-medium">{b.user?.name}</span>
                              <span className="text-gray-500 mx-2">·</span>
                               <span className="text-gray-400">{b.trip?.name}</span>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[b.status]}`}>
                              {b.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── TRIPS ────────────────────────────────── */}
              {tab === 'trips' && (
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-display text-xl text-white">All Trips ({trips.length})</h2>
                    <button onClick={() => openTripForm()}
                      className="flex items-center gap-2 bg-forest-600 hover:bg-forest-500 text-white text-sm px-4 py-2.5 rounded-xl transition-all">
                      <Plus size={16} /> Add Trip
                    </button>
                  </div>

                  {/* Trip Form Modal */}
                  {showTripForm && (
                    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                      <div className="bg-earth-800 border border-forest-800/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-forest-900/30">
                          <h3 className="font-display text-xl font-semibold text-white">{editTrip ? 'Edit Trip' : 'Add New Trip'}</h3>
                          <button onClick={() => setShowTripForm(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { label: 'Name', key: 'name', span: 2 },
                            { label: 'Location', key: 'location', span: 2 },
                            { label: 'Cover Image URL', key: 'coverImage', span: 2 },
                          ].map(({ label, key, span }) => (
                            <div key={key} className={span === 2 ? 'col-span-2' : ''}>
                              <label className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-1 block">{label}</label>
                              <input value={tripForm[key]} onChange={e => setTripForm(f => ({ ...f, [key]: e.target.value }))}
                                className="w-full bg-earth-900 border border-forest-900/40 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-forest-600" />
                            </div>
                          ))}
                          <div>
                            <label className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-1 block">State</label>
                            <select value={tripForm.state} onChange={e => setTripForm(f => ({ ...f, state: e.target.value }))}
                              className="w-full bg-earth-900 border border-forest-900/40 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-forest-600">
                              {['Arunachal Pradesh', 'Meghalaya', 'Assam', 'Mizoram', 'Multi-State'].map(s => <option key={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-1 block">Difficulty</label>
                            <select value={tripForm.difficulty} onChange={e => setTripForm(f => ({ ...f, difficulty: e.target.value }))}
                              className="w-full bg-earth-900 border border-forest-900/40 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-forest-600">
                              {['Easy', 'Moderate', 'Hard', 'Expert'].map(d => <option key={d}>{d}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-1 block">Duration (days)</label>
                            <input type="number" value={tripForm.duration} onChange={e => setTripForm(f => ({ ...f, duration: e.target.value }))}
                              className="w-full bg-earth-900 border border-forest-900/40 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-forest-600" />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-1 block">Price (₹)</label>
                            <input type="number" value={tripForm.price} onChange={e => setTripForm(f => ({ ...f, price: e.target.value }))}
                              className="w-full bg-earth-900 border border-forest-900/40 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-forest-600" />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-1 block">Max Group</label>
                            <input type="number" value={tripForm.maxGroupSize} onChange={e => setTripForm(f => ({ ...f, maxGroupSize: e.target.value }))}
                              className="w-full bg-earth-900 border border-forest-900/40 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-forest-600" />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-2 block">Vehicle Type</label>
                            <div className="flex gap-2">
                              {['Bike', 'Car', 'Both'].map(v => (
                                <button type="button" key={v}
                                  onClick={() => setTripForm(f => ({ ...f, vehicleType: f.vehicleType.includes(v) ? f.vehicleType.filter(x => x !== v) : [...f.vehicleType, v] }))}
                                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${tripForm.vehicleType?.includes(v) ? 'bg-forest-700 border-forest-500 text-white' : 'border-forest-900/40 text-gray-400'}`}>
                                  {v}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <label className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-1 block">Description</label>
                            <textarea rows={3} value={tripForm.description} onChange={e => setTripForm(f => ({ ...f, description: e.target.value }))}
                              className="w-full bg-earth-900 border border-forest-900/40 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-forest-600 resize-none" />
                          </div>
                          <div className="col-span-2">
                            <label className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-1 block">Highlights (one per line)</label>
                            <textarea rows={4} value={tripForm.highlights} onChange={e => setTripForm(f => ({ ...f, highlights: e.target.value }))}
                              placeholder="Sela Pass&#10;Tawang Monastery&#10;Madhuri Lake"
                              className="w-full bg-earth-900 border border-forest-900/40 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-forest-600 resize-none" />
                          </div>
                          <div className="col-span-2 flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={tripForm.featured} onChange={e => setTripForm(f => ({ ...f, featured: e.target.checked }))}
                                className="w-4 h-4 accent-forest-500" />
                              <span className="text-sm text-gray-300">Featured Trip</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={tripForm.available} onChange={e => setTripForm(f => ({ ...f, available: e.target.checked }))}
                                className="w-4 h-4 accent-forest-500" />
                              <span className="text-sm text-gray-300">Available</span>
                            </label>
                          </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t border-forest-900/30">
                          <button onClick={() => setShowTripForm(false)} className="flex-1 py-2.5 border border-forest-900/40 rounded-xl text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                          <button onClick={saveTrip} disabled={saving} className="flex-1 bg-forest-600 hover:bg-forest-500 disabled:opacity-60 text-white font-medium py-2.5 rounded-xl text-sm transition-all">
                            {saving ? 'Saving...' : editTrip ? 'Update Trip' : 'Create Trip'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {trips.map(trip => (
                      <div key={trip._id} className="bg-earth-800 border border-forest-900/30 rounded-xl p-4 flex items-center gap-4 hover:border-forest-700/40 transition-all">
                        <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0">
                           <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                             <h4 className="text-sm font-semibold text-white truncate">{trip.name}</h4>
                            {trip.featured && <span className="text-xs bg-forest-900 text-forest-400 px-2 py-0.5 rounded-full shrink-0">Featured</span>}
                          </div>
                          <p className="text-xs text-gray-400">{trip.state} · {trip.duration} days · ₹{trip.price?.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <a href={`/trips/${trip._id}`} target="_blank" rel="noreferrer"
                            className="p-2 rounded-lg bg-earth-900 hover:bg-earth-700 text-gray-400 hover:text-white transition-colors">
                            <Eye size={14} />
                          </a>
                          <button onClick={() => openTripForm(trip)} className="p-2 rounded-lg bg-earth-900 hover:bg-earth-700 text-gray-400 hover:text-forest-400 transition-colors">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => deleteTrip(trip._id)} className="p-2 rounded-lg bg-earth-900 hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── BOOKINGS ──────────────────────────────── */}
              {tab === 'bookings' && (
                <div>
                  <h2 className="font-display text-xl text-white mb-5">All Bookings ({bookings.length})</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-400 uppercase font-mono tracking-widest border-b border-forest-900/30">
                          <th className="pb-3 pr-4">User</th>
                          <th className="pb-3 pr-4">Trip</th>
                          <th className="pb-3 pr-4">Date</th>
                          <th className="pb-3 pr-4">Vehicle</th>
                          <th className="pb-3 pr-4">Amount</th>
                          <th className="pb-3 pr-4">Status</th>
                          <th className="pb-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="space-y-2">
                        {bookings.map(b => (
                          <tr key={b._id} className="border-b border-forest-900/20 hover:bg-earth-800/50 transition-colors">
                            <td className="py-3 pr-4">
                              <div className="text-white font-medium">{b.user?.name}</div>
                              <div className="text-xs text-gray-500">{b.user?.email}</div>
                            </td>
                            <td className="py-3 pr-4">
                               <div className="text-gray-300 max-w-[150px] truncate">{b.trip?.name}</div>
                              <div className="text-xs text-gray-500">{b.trip?.state}</div>
                            </td>
                            <td className="py-3 pr-4 text-gray-400 whitespace-nowrap">{new Date(b.bookingDate).toLocaleDateString('en-IN')}</td>
                            <td className="py-3 pr-4 text-gray-400">{b.vehicleType}</td>
                            <td className="py-3 pr-4 text-forest-400 font-mono">₹{b.totalPrice?.toLocaleString('en-IN')}</td>
                            <td className="py-3 pr-4">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[b.status]}`}>{b.status}</span>
                            </td>
                            <td className="py-3">
                              <select value={b.status} onChange={e => updateBookingStatus(b._id, e.target.value)}
                                className="bg-earth-900 border border-forest-900/40 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-forest-600">
                                {['pending', 'confirmed', 'cancelled', 'completed'].map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {bookings.length === 0 && <div className="text-center py-10 text-gray-500">No bookings yet</div>}
                  </div>
                </div>
              )}

              {/* ── USERS ──────────────────────────────────── */}
              {tab === 'users' && (
                <div>
                  <h2 className="font-display text-xl text-white mb-5">All Users ({users.length})</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map(u => (
                      <div key={u._id} className="bg-earth-800 border border-forest-900/30 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-forest-700 flex items-center justify-center text-sm font-bold text-white shrink-0">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-white flex items-center gap-2">
                            {u.name}
                            {u.role === 'admin' && <span className="text-xs bg-amber-900/40 text-amber-400 px-1.5 py-0.5 rounded">Admin</span>}
                          </div>
                          <div className="text-xs text-gray-400 truncate">{u.email}</div>
                          <div className="text-xs text-gray-600 mt-0.5">{new Date(u.createdAt).toLocaleDateString('en-IN')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── BLOGS ──────────────────────────────────── */}
              {tab === 'blogs' && (
                <div>
                  <h2 className="font-display text-xl text-white mb-5">Blog Posts ({blogs.length})</h2>
                  <div className="space-y-3">
                    {blogs.map(blog => (
                      <div key={blog._id} className="bg-earth-800 border border-forest-900/30 rounded-xl p-4 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-white mb-1 truncate">{blog.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>{blog.category}</span>
                            <span>·</span>
                            <span>{new Date(blog.createdAt).toLocaleDateString('en-IN')}</span>
                            <span>·</span>
                            <span>{blog.views} views</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs px-2 py-1 rounded-full ${blog.published ? 'bg-green-400/10 text-green-400' : 'bg-gray-400/10 text-gray-400'}`}>
                            {blog.published ? 'Published' : 'Draft'}
                          </span>
                          <a href={`/blog/${blog.slug}`} target="_blank" rel="noreferrer"
                            className="p-1.5 rounded-lg hover:bg-earth-700 text-gray-400 hover:text-white transition-colors">
                            <Eye size={14} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
