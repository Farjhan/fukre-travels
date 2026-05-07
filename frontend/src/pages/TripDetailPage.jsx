import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { MapPin, Clock, Star, Users, Bike, Car, ChevronRight, ChevronDown, ChevronUp, Check, ArrowLeft, TrendingUp, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const difficultyColors = { Easy: 'text-green-400', Moderate: 'text-yellow-400', Hard: 'text-orange-400', Expert: 'text-red-400' };

export default function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [openDay, setOpenDay] = useState(0);

  useEffect(() => {
    axios.get(`/api/trips/${id}`)
  .then(r => {
    setTrip(r.data?.trip || r.data);
    setLoading(false);
  })
  .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading trip details..." />;
  if (!trip) return <div className="min-h-screen flex items-center justify-center text-white"><div className="text-center"><p className="text-4xl mb-4">🏔️</p><h2 className="font-display text-2xl">Trip not found</h2><Link to="/trips" className="text-forest-400 mt-4 inline-block">← Back to trips</Link></div></div>;

  const images = trip.images?.length ? trip.images : [trip.coverImage].filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{trip.title} – Fukre Travels</title>
        <meta name="description" content={trip.description?.slice(0, 160)} />
        <meta name="keywords" content={`${trip.state} road trip, ${trip.route}, Northeast India bike trip`} />
      </Helmet>

      <div className="pt-20 min-h-screen">
        {/* Hero Image */}
        <div className="relative h-[60vh] overflow-hidden">
          <img src={images[activeImg] || trip.coverImage} alt={trip.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-earth-900 via-earth-900/20 to-transparent" />
          <button onClick={() => navigate(-1)} className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/20 text-white rounded-full px-4 py-2 text-sm hover:bg-black/60 transition-all">
            <ArrowLeft size={16} /> Back
          </button>
          {trip.featured && (
            <div className="absolute top-6 right-6 bg-forest-600/90 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full">⭐ Featured Trip</div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10 flex gap-3 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? 'border-forest-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Meta */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-xs font-mono text-forest-400 uppercase tracking-widest bg-forest-900/40 px-3 py-1 rounded-full">{trip.state}</span>
                <span className={`text-xs font-medium ${difficultyColors[trip.difficulty]}`}>● {trip.difficulty}</span>
                {trip.vehicleType?.map(v => (
                  <span key={v} className="text-xs text-gray-400 flex items-center gap-1">
                    {v === 'Bike' ? <Bike size={12} /> : <Car size={12} />} {v}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">{trip.title}</h1>
              <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-4">
                <TrendingUp size={14} className="text-forest-500" />
                <span className="font-mono">{trip.route}</span>
              </div>
              <div className="flex flex-wrap gap-5 text-sm text-gray-400">
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-forest-500" /> {trip.duration} Days</span>
                <span className="flex items-center gap-1.5"><Users size={14} className="text-forest-500" /> Max {trip.maxGroupSize} people</span>
                <span className="flex items-center gap-1.5"><Star size={14} className="text-yellow-400 fill-yellow-400" /> {trip.rating} ({trip.reviewCount} reviews)</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-forest-500" /> {trip.state}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-display text-2xl font-semibold text-white mb-3">About This Trip</h2>
              <p className="text-gray-300 leading-relaxed">{trip.description}</p>
            </div>

            {/* Highlights */}
            {trip.highlights?.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-semibold text-white mb-4">Trip Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {trip.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 bg-earth-800 border border-forest-900/30 rounded-xl p-3">
                      <Check size={15} className="text-forest-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-300">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {trip.itinerary?.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-semibold text-white mb-4">Day-by-Day Itinerary</h2>
                <div className="space-y-3">
                  {trip.itinerary.map((day, i) => (
                    <div key={i} className="bg-earth-800 border border-forest-900/30 rounded-xl overflow-hidden">
                      <button className="w-full flex items-center justify-between p-4 text-left" onClick={() => setOpenDay(openDay === i ? -1 : i)}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-forest-900 border border-forest-700 flex items-center justify-center text-xs font-bold text-forest-400 shrink-0">
                            {day.day}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{day.title}</div>
                            {day.distance && <div className="text-xs text-forest-500 font-mono">{day.distance}</div>}
                          </div>
                        </div>
                        {openDay === i ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                      </button>
                      {openDay === i && (
                        <div className="px-4 pb-4 border-t border-forest-900/30">
                          <p className="text-gray-300 text-sm leading-relaxed mt-3">{day.description}</p>
                          {day.stay && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                              <Shield size={12} className="text-forest-600" />
                              <span>Stay: {day.stay}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div>
              <h2 className="font-display text-2xl font-semibold text-white mb-4">Route Map</h2>
              <div className="rounded-2xl overflow-hidden border border-forest-900/40 bg-earth-800 h-72 flex items-center justify-center">
                {trip.mapEmbedUrl ? (
                  <iframe src={trip.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Trip Map" />
                ) : (
                  <div className="text-center text-gray-500">
                    <MapPin size={40} className="mx-auto mb-3 text-forest-800" />
                    <p className="text-sm">Map: {trip.route}</p>
                    <a href={`https://maps.google.com?q=${encodeURIComponent(trip.route)}`} target="_blank" rel="noreferrer"
                      className="text-xs text-forest-400 mt-2 inline-block">View on Google Maps →</a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-earth-800 border border-forest-800/40 rounded-2xl p-6 shadow-2xl">
              <div className="mb-5">
                <div className="text-gray-400 text-xs uppercase font-mono tracking-widest mb-1">Price per person</div>
                <div className="font-display text-4xl font-bold text-forest-400">₹{trip.price?.toLocaleString('en-IN')}</div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                {[
                  { label: 'Duration', value: `${trip.duration} Days` },
                  { label: 'Difficulty', value: trip.difficulty },
                  { label: 'Max Group Size', value: `${trip.maxGroupSize} people` },
                  { label: 'Vehicle', value: trip.vehicleType?.join(', ') },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2 border-b border-forest-900/30">
                    <span className="text-gray-400">{label}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>

              {user ? (
                <Link to={`/book/${trip._id}`}
                  className="w-full flex items-center justify-center gap-2 bg-forest-600 hover:bg-forest-500 text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-forest-900/40 active:scale-95 text-center">
                  Book This Trip <ChevronRight size={18} />
                </Link>
              ) : (
                <div className="space-y-3">
                  <Link to={`/login?redirect=/book/${trip._id}`}
                    className="w-full flex items-center justify-center gap-2 bg-forest-600 hover:bg-forest-500 text-white font-bold py-4 rounded-xl transition-all text-center">
                    Login to Book
                  </Link>
                  <p className="text-center text-xs text-gray-500">No account? <Link to="/register" className="text-forest-400">Sign up free</Link></p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Shield size={12} /> Free cancellation up to 7 days before
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
