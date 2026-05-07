import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Bike, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function AuthLayout({ title, subtitle, children, alt }) {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(21,128,61,0.15)_0,transparent_70%)]" />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-forest-400 to-forest-700 flex items-center justify-center">
              <Bike size={22} className="text-white" />
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-400 text-sm">{subtitle}</p>
        </div>
        <div className="bg-earth-800 border border-forest-800/30 rounded-2xl p-8 shadow-2xl">
          {children}
        </div>
        <div className="text-center mt-6 text-sm text-gray-400">{alt}</div>
      </div>
    </div>
  );
}

function InputField({ label, type = 'text', value, onChange, placeholder, show, onToggle }) {
  return (
    <div>
      <label className="text-xs text-gray-400 uppercase font-mono tracking-widest mb-1.5 block">{label}</label>
      <div className="relative">
        <input type={show !== undefined ? (show ? 'text' : 'password') : type} value={value} onChange={onChange} placeholder={placeholder} required
          className="w-full bg-earth-900 border border-forest-900/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-forest-600 transition-colors" />
        {onToggle && (
          <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.email, form.password);
    if (result.success) navigate(params.get('redirect') || (result.user?.role === 'admin' ? '/admin' : '/dashboard'));
    setLoading(false);
  };

  return (
    <>
      <Helmet><title>Login – Fukre Travels</title></Helmet>
      <AuthLayout title="Welcome Back" subtitle="Login to continue your adventure"
        alt={<>Don't have an account? <Link to="/register" className="text-forest-400 hover:text-forest-300">Sign up free</Link></>}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" />
          <InputField label="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" show={showPass} onToggle={() => setShowPass(!showPass)} />

          <div className="bg-earth-900/60 border border-forest-900/30 rounded-xl p-3 text-xs text-gray-400">
            <p className="font-mono text-forest-500 mb-1">Demo Credentials:</p>
            <p>Admin: admin@fukretravel.com / admin123</p>
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-forest-600 hover:bg-forest-500 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-forest-900/40 mt-2">
            {loading ? 'Logging in...' : <><span>Login</span> <ArrowRight size={16} /></>}
          </button>
        </form>
      </AuthLayout>
    </>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(form.name, form.email, form.password, form.phone);
    if (result.success) navigate('/dashboard');
    setLoading(false);
  };

  return (
    <>
      <Helmet><title>Sign Up – Fukre Travels</title></Helmet>
      <AuthLayout title="Join Fukre Travels" subtitle="Create your rider account and start exploring"
        alt={<>Already have an account? <Link to="/login" className="text-forest-400 hover:text-forest-300">Login</Link></>}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" />
          <InputField label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" />
          <InputField label="Phone (Optional)" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
          <InputField label="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters" show={showPass} onToggle={() => setShowPass(!showPass)} />
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-forest-600 hover:bg-forest-500 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-forest-900/40 mt-2">
            {loading ? 'Creating Account...' : <><span>Create Account</span> <ArrowRight size={16} /></>}
          </button>
        </form>
      </AuthLayout>
    </>
  );
}

export default LoginPage;
