import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CreditCard, Bike, Car, Users, Calendar, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function BookingPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [form, setForm] = useState({
    bookingDate: '',
    vehicleType: 'Bike',
    groupSize: 1,
    specialRequests: '',
    emergencyName: '',
    emergencyPhone: ''
  });

  useEffect(() => {
    axios.get(`/api/trips/${tripId}`).then(r => { setTrip(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [tripId]);

  const totalPrice = trip ? trip.price * form.groupSize : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bookingDate) return toast.error('Please select a travel date');
    setSubmitting(true);
    try {
      const { data: booking } = await axios.post('/api/bookings', {
        tripId,
        bookingDate: form.bookingDate,
        vehicleType: form.vehicleType,
        groupSize: form.groupSize,
        specialRequests: form.specialRequests,
        emergencyContact: { name: form.emergencyName, phone: form.emergencyPhone }
      });

      // Simulate Razorpay payment
      await simulatePayment(booking._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const simulatePayment = async (bookingId) => {
    toast.loading('Opening payment gateway...', { id: 'payment' });
    await new Promise(r => setTimeout(r, 1500));
    toast.loading('Processing payment...', { id: 'payment' });
    await new Promise(r => setTimeout(r, 1500));
    try {
      await axios.post(`/api/bookings/${bookingId}/pay`);
      toast.success('Payment successful! Booking confirmed! 🎉', { id: 'payment' });
      setBookingSuccess(true);
    } catch {
      toast.error('Payment failed. Try again.', { id: 'payment' });
    }
  };

  if (loading) return <LoadingSpinner text="Loading trip details..." />;
  if (!trip) return <div className="min-h-screen flex items-center justify-center text-white">Trip not found</div>;

  if (bookingSuccess) return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle size={64} className="text-forest-400 mx-auto mb-6 animate-pulse" />
        <h2 className="font-display text-3xl font-bold text-white mb-3">Booking Confirmed! 🎉</h2>
        <p className="text-gray-400 mb-2">Your adventure awaits, {user?.name}!</p>
        <p className="text-gray-400 text-sm mb-8">Trip: <strong className="text-white">{trip.title}</strong></p>
        <div className="bg-earth-800 border border-forest-800/40 rounded-xl p-4 mb-6 text-sm text-left space-y-2">
          <div className="flex justify-between"><span className="text-gray-400">Travel Date</span><span className="text-white">{new Date(form.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Vehicle</span><span className="text-white">{form.vehicleType}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Group Size</span><span className="text-white">{form.groupSize} person(s)</span></div>
          <div className="flex justify-between border-t border-forest-900/40 pt-2 mt-2"><span className="text-gray-400">Total Paid</span><span className="text-forest-400 font-bold">₹{totalPrice.toLocaleString('en-IN')}</span></div>
        </div>
        <button onClick={() => navigate('/dashboard')} className="w-full bg-forest-600 hover:bg-forest-500 text-white font-semibold py-3 rounded-xl transition-all">
          View My Bookings
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Book {trip.title} – Fukre Travels</title></Helmet>
      <div className="pt-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="mb-8">
            <p className="text-forest-400 text-sm font-mono uppercase tracking-widest mb-2">Booking</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">{trip.title}</h1>
            <p className="text-gray-400 mt-1 text-sm">{trip.route}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
              {/* Personal Info */}
              <div className="bg-earth-800 border border-forest-900/40 rounded-2xl p-6">
                <h2 className="font-display text-lg font-semibold text-white mb-5">Traveler Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs text-gray-400 uppercase font-mono tracking-widest mb-1 block">Full Name</label>
                    <input value={user?.name} disabled className="w-full bg-earth-900/60 border border-forest-900/30 rounded-xl px-4 py-3 text-sm text-gray-300 opacity-60" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs text-gray-400 uppercase font-mono tracking-widest mb-1 block">Email</label>
                    <input value={user?.email} disabled className="w-full bg-earth-900/60 border border-forest-900/30 rounded-xl px-4 py-3 text-sm text-gray-300 opacity-60" />
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="bg-earth-800 border border-forest-900/40 rounded-2xl p-6">
                <h2 className="font-display text-lg font-semibold text-white mb-5">Trip Details</h2>
                <div className="space-y-4">
                  {/* Date */}
                  <div>
                    <label className="text-xs text-gray-400 uppercase font-mono tracking-widest mb-1 block flex items-center gap-1">
                      <Calendar size={12} /> Travel Start Date *
                    </label>
                    <input type="date" required min={new Date().toISOString().split('T')[0]}
                      value={form.bookingDate} onChange={e => setForm(f => ({ ...f, bookingDate: e.target.value }))}
                      className="w-full bg-earth-900 border border-forest-900/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-forest-600 transition-colors" />
                  </div>

                  {/* Vehicle Type */}
                  <div>
                    <label className="text-xs text-gray-400 uppercase font-mono tracking-widest mb-2 block">Vehicle Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Bike', 'Car'].map(v => (
                        <button type="button" key={v} onClick={() => setForm(f => ({ ...f, vehicleType: v }))}
                          className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${form.vehicleType === v ? 'bg-forest-700 border-forest-500 text-white' : 'border-forest-900/40 text-gray-400 hover:border-forest-700'}`}>
                          {v === 'Bike' ? <Bike size={18} /> : <Car size={18} />} {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Group Size */}
                  <div>
                    <label className="text-xs text-gray-400 uppercase font-mono tracking-widest mb-1 block flex items-center gap-1">
                      <Users size={12} /> Group Size (1–{trip.maxGroupSize})
                    </label>
                    <input type="number" min={1} max={trip.maxGroupSize} value={form.groupSize}
                      onChange={e => setForm(f => ({ ...f, groupSize: Number(e.target.value) }))}
                      className="w-full bg-earth-900 border border-forest-900/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-forest-600" />
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="text-xs text-gray-400 uppercase font-mono tracking-widest mb-1 block">Special Requests (Optional)</label>
                    <textarea value={form.specialRequests} onChange={e => setForm(f => ({ ...f, specialRequests: e.target.value }))} rows={3} placeholder="Dietary needs, medical conditions, special gear..."
                      className="w-full bg-earth-900 border border-forest-900/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-forest-600 resize-none" />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-earth-800 border border-forest-900/40 rounded-2xl p-6">
                <h2 className="font-display text-lg font-semibold text-white mb-5 flex items-center gap-2">
                  <Shield size={18} className="text-forest-500" /> Emergency Contact
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase font-mono tracking-widest mb-1 block">Name</label>
                    <input value={form.emergencyName} onChange={e => setForm(f => ({ ...f, emergencyName: e.target.value }))} placeholder="Contact name"
                      className="w-full bg-earth-900 border border-forest-900/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-forest-600" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase font-mono tracking-widest mb-1 block">Phone</label>
                    <input value={form.emergencyPhone} onChange={e => setForm(f => ({ ...f, emergencyPhone: e.target.value }))} placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-earth-900 border border-forest-900/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-forest-600" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-forest-600 hover:bg-forest-500 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-forest-900/40 active:scale-98 text-lg">
                <CreditCard size={20} />
                {submitting ? 'Processing...' : `Pay ₹${totalPrice.toLocaleString('en-IN')} & Confirm`}
              </button>

              <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                <Shield size={11} /> Secure payment via Razorpay · Free cancellation 7 days before travel
              </p>
            </form>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 bg-earth-800 border border-forest-900/40 rounded-2xl overflow-hidden">
                <img src={trip.coverImage} alt={trip.title} className="w-full h-40 object-cover" />
                <div className="p-5 space-y-4">
                  <h3 className="font-display text-lg font-semibold text-white">{trip.title}</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      { label: 'Duration', value: `${trip.duration} days` },
                      { label: 'State', value: trip.state },
                      { label: 'Difficulty', value: trip.difficulty },
                      { label: 'Price/person', value: `₹${trip.price?.toLocaleString('en-IN')}` },
                      { label: 'Group Size', value: `${form.groupSize} person(s)` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between py-1.5 border-b border-forest-900/20 last:border-0">
                        <span className="text-gray-400">{label}</span>
                        <span className="text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-forest-900/30 border border-forest-800/40 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">Total Amount</span>
                      <span className="font-display text-2xl font-bold text-forest-400">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Incl. all taxes and fees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
