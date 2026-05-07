import React from 'react';
import { Link } from 'react-router-dom';
import { Bike, MapPin, Phone, Mail, Instagram, Facebook, Youtube, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-earth-900 border-t border-forest-900/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-forest-400 to-forest-700 flex items-center justify-center">
                <Bike size={20} className="text-white" />
              </div>
              <div>
                <span className="font-display text-xl font-bold text-white">Fukre</span>
                <span className="font-display text-xl font-bold text-forest-400"> Travels</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Your ultimate guide to road trips in Northeast India. Explore Arunachal, Meghalaya, Assam & Mizoram on wheels.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-earth-800 border border-forest-800/40 flex items-center justify-center text-gray-400 hover:text-forest-400 hover:border-forest-600 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5">Destinations</h4>
            <ul className="space-y-3">
              {['Arunachal Pradesh', 'Meghalaya', 'Assam', 'Mizoram', 'Nagaland', 'Manipur'].map(dest => (
                <li key={dest}>
                  <Link to={`/trips?state=${encodeURIComponent(dest)}`} className="text-sm text-gray-400 hover:text-forest-400 transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-forest-600 inline-block" />
                    {dest}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: '/trips', label: 'All Trips' },
                { to: '/trips?vehicleType=Bike', label: 'Bike Trips' },
                { to: '/trips?vehicleType=Car', label: 'Car Trips' },
                { to: '/blog', label: 'Travel Blog' },
                { to: '/register', label: 'Join Us' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-forest-400 transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-forest-600 inline-block" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={16} className="text-forest-500 mt-0.5 shrink-0" />
                <span>Paltan Bazar, Guwahati, Assam 781008</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone size={16} className="text-forest-500 shrink-0" />
                +91 94350 XXXXX
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={16} className="text-forest-500 shrink-0" />
                hello@fukretravel.com
              </li>
            </ul>
            <div className="mt-6 p-4 bg-earth-800 rounded-xl border border-forest-800/30">
              <p className="text-xs text-gray-400 font-mono">📍 Based in Guwahati</p>
              <p className="text-xs text-forest-400 mt-1">Northeast India specialists since 2019</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-forest-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© 2024 Fukre Travels. All rights reserved.</p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart size={12} className="text-red-500 fill-red-500" /> for Northeast India
          </p>
        </div>
      </div>
    </footer>
  );
}
