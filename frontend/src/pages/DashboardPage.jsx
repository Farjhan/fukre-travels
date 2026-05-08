import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Bike, Car, Clock, CheckCircle, XCircle, AlertCircle, User, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const statusConfig = {
  pending: { label: 'Pending', color: 'text-yellow-400 bg-yellow-400/10', icon: AlertCircle },
  confirmed: { label: 'Confirmed', color: 'text-green-400 bg-green-400/10', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-400/10', icon: XCircle },
  completed: { label: 'Completed', color: 'text-blue-400 bg-blue-400/10', icon: CheckCircle },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/my-bookings`)
  .then(r => {
    setBookings(
      Array.isArray(r.data)
        ? r.data
        : r.data.bookings || []
    );
    setLoading(false);
  })
  .catch(() => setLoading(false));
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
       await axios.put(`${import.meta.env.VITE_API_URL}/api/bookings/${id}/cancel`);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch {
      toast.error('Failed to cancel booking');
    }
  };

  return (
    <>
      <Helmet><title>My Dashboard – Fukre Travels</title></Helmet>
      <div className="pt-24 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-forest-600 to-forest-800 flex items-center justify-center text-2xl font-bold text-white font-display">
              {user?.name[0]}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-white">Hello, {user?.name.split(' ')[0]}! 👋</h1>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Total Bookings', value: bookings.length },
              { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length },
              { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length },
              { label: 'Total Spent', value: `₹${bookings.filter(b => b.paymentStatus === 'paid').reduce((acc, b) => acc + b.totalPrice, 0).toLocaleString('en-IN')}` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-earth-800 border border-forest-900/30 rounded-xl p-4">
                <div className="font-display text-2xl font-bold text-forest-400">{value}</div>
                <div className="text-xs text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Bookings */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-2xl font-semibold text-white">My Bookings</h2>
              <Link to="/trips" className="text-sm text-forest-400 hover:text-forest-300 flex items-center gap-1">
                Book New Trip <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? <LoadingSpinner fullScreen={false} /> : bookings.length === 0 ? (
              <div className="text-center py-16 bg-earth-800 border border-forest-900/30 rounded-2xl">
                <div className="text-5xl mb-4">🏔️</div>
                <h3 className="font-display text-xl text-white mb-2">No trips yet!</h3>
                <p className="text-gray-400 text-sm mb-6">Start your Northeast adventure today</p>
                <Link to="/trips" className="bg-forest-600 hover:bg-forest-500 text-white px-6 py-3 rounded-full text-sm font-medium transition-all">
                  Browse Trips
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map(booking => {
                  const status = statusConfig[booking.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  return (
                    <div key={booking._id} className="bg-earth-800 border border-forest-900/30 rounded-2xl overflow-hidden hover:border-forest-700/40 transition-all">
                      <div className="flex flex-col sm:flex-row gap-4 p-5">
                        {booking.trip?.coverImage && (
                          <div className="shrink-0 w-full sm:w-24 h-32 sm:h-20 rounded-xl overflow-hidden">
                             <img src={booking.trip.coverImage} alt={booking.trip.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                            <h3 className="font-display font-semibold text-white text-lg">{booking.trip?.name || 'Unknown Trip'}</h3>
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 ${status.color}`}>
                              <StatusIcon size={11} /> {status.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-3">
                            {booking.trip?.state && <span className="flex items-center gap-1"><MapPin size={11} className="text-forest-500" />{booking.trip.state}</span>}
                            <span className="flex items-center gap-1"><Calendar size={11} className="text-forest-500" />{new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            <span className="flex items-center gap-1">{booking.vehicleType === 'Bike' ? <Bike size={11} /> : <Car size={11} />}{booking.vehicleType}</span>
                            {booking.trip?.duration && <span className="flex items-center gap-1"><Clock size={11} />{booking.trip.duration} days</span>}
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-forest-400 font-bold">₹{booking.totalPrice?.toLocaleString('en-IN')}</span>
                              <span className="text-xs text-gray-500 ml-2">· {booking.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Payment Pending'}</span>
                            </div>
                            {booking.status === 'pending' && (
                              <button onClick={() => cancelBooking(booking._id)}
                                className="text-xs text-red-400 hover:text-red-300 border border-red-400/20 hover:border-red-400/40 px-3 py-1.5 rounded-lg transition-all">
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
