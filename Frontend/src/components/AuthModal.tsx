import { useState } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    authModalMode, 
    closeAuthModal, 
    openAuthModal, 
    login, 
    register, 
    demoLogin 
  } = useAuth();
  
  const { showToast } = useWishlist();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isAuthModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isLogin) {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        showToast('Welcome back to SoloTrip!', 'success');
      } else {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } else {
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      const res = await register({
        name,
        email,
        password,
        city,
        state,
      });
      setLoading(false);
      if (res.success) {
        showToast('🎉 Account created! Welcome to SoloTrip!', 'success');
      } else {
        setError(res.message || 'Registration failed. Try a different email.');
      }
    }
  };

  const handleDemoClick = () => {
    demoLogin();
    showToast('Logged in as Demo Solo Explorer!', 'info');
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div className="modal-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeAuthModal}>
          <X size={20} />
        </button>

        {/* Tab Headers */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
          <button
            type="button"
            onClick={() => { setError(null); openAuthModal('login'); }}
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: isLogin ? '#0f172a' : '#94a3b8',
              borderBottom: isLogin ? '2px solid #0f172a' : 'none',
              paddingBottom: 4
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setError(null); openAuthModal('register'); }}
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: !isLogin ? '#0f172a' : '#94a3b8',
              borderBottom: !isLogin ? '2px solid #0f172a' : 'none',
              paddingBottom: 4
            }}
          >
            Create Account
          </button>
        </div>

        {/* Demo Login Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #eef2ff 0%, #f0fdf4 100%)',
            border: '1px solid #cbd5e1',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12
          }}
        >
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Sparkles size={16} color="#4f46e5" /> Instant Demo Access
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Explore trips, wishlist, & community without typing
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleDemoClick}
            style={{ background: '#0f172a' }}
          >
            1-Click Demo
          </button>
        </div>

        {error && (
          <div
            style={{
              background: '#fef2f2',
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
          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    placeholder="e.g. Maharashtra"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
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
            <label className="form-label">Password</label>
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
            style={{ width: '100%', padding: '12px', marginTop: 10 }}
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In to SoloTrip' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
