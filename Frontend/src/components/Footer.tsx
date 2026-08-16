import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Send, ShieldCheck } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useWishlist();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    showToast('🎉 Subscribed to SoloTrip weekly newsletter!', 'success');
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div>
            <Link to="/" className="nav-brand" style={{ color: '#ffffff' }}>
              <span className="brand-icon" style={{ background: '#ffffff', color: '#0f172a' }}>
                <Plane size={18} />
              </span>
              <span>SoloTrip</span>
            </Link>
            <p className="footer-brand-desc">
              Empowering solo travelers around the globe with curated adventures, verified stays, real stories, and a vibrant community that looks out for each other.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={16} color="#10b981" /> 100% Verified Solo Stays
              </span>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="footer-col-title">Explore</h4>
            <ul className="footer-links">
              <li><Link to="/trips" className="footer-link">Browse Trips</Link></li>
              <li><Link to="/destinations" className="footer-link">Popular Destinations</Link></li>
              <li><Link to="/stories" className="footer-link">Travel Stories</Link></li>
              <li><Link to="/community" className="footer-link">Community Discussions</Link></li>
              <li><Link to="/wishlist" className="footer-link">Saved Wishlist</Link></li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="footer-col-title">Solo Travel</h4>
            <ul className="footer-links">
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/about" className="footer-link">Solo Safety Guide</Link></li>
              <li><Link to="/community" className="footer-link">Find Travel Buddies</Link></li>
              <li><Link to="/about" className="footer-link">FAQs</Link></li>
              <li><Link to="/about" className="footer-link">Contact Support</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="footer-col-title">Stay Inspired</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Get weekly hidden gems, solo itineraries, and gear recommendations directly in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="footer-newsletter-input">
              <input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="footer-input"
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ background: '#38bdf8', color: '#0f172a' }}>
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} SoloTrip Technologies Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/about" className="footer-link">Privacy Policy</Link>
            <Link to="/about" className="footer-link">Terms of Service</Link>
            <Link to="/about" className="footer-link">Safety Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
