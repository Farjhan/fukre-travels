import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { X, Search, SlidersHorizontal } from 'lucide-react';
import TripCard from '../components/TripCard';
import LoadingSpinner from '../components/LoadingSpinner';

const STATES = ['All', 'Arunachal Pradesh', 'Meghalaya', 'Assam', 'Mizoram', 'Multi-State'];
const DIFFICULTIES = ['All', 'Easy', 'Moderate', 'Hard', 'Expert'];
const VEHICLE_TYPES = ['All', 'Bike', 'Car'];
const DURATIONS = [
  { label: 'Any Duration', value: '' },
  { label: 'Up to 3 days', value: 3 },
  { label: 'Up to 5 days', value: 5 },
  { label: 'Up to 7 days', value: 7 },
  { label: 'Up to 10 days', value: 10 }
];

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    state: 'All',
    difficulty: 'All',
    vehicleType: 'All',
    maxPrice: '',
    duration: '',
    search: ''
  });

  const fetchTrips = useCallback(async () => {
    setLoading(true);

    try {
      const params = {};

      if (filters.state !== 'All') {
        params.state = filters.state;
      }

      if (filters.difficulty !== 'All') {
        params.difficulty = filters.difficulty;
      }

      if (filters.vehicleType !== 'All') {
        params.vehicleType = filters.vehicleType;
      }

      if (filters.maxPrice) {
        params.maxPrice = filters.maxPrice;
      }

      if (filters.duration) {
        params.duration = filters.duration;
      }

      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/trips`,
        { params }
      );

      const tripsData = Array.isArray(data)
        ? data
        : data.trips || [];

      const filteredTrips = filters.search
        ? tripsData.filter(
            trip =>
              (trip.name || '')
                .toLowerCase()
                .includes(filters.search.toLowerCase()) ||
              (trip.location || '')
                .toLowerCase()
                .includes(filters.search.toLowerCase())
          )
        : tripsData;

      setTrips(filteredTrips);

    } catch (err) {
      console.error('Error fetching trips:', err);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      state: 'All',
      difficulty: 'All',
      vehicleType: 'All',
      maxPrice: '',
      duration: '',
      search: ''
    });
  };

  const hasActiveFilters =
    filters.state !== 'All' ||
    filters.difficulty !== 'All' ||
    filters.vehicleType !== 'All' ||
    filters.maxPrice ||
    filters.duration ||
    filters.search;

  return (
    <>
      <Helmet>
        <title>All Trips – Fukre Travels</title>
      </Helmet>

      <div className="pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                placeholder="Search trips..."
                value={filters.search}
                onChange={e => updateFilter('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-earth-800 border rounded-xl text-white"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 bg-earth-800 border rounded-xl"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-3 text-red-400"
              >
                <X size={16} />
                Clear
              </button>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-400 text-sm">
              {trips.length} trip{trips.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {loading ? (
            <LoadingSpinner
              fullScreen={false}
              text="Finding your adventures..."
            />
          ) : trips.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🏔️</div>

              <h3 className="text-2xl text-white mb-2">
                No trips found
              </h3>

              <button
                onClick={clearFilters}
                className="bg-forest-600 text-white px-6 py-3 rounded-full"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trips.map((trip, index) => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}