import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Heart, 
  LogOut, 
  Menu, 
  X, 
  CalendarCheck, 
  User as UserIcon,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { wishlistIds, bookings } = useWishlist();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    if (path === '/destinations' && location.pathname === '/explore') return true;
    return false;
  };

  return (
    <header className="navbar-wrapper">
      <div className="container navbar">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand">
          <img src="/solotrip-logo.png" alt="SoloTrip Logo" className="brand-logo-img" />
          <span className="brand-title">SoloTrip</span>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="nav-links-center">
          <Link to="/" className={`nav-link-item ${isActive('/') ? 'active' : ''}`}>
            Home
            {isActive('/') && <span className="nav-indicator-bar" />}
          </Link>
          <Link to="/destinations" className={`nav-link-item ${isActive('/destinations') ? 'active' : ''}`}>
            Explore
            {isActive('/destinations') && <span className="nav-indicator-bar" />}
          </Link>
          <Link to="/trips" className={`nav-link-item ${isActive('/trips') ? 'active' : ''}`}>
            Trips
            {isActive('/trips') && <span className="nav-indicator-bar" />}
          </Link>
          <Link to="/wishlist" className={`nav-link-item ${isActive('/wishlist') ? 'active' : ''}`}>
            Favorites
            {wishlistIds.length > 0 && <span className="nav-fav-dot">{wishlistIds.length}</span>}
            {isActive('/wishlist') && <span className="nav-indicator-bar" />}
          </Link>
          <Link to="/about" className={`nav-link-item ${isActive('/about') ? 'active' : ''}`}>
            About Us
            {isActive('/about') && <span className="nav-indicator-bar" />}
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="nav-actions-right">
          {/* Light / Dark Mode Toggle Pill */}
          <div className="theme-toggle-pill" onClick={toggleTheme} title="Toggle Color Theme">
            <button type="button" className={`theme-toggle-btn ${!isDarkMode ? 'active' : ''}`} aria-label="Light Mode">
              <Sun size={14} />
            </button>
            <button type="button" className={`theme-toggle-btn ${isDarkMode ? 'active' : ''}`} aria-label="Dark Mode">
              <Moon size={14} />
            </button>
          </div>

          {/* Auth State Button */}
          {isAuthenticated && user ? (
            <div className="user-menu-wrapper">
              <button 
                className="user-pill-btn" 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="user-avatar-circle-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} color="#94a3b8" />
              </button>

              {isUserMenuOpen && (
                <div className="user-menu-dropdown animate-scale-up" onClick={() => setIsUserMenuOpen(false)}>
                  <div style={{ padding: '10px 14px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {user.email}
                    </div>
                  </div>
                  <div className="user-menu-divider" />
                  <Link to="/wishlist" className="user-menu-item">
                    <Heart size={15} /> Saved Favorites ({wishlistIds.length})
                  </Link>
                  <Link to="/my-bookings" className="user-menu-item">
                    <CalendarCheck size={15} /> My Booked Trips ({bookings.length})
                  </Link>
                  <Link to="/gallery" className="user-menu-item">
                    <Compass size={15} /> Traveler Gallery
                  </Link>
                  <div className="user-menu-divider" />
                  <button 
                    className="user-menu-item" 
                    style={{ color: '#ef4444' }}
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="login-pill-btn"
              onClick={() => openAuthModal('login')}
            >
              <UserIcon size={16} />
              <span>Login</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button 
            className="mobile-menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-menu animate-fade-in">
          <Link 
            to="/" 
            className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/destinations" 
            className={`mobile-nav-link ${isActive('/destinations') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Explore
          </Link>
          <Link 
            to="/trips" 
            className={`mobile-nav-link ${isActive('/trips') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Trips
          </Link>
          <Link 
            to="/wishlist" 
            className={`mobile-nav-link ${isActive('/wishlist') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Favorites ({wishlistIds.length})
          </Link>
          <Link 
            to="/about" 
            className={`mobile-nav-link ${isActive('/about') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About Us
          </Link>
          
          <div className="mobile-theme-row" onClick={toggleTheme}>
            <span>Appearance ({isDarkMode ? 'Dark Mode' : 'Light Mode'})</span>
            <div className="theme-toggle-pill">
              <button type="button" className={`theme-toggle-btn ${!isDarkMode ? 'active' : ''}`} aria-label="Light Mode">
                <Sun size={14} />
              </button>
              <button type="button" className={`theme-toggle-btn ${isDarkMode ? 'active' : ''}`} aria-label="Dark Mode">
                <Moon size={14} />
              </button>
            </div>
          </div>

          {!isAuthenticated && (
            <div style={{ marginTop: 12 }}>
              <button 
                className="login-pill-btn" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal('login');
                }}
              >
                <UserIcon size={16} />
                <span>Login / Sign Up</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
