import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, LayoutDashboard, Settings, Bike } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setOpen(false); setDropOpen(false); }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/trips', label: 'Trips' },
    { to: '/blog', label: 'Blog' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-earth-900/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-forest-800/30' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-forest-400 to-forest-700 flex items-center justify-center shadow-lg shadow-forest-900/40 group-hover:scale-110 transition-transform">
              <Bike size={18} className="text-white" />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-white">Fukre</span>
              <span className="font-display text-xl font-bold text-forest-400"> Travels</span>
              <div className="text-[9px] text-forest-500 tracking-widest uppercase font-mono -mt-0.5">Northeast India</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`text-sm font-medium transition-colors relative group ${location.pathname === link.to ? 'text-forest-400' : 'text-gray-300 hover:text-white'}`}>
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-forest-400 transition-all duration-300 ${location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors">Admin</Link>
            )}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 bg-earth-800 hover:bg-earth-700 border border-forest-800/40 rounded-full px-4 py-2 text-sm font-medium transition-all">
                  <div className="w-6 h-6 rounded-full bg-forest-600 flex items-center justify-center text-xs font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                  {user.name.split(' ')[0]}
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-earth-800 border border-forest-800/40 rounded-xl shadow-2xl overflow-hidden">
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-earth-700 transition-colors">
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    {isAdmin && <Link to="/admin" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-earth-700 transition-colors text-amber-400">
                      <Settings size={15} /> Admin Panel
                    </Link>}
                    <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-earth-700 text-red-400 transition-colors">
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="bg-forest-600 hover:bg-forest-500 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:shadow-forest-900/40 active:scale-95">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-white p-2">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-earth-900/98 backdrop-blur-lg border-t border-forest-800/30 px-4 py-4 space-y-2">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === link.to ? 'bg-forest-900/60 text-forest-400' : 'text-gray-300'}`}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/dashboard" className="block px-4 py-3 rounded-xl text-sm text-gray-300">Dashboard</Link>
              <button onClick={logout} className="block w-full text-left px-4 py-3 rounded-xl text-sm text-red-400">Logout</button>
            </>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="flex-1 text-center py-2.5 border border-forest-700 rounded-full text-sm">Login</Link>
              <Link to="/register" className="flex-1 text-center py-2.5 bg-forest-600 rounded-full text-sm font-medium">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
