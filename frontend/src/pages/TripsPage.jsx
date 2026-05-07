import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Filter, X, Search, SlidersHorizontal } from 'lucide-react';
import TripCard from '../components/TripCard';
import LoadingSpinner from '../components/LoadingSpinner';

const STATES = ['All', 'Arunachal Pradesh', 'Meghalaya', 'Assam', 'Mizoram', 'Multi-State'];
const DIFFICULTIES = ['All', 'Easy', 'Moderate', 'Hard', 'Expert'];
const VEHICLE_TYPES = ['All', 'Bike', 'Car'];
const DURATIONS = [{ label: 'Any Duration', value: '' }, { label: 'Up to 3 days', value: 3 }, { label: 'Up to 5 days', value: 5 }, { label: 'Up to 7 days', value: 7 }, { label: 'Up to 10 days', value: 10 }];

export default function TripsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    state: searchParams.get('state') || 'All',
    difficulty: 'All',
    vehicleType: searchParams.get('vehicleType') || 'All',
    maxPrice: '',
    duration: '',
    search: ''
  });

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.state !== 'All') params.state = filters.state;
      if (filters.difficulty !== 'All') params.difficulty = filters.difficulty;
      if (filters.vehicleType !== 'All') params.vehicleType = filters.vehicleType;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.duration) params.duration = filters.duration;
      const { data } = await axios.get('/api/trips', { params });

const tripsData = Array.isArray(data)
  ? data
  : data.trips || [];

const filtered = filters.search
  ? tripsData.filter(
      t =>
        t.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.route.toLowerCase().includes(filters.search.toLowerCase())
    )
  : tripsData;

setTrips(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  const updateFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

  const clearFilters = () => setFilters({ state: 'All', difficulty: 'All', vehicleType: 'All', maxPrice: '', duration: '', search: '' });

  const hasActiveFilters = filters.state !== 'All' || filters.difficulty !== 'All' || filters.vehicleType !== 'All' || filters.maxPrice || filters.duration || filters.search;

  return (
    <>
      <Helmet>
        <title>All Trips – Fukre Travels | Northeast India Road Trips</title>
        <meta name="description" content="Browse bike and car road trips in Arunachal Pradesh, Meghalaya, Assam and Mizoram. Filter by state, price, duration and difficulty." />
      </Helmet>

      <div className="pt-20 min-h-screen">
        {/* Header */}
        <div className="bg-earth-800/80 border-b border-forest-900/40 py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-forest-400 text-sm font-mono tracking-widest uppercase mb-2">All Adventures</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Northeast Road Trips</h1>
            <p className="text-gray-400 max-w-xl">Curated bike and car journeys through the most spectacular landscapes of Northeast India.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search + Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search trips, routes..."
                value={filters.search}
                onChange={e => updateFilter('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-earth-800 border border-forest-900/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-forest-600 text-sm"
              />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 bg-earth-800 border border-forest-900/40 rounded-xl text-sm font-medium hover:border-forest-600 transition-colors">
              <SlidersHorizontal size={16} className="text-forest-400" />
              Filters {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-forest-400 inline-block" />}
            </button>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:text-red-300 transition-colors">
                <X size={16} /> Clear
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-earth-800 border border-forest-900/40 rounded-2xl p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* State */}
              <div>
                <label className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-2 block">State</label>
                <div className="flex flex-wrap gap-2">
                  {STATES.map(s => (
                    <button key={s} onClick={() => updateFilter('state', s)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${filters.state === s ? 'bg-forest-600 border-forest-600 text-white' : 'border-forest-900/40 text-gray-400 hover:border-forest-700'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {/* Difficulty */}
              <div>
                <label className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-2 block">Difficulty</label>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTIES.map(d => (
                    <button key={d} onClick={() => updateFilter('difficulty', d)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${filters.difficulty === d ? 'bg-forest-600 border-forest-600 text-white' : 'border-forest-900/40 text-gray-400 hover:border-forest-700'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              {/* Vehicle */}
              <div>
                <label className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-2 block">Vehicle</label>
                <div className="flex flex-wrap gap-2">
                  {VEHICLE_TYPES.map(v => (
                    <button key={v} onClick={() => updateFilter('vehicleType', v)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${filters.vehicleType === v ? 'bg-forest-600 border-forest-600 text-white' : 'border-forest-900/40 text-gray-400 hover:border-forest-700'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              {/* Duration */}
              <div>
                <label className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-2 block">Max Duration</label>
                <select value={filters.duration} onChange={e => updateFilter('duration', e.target.value)}
                  className="w-full bg-earth-900 border border-forest-900/40 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-forest-600">
                  {DURATIONS.map(d => <option key={d.label} value={d.value}>{d.label}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400 text-sm">{trips.length} trip{trips.length !== 1 ? 's' : ''} found</p>
          </div>

          {/* Trips Grid */}
          {loading ? <LoadingSpinner fullScreen={false} text="Finding your adventures..." /> : (
            trips.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🏔️</div>
                <h3 className="font-display text-2xl text-white mb-2">No trips found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters</p>
                <button onClick={clearFilters} className="bg-forest-600 hover:bg-forest-500 text-white px-6 py-3 rounded-full text-sm">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(Array.isArray(trips) ? trips : []).map((trip, i) => (
  <TripCard key={trip._id} trip={trip} index={i} />
))}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
