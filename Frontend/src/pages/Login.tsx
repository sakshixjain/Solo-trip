import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, demoLogin } = useAuth();
  const { showToast } = useWishlist();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      showToast('Welcome back to SoloTrip!', 'success');
      navigate('/');
    } else {
      setError(res.message || 'Login failed. Please check your email and password.');
    }
  };

  const handleDemo = () => {
    demoLogin();
    showToast('Logged in as Demo Solo Explorer!', 'info');
    navigate('/');
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div 
        style={{ 
          background: 'var(--bg-surface)', 
          borderRadius: 24, 
          padding: '40px 36px', 
          maxWidth: 440, 
          width: '100%', 
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-light)' 
        }}
        className="animate-scale-up"
      >
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div 
            style={{ 
              width: 48, 
              height: 48, 
              borderRadius: 14, 
              background: 'var(--primary)', 
              color: '#ffffff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 12px' 
            }}
          >
            <Plane size={24} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            Sign in to access your wishlist, bookings, and community threads.
          </p>
        </div>

        {/* 1-Click Demo Button */}
        <button
          type="button"
          onClick={handleDemo}
          style={{
            width: '100%',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontSize: '0.92rem',
            cursor: 'pointer'
          }}
        >
          <Sparkles size={16} color="#4f46e5" />
          <span>Instant 1-Click Demo Sign In</span>
        </button>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: '0.85rem',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ color: 'var(--text-primary)' }}>Email Address</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: 'var(--text-primary)' }}>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '13px', marginTop: 8 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don’t have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
