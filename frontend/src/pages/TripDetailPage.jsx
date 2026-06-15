import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TripDetailPage() {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/trips/${id}`
        );

        setTrip(data.trip || data);
      } catch (error) {
        console.error('Error fetching trip:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  if (loading) {
    return (
      <LoadingSpinner
        fullScreen={true}
        text="Loading trip details..."
      />
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Trip Not Found
          </h2>

          <p className="text-gray-400">
            The requested trip does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${trip.name} - Fukre Travels`}</title>

        <meta
          name="description"
          content={trip.description || ''}
        />
      </Helmet>

      <div className="pt-20 min-h-screen bg-earth-900 text-white">

        {/* Cover Image */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <img
            src={
              trip.coverImage ||
              'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200'
            }
            alt={trip.name}
            className="w-full h-[400px] object-cover rounded-2xl"
          />
        </div>

        {/* Details */}
        <div className="max-w-7xl mx-auto px-4 pb-12">

          <h1 className="text-4xl font-bold mb-4">
            {trip.name}
          </h1>

          <p className="text-gray-300 mb-6">
            {trip.description}
          </p>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-earth-800 p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">
                Trip Information
              </h3>

              <p className="mb-2">
                <strong>Location:</strong> {trip.location}
              </p>

              <p className="mb-2">
                <strong>State:</strong> {trip.state}
              </p>

              <p className="mb-2">
                <strong>Duration:</strong> {trip.duration} days
              </p>

              <p className="mb-2">
                <strong>Difficulty:</strong> {trip.difficulty}
              </p>

              <p className="mb-2">
                <strong>Vehicle:</strong>{' '}
                {trip.vehicleType?.join(', ')}
              </p>

              <p className="mb-2">
                <strong>Rating:</strong> ⭐ {trip.rating}
              </p>
            </div>

            <div className="bg-earth-800 p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">
                Pricing
              </h3>

              <div className="text-4xl font-bold text-forest-400 mb-2">
                ₹{trip.price?.toLocaleString('en-IN')}
              </div>

              <p className="text-gray-400">
                Per person
              </p>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}