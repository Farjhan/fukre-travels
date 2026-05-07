import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { ChevronDown, MapPin, Clock, Users, Star, ArrowRight, Wind, Mountain, Bike, Car, Shield, Quote } from 'lucide-react';
import TripCard from '../components/TripCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
    label: 'Tawang, Arunachal Pradesh',
    tagline: 'Ride Beyond the Clouds'
  },
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    label: 'Meghalaya Highland Roads',
    tagline: 'Where Mist Meets the Road'
  },
  {
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=80',
    label: 'Kaziranga, Assam',
    tagline: 'Wild Roads, Wilder Souls'
  }
];

const DESTINATIONS = [
  { name: 'Arunachal Pradesh', tag: 'High Altitude', description: 'Sela Pass · Tawang · Ziro · Bomdila', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', color: 'from-blue-900 to-blue-950' },
  { name: 'Meghalaya', tag: 'Scotland of East', description: 'Cherrapunji · Dawki · Mawlynnong · Shillong', img: 'https://images.unsplash.com/photo-1598887141942-ab41e7e87be3?w=600', color: 'from-emerald-900 to-emerald-950' },
  { name: 'Assam', tag: 'Wildlife Country', description: 'Kaziranga · Majuli · Sivsagar · Haflong', img: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600', color: 'from-amber-900 to-amber-950' },
  { name: 'Mizoram', tag: 'Hidden Gem', description: 'Aizawl · Champhai · Reiek · Lunglei', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', color: 'from-purple-900 to-purple-950' }
];

const TESTIMONIALS = [
  { name: 'Rahul Sharma', city: 'Bangalore', rating: 5, text: 'The Tawang circuit was life-changing. Fukre Travels managed every permit, stay, and route perfectly. Sela Pass at sunrise — I\'ll never forget it.', trip: 'Tawang Monastery Circuit', avatar: 'R' },
  { name: 'Priya Gogoi', city: 'Guwahati', rating: 5, text: 'Did the Meghalaya trip with 4 friends on bikes. The living root bridge trek and Dawki boating were surreal. Best trip of my life!', trip: 'Meghalaya Living Roots Explorer', avatar: 'P' },
  { name: 'Arnab Das', city: 'Kolkata', rating: 5, text: 'As a first-time Arunachal traveler, I was nervous about the permits and roads. Fukre handled everything seamlessly. Already planning my next trip!', trip: 'Ziro Valley Culture Trail', avatar: 'A' },
  { name: 'Sneha Borah', city: 'Delhi', rating: 5, text: 'Kaziranga jeep safari + Majuli island on bikes = perfection. The homestay on Majuli was authentic and warm. Absolutely recommended!', trip: 'Kaziranga Bikers Trail', avatar: 'S' }
];

const STATS = [
  { icon: Bike, value: '500+', label: 'Trips Completed' },
  { icon: MapPin, value: '4', label: 'Northeast States' },
  { icon: Users, value: '2000+', label: 'Happy Riders' },
  { icon: Star, value: '4.8', label: 'Average Rating' }
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    axios.get('/api/trips?featured=true').then(r => {
      setFeaturedTrips(r.data.slice(0, 4));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Fukre Travels – Northeast India Bike & Car Road Trips</title>
        <meta name="description" content="Explore Northeast India on wheels. Bike & car road trips in Arunachal Pradesh, Meghalaya, Assam, and Mizoram. Book curated road trips with expert guides." />
        <meta name="keywords" content="Northeast bike trips, Arunachal road trip, Meghalaya travel, Assam road trip, Tawang bike trip, Northeast India travel" />
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        {HERO_SLIDES.map((s, i) => (
          <div key={i} className={`absolute inset-0 transition-all duration-1000 ${i === slide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
            <img src={s.image} alt={s.label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-earth-900" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-white/80 mb-6 animate-fade-in">
            <Wind size={14} className="text-forest-400" />
            <span>{HERO_SLIDES[slide].label}</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white max-w-5xl leading-tight mb-4 animate-fade-up">
            Explore Northeast India
            <br />
            <span className="text-forest-400 italic">on Wheels</span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {HERO_SLIDES[slide].tagline}
          </p>
          <p className="text-base text-white/50 max-w-xl mb-10 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            Curated bike & car road trips through Arunachal Pradesh, Meghalaya, Assam & Mizoram. Expert-guided. Fully managed. Unforgettable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/trips"
              className="group bg-forest-600 hover:bg-forest-500 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-forest-900/60 hover:-translate-y-0.5 flex items-center gap-2">
              Explore Trips <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/register"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 flex items-center gap-2">
              <Bike size={18} /> Join as Rider
            </Link>
          </div>

          {/* Slide dots */}
          <div className="flex gap-2 mt-12">
            {HERO_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                className={`transition-all duration-300 rounded-full ${i === slide ? 'w-8 h-2 bg-forest-400' : 'w-2 h-2 bg-white/30'}`} />
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown size={24} className="text-white/40" />
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────── */}
      <section className="bg-earth-800 border-y border-forest-900/40 py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ icon: Icon, value, label }, i) => (
            <div key={i} className="text-center">
              <div className="flex justify-center mb-2">
                <Icon size={22} className="text-forest-400" />
              </div>
              <div className="font-display text-3xl font-bold text-white mb-1">{value}</div>
              <div className="text-sm text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DESTINATIONS ─────────────────────────────────────── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-forest-400 text-sm font-mono tracking-widest uppercase mb-3">Our Territories</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Featured Destinations</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Four states, a thousand roads, infinite adventures. Pick your next frontier.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {DESTINATIONS.map((dest, i) => (
            <Link key={i} to={`/trips?state=${encodeURIComponent(dest.name)}`}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer">
              <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className={`absolute inset-0 bg-gradient-to-t ${dest.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-xs font-mono text-forest-400 tracking-widest uppercase mb-1">{dest.tag}</div>
                <h3 className="font-display text-xl font-bold text-white mb-1">{dest.name}</h3>
                <p className="text-xs text-gray-300">{dest.description}</p>
                <div className="mt-3 flex items-center gap-1 text-forest-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                  Explore <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED TRIPS ───────────────────────────────────── */}
      <section className="py-20 px-4 bg-earth-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-forest-400 text-sm font-mono tracking-widest uppercase mb-3">Hand-Picked</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white">Popular Road Trips</h2>
            </div>
            <Link to="/trips" className="flex items-center gap-2 text-forest-400 hover:text-forest-300 font-medium transition-colors group">
              View all trips <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {loading ? (
  <LoadingSpinner fullScreen={false} text="Loading trips..." />
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.isArray(featuredTrips)
      ? featuredTrips.map((trip, i) => (
          <TripCard key={trip._id} trip={trip} index={i} />
        ))
      : null}
  </div>
)}
        </div>
      </section>

      {/* ── WHY US ──────────────────────────────────────────── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-forest-400 text-sm font-mono tracking-widest uppercase mb-3">Why Fukre Travels</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">Built for Riders, by Riders</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Mountain, title: 'Expert Local Guides', desc: 'Our guides are passionate Northeast natives who know every mountain pass, shortcut, and hidden gem.' },
            { icon: Shield, title: 'End-to-End Management', desc: 'Permits, hotels, mechanics, medical support — we handle it all so you focus on riding.' },
            { icon: Star, title: 'Curated Experiences', desc: 'Every route is personally tested by our team. We only offer trips we\'d take ourselves.' },
          ].map((f, i) => (
            <div key={i} className="group p-8 bg-earth-800 border border-forest-900/40 rounded-2xl hover:border-forest-600/40 transition-all hover:shadow-xl hover:shadow-forest-900/20">
              <div className="w-12 h-12 rounded-xl bg-forest-900/60 border border-forest-800 flex items-center justify-center mb-5 group-hover:bg-forest-800 transition-colors">
                <f.icon size={22} className="text-forest-400" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-3">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────── */}
      <section className="py-20 px-4 bg-earth-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-forest-400 text-sm font-mono tracking-widest uppercase mb-3">Rider Stories</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">What Our Riders Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-earth-800 border border-forest-900/40 rounded-2xl p-6 hover:border-forest-700/40 transition-all">
                <Quote size={24} className="text-forest-800 mb-4" />
                <p className="text-gray-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={12} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <div className="flex items-center gap-3 border-t border-forest-900/40 pt-4">
                  <div className="w-9 h-9 rounded-full bg-forest-700 flex items-center justify-center text-sm font-bold text-white">{t.avatar}</div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.city} · {t.trip}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900/80 to-earth-900" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #22c55e 0, transparent 60%)' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
            Ready to Hit the Road?
          </h2>
          <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8">
            Join 2000+ riders who've explored Northeast India with us. Your adventure starts with a single booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/trips" className="group bg-forest-600 hover:bg-forest-500 text-white font-bold px-10 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-forest-900/60 flex items-center justify-center gap-2 text-lg">
              Book Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/blog" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-10 py-4 rounded-full transition-all flex items-center justify-center gap-2">
              Read Travel Tips
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
