import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
    showToast('🎉 Thank you for subscribing to SoloTrip updates!', 'success');
    setEmail('');
  };

  return (
    <footer className="solotrip-footer">
      <div className="container">
        <div className="solotrip-footer-grid">
          {/* Col 1: Brand & Tagline */}
          <div className="solotrip-footer-brand-col">
            <Link to="/" className="solotrip-footer-brand">
              <img src="/solotrip-logo.png" alt="SoloTrip Logo" className="solotrip-footer-logo-img" />
              <span className="solotrip-footer-brand-text">SoloTrip</span>
            </Link>
            
            <p className="solotrip-footer-tagline">
              Your journey. Your rules.<br />
              Discover. Plan. Explore.
            </p>

            <div className="solotrip-footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="solotrip-social-btn" aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="solotrip-social-btn" aria-label="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="solotrip-social-btn" aria-label="Twitter">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="solotrip-social-btn" aria-label="YouTube">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="solotrip-footer-links-col">
            <h4 className="solotrip-footer-col-title">Quick Links</h4>
            <ul className="solotrip-footer-links-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/destinations">Explore</Link></li>
              <li><Link to="/trips">Trips</Link></li>
              <li><Link to="/wishlist">Favorites</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div className="solotrip-footer-links-col">
            <h4 className="solotrip-footer-col-title">Support</h4>
            <ul className="solotrip-footer-links-list">
              <li><Link to="/about">Help Center</Link></li>
              <li><Link to="/about">Safety Tips</Link></li>
              <li><Link to="/about">Privacy Policy</Link></li>
              <li><Link to="/about">Terms & Conditions</Link></li>
              <li><Link to="/about">Contact Us</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="solotrip-footer-news-col">
            <h4 className="solotrip-footer-col-title">Newsletter</h4>
            <p className="solotrip-footer-news-desc">
              Stay updated with our latest travel destinations and tips.
            </p>
            <form onSubmit={handleSubscribe} className="solotrip-footer-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="solotrip-footer-input"
                required
              />
              <button type="submit" className="solotrip-footer-submit">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="solotrip-footer-bottom">
          <p>© 2025 SoloTrip. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
