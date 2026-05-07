import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, ChevronRight, Bike, Car, TrendingUp } from 'lucide-react';

const difficultyColors = {
  Easy: 'text-green-400 bg-green-400/10 border-green-400/30',
  Moderate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  Hard: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  Expert: 'text-red-400 bg-red-400/10 border-red-400/30',
};

export default function TripCard({ trip, index = 0 }) {
  return (
    <div
      className="group bg-earth-800 border border-forest-800/30 rounded-2xl overflow-hidden hover:border-forest-600/50 transition-all duration-400 hover:shadow-2xl hover:shadow-forest-900/40 hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={trip.coverImage || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-900 via-transparent to-transparent" />
        {trip.featured && (
          <div className="absolute top-3 left-3 bg-forest-600/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
            ⭐ Featured
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm ${difficultyColors[trip.difficulty]}`}>
            {trip.difficulty}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          {trip.vehicleType?.includes('Bike') && <Bike size={14} className="text-forest-400" />}
          {trip.vehicleType?.includes('Car') && <Car size={14} className="text-blue-400" />}
          <span className="text-xs text-gray-300">{trip.vehicleType?.join(' / ')}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-semibold text-lg text-white leading-snug group-hover:text-forest-300 transition-colors">
            {trip.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
          <MapPin size={12} className="text-forest-500" />
          <span>{trip.state}</span>
          <span className="mx-1">·</span>
          <TrendingUp size={12} />
          <span>{trip.route?.split('→')[0]?.trim()} → ...</span>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">{trip.description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-forest-500" />
            <span>{trip.duration} days</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span>{trip.rating} ({trip.reviewCount})</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-forest-900/40">
          <div>
            <span className="text-xs text-gray-500">From</span>
            <div className="text-forest-400 font-bold text-xl font-mono">
              ₹{trip.price?.toLocaleString('en-IN')}
            </div>
            <span className="text-xs text-gray-500">per person</span>
          </div>
          <Link
            to={`/trips/${trip.slug || trip._id}`}
            className="flex items-center gap-1.5 bg-forest-600 hover:bg-forest-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-forest-900/40 active:scale-95"
          >
            Explore <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
