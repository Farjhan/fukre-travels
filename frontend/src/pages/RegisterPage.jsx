import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);

    const result = await register(form.name, form.email, form.password, '');

    if (result.success) {
      navigate('/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-earth-900">
      <div className="w-full max-w-md bg-earth-800 border border-forest-900/40 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Create Account
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Join Fukre Travels today
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-earth-900 border border-forest-900/40 text-white focus:outline-none focus:border-forest-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-earth-900 border border-forest-900/40 text-white focus:outline-none focus:border-forest-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-earth-900 border border-forest-900/40 text-white focus:outline-none focus:border-forest-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-earth-900 border border-forest-900/40 text-white focus:outline-none focus:border-forest-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-600 hover:bg-forest-500 text-white font-semibold py-3 rounded-xl transition-all"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>

        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-forest-400 hover:text-forest-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}