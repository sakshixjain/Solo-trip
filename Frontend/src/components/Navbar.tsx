import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Compass,
  Search, 
  Heart, 
  LogOut, 
  Menu, 
  X, 
  CalendarCheck, 
  Plane,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { wishlistIds, bookings } = useWishlist();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="navbar-wrapper">
      <div className="container navbar">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand">
          <span className="brand-icon">
            <Plane size={18} />
          </span>
          <span>SoloTrip</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/trips" className={`nav-link ${isActive('/trips') ? 'active' : ''}`}>
            Trips
          </Link>
          <Link to="/destinations" className={`nav-link ${isActive('/destinations') ? 'active' : ''}`}>
            Destinations
          </Link>
          <Link to="/stories" className={`nav-link ${isActive('/stories') ? 'active' : ''}`}>
            Stories
          </Link>
          <Link to="/community" className={`nav-link ${isActive('/community') ? 'active' : ''}`}>
            Community
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
            About Us
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Quick Search Button */}
          <button 
            className="nav-icon-btn" 
            title="Search destinations"
            onClick={() => onOpenSearch ? onOpenSearch() : navigate('/trips')}
          >
            <Search size={18} />
          </button>

          {/* Wishlist Button */}
          <Link to="/wishlist" className="nav-icon-btn" title="Saved Trips & Wishlist">
            <Heart size={18} />
            {wishlistIds.length > 0 && (
              <span className="nav-badge">{wishlistIds.length}</span>
            )}
          </Link>

          {/* Bookings shortcut if authenticated */}
          {isAuthenticated && (
            <Link to="/my-bookings" className="nav-icon-btn" title="My Bookings">
              <CalendarCheck size={18} />
              {bookings.length > 0 && (
                <span className="nav-badge" style={{ background: '#0284c7' }}>
                  {bookings.length}
                </span>
              )}
            </Link>
          )}

          {/* Auth State */}
          {isAuthenticated && user ? (
            <div className="user-menu-wrapper">
              <button 
                className="user-avatar-btn" 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="user-avatar-circle">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} color="#64748b" />
              </button>

              {isUserMenuOpen && (
                <div className="user-menu-dropdown animate-scale-up" onClick={() => setIsUserMenuOpen(false)}>
                  <div style={{ padding: '8px 12px 12px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {user.email}
                    </div>
                  </div>
                  <div className="user-menu-divider" />
                  <Link to="/wishlist" className="user-menu-item">
                    <Heart size={16} /> My Wishlist ({wishlistIds.length})
                  </Link>
                  <Link to="/my-bookings" className="user-menu-item">
                    <CalendarCheck size={16} /> My Booked Trips ({bookings.length})
                  </Link>
                  <Link to="/stories" className="user-menu-item">
                    <Compass size={16} /> My Stories
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
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => openAuthModal('login')}
              >
                Login
              </button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => openAuthModal('register')}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="nav-icon-btn mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div 
          style={{ 
            background: '#ffffff', 
            borderTop: '1px solid #e2e8f0', 
            padding: '20px 24px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 14 
          }}
          className="animate-fade-in"
        >
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/trips" 
            className={`nav-link ${isActive('/trips') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Trips
          </Link>
          <Link 
            to="/destinations" 
            className={`nav-link ${isActive('/destinations') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Destinations
          </Link>
          <Link 
            to="/stories" 
            className={`nav-link ${isActive('/stories') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Stories
          </Link>
          <Link 
            to="/community" 
            className={`nav-link ${isActive('/community') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Community
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About Us
          </Link>
          {!isAuthenticated && (
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button 
                className="btn btn-outline" 
                style={{ flex: 1 }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal('login');
                }}
              >
                Login
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal('register');
                }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
