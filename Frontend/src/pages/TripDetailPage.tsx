import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  Calendar, 
  Compass, 
  Mountain, 
  Users, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck 
} from 'lucide-react';
import { BookingModal } from '../components/BookingModal';
import type { Destination } from '../services/api';
import { fetchDestinationById, INITIAL_DESTINATIONS } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const { isInWishlist, toggleWishlist, showToast } = useWishlist();

  const [destination, setDestination] = useState<Destination>(() => {
    return INITIAL_DESTINATIONS.find((d) => String(d.id) === String(id)) || INITIAL_DESTINATIONS[0];
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'inclusions' | 'reviews' | 'gallery'>('overview');
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>(destination.image);

  // Reviews form state
  const [reviewsList, setReviewsList] = useState(destination.reviews || []);
  const [newRating, setNewRating] = useState<number>(5);
  const [newReviewText, setNewReviewText] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchDestinationById(id).then((data) => {
        if (data) {
          setDestination(data);
          setSelectedPhoto(data.image);
          setReviewsList(data.reviews || []);
        }
      });
    }
  }, [id]);

  const isFavorited = isInWishlist(destination.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Trip link copied to clipboard! 📋', 'info');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!newReviewText.trim()) return;

    const newRev = {
      id: Date.now(),
      userName: user.name,
      rating: newRating,
      date: 'Just now',
      comment: newReviewText
    };

    setReviewsList((prev) => [newRev, ...prev]);
    setNewReviewText('');
    showToast('Thank you for submitting your verified review!', 'success');
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
      {/* Top Bar Navigation */}
      <div className="detail-header-nav">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>

        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            className={`nav-icon-btn ${isFavorited ? 'active' : ''}`}
            onClick={() => toggleWishlist(destination)}
            title="Wishlist"
          >
            <Heart size={18} fill={isFavorited ? '#f43f5e' : 'none'} stroke={isFavorited ? '#f43f5e' : 'currentColor'} />
          </button>
          <button className="nav-icon-btn" onClick={handleShare} title="Share Trip">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Hero Image & Thumbnail Gallery */}
      <div className="detail-gallery-grid">
        <img 
          src={selectedPhoto} 
          alt={destination.name} 
          className="gallery-main-img" 
        />
        {destination.gallery.slice(0, 4).map((img, idx) => (
          <img 
            key={idx} 
            src={img} 
            alt={`${destination.name} ${idx + 1}`} 
            className="gallery-sub-img"
            onClick={() => setSelectedPhoto(img)}
          />
        ))}
      </div>

      {/* Main Details Layout (Content Left, Sticky Booking Right) */}
      <div className="detail-layout">
        <div className="detail-main-info">
          {/* Title & Rating */}
          <h1 className="detail-title">{destination.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#d97706', fontWeight: 700 }}>
              <Star size={16} fill="#d97706" />
              <span>{destination.rating.toFixed(1)}</span>
            </div>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
              ({destination.reviewsCount} reviews)
            </span>
          </div>

          {/* Tags */}
          <div className="detail-tags-row">
            {destination.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>

          {/* About Text */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>About Destination</h3>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6 }}>
              {destination.about}
            </p>
          </div>

          {/* Quick Info Grid (Best Time, Trip Type, Difficulty, Group Size) */}
          <div className="quick-info-grid">
            <div className="quick-info-item">
              <div className="quick-info-icon-title">
                <Calendar size={16} color="#0284c7" /> Best Time
              </div>
              <div className="quick-info-val">{destination.bestTime}</div>
            </div>

            <div className="quick-info-item">
              <div className="quick-info-icon-title">
                <Compass size={16} color="#0284c7" /> Trip Type
              </div>
              <div className="quick-info-val">{destination.tripType}</div>
            </div>

            <div className="quick-info-item">
              <div className="quick-info-icon-title">
                <Mountain size={16} color="#0284c7" /> Difficulty
              </div>
              <div className="quick-info-val">{destination.difficulty}</div>
            </div>

            <div className="quick-info-item">
              <div className="quick-info-icon-title">
                <Users size={16} color="#0284c7" /> Group Size
              </div>
              <div className="quick-info-val">{destination.groupSize}</div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="tabs-nav">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
              onClick={() => setActiveTab('itinerary')}
            >
              Itinerary
            </button>
            <button
              className={`tab-btn ${activeTab === 'inclusions' ? 'active' : ''}`}
              onClick={() => setActiveTab('inclusions')}
            >
              Inclusions
            </button>
            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({reviewsList.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => setActiveTab('gallery')}
            >
              Gallery
            </button>
          </div>

          {/* Tab Content 1: Overview */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12 }}>
                Solo Traveler Highlights
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#334155' }}>
                  <ShieldCheck size={20} color="#10b981" /> 
                  <span><strong>Solo Friendly Vibe:</strong> Safe curated hostels and homestays with verified security.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#334155' }}>
                  <Users size={20} color="#0284c7" /> 
                  <span><strong>Meet Companions:</strong> Group evening bonfires, cafe crawls, and shared local transit.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#334155' }}>
                  <Compass size={20} color="#f59e0b" /> 
                  <span><strong>Local Guide Support:</strong> 24/7 on-ground assistance and safety leader.</span>
                </li>
              </ul>
            </div>
          )}

          {/* Tab Content 2: Itinerary */}
          {activeTab === 'itinerary' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16 }}>
                Day-by-Day Itinerary
              </h3>
              <div className="itinerary-timeline">
                {destination.itinerary.map((item) => (
                  <div key={item.day} className="itinerary-item">
                    <div className="itinerary-day-badge">
                      D{item.day}
                    </div>
                    <div className="itinerary-item-content">
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>
                        {item.title}
                      </h4>
                      <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5 }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content 3: Inclusions */}
          {activeTab === 'inclusions' && (
            <div className="animate-fade-in">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <CheckCircle2 size={18} /> What's Included
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {destination.inclusions.map((inc, i) => (
                      <li key={i} style={{ fontSize: '0.9rem', color: '#334155', display: 'flex', gap: 8 }}>
                        • <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <XCircle size={18} /> Excluded
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {destination.exclusions.map((exc, i) => (
                      <li key={i} style={{ fontSize: '0.9rem', color: '#64748b', display: 'flex', gap: 8 }}>
                        • <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Traveler Reviews
                </h3>
              </div>

              {/* Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                {reviewsList.map((rev) => (
                  <div 
                    key={rev.id} 
                    style={{ 
                      background: '#ffffff', 
                      borderRadius: 14, 
                      padding: 18, 
                      border: '1px solid #e2e8f0' 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{rev.userName}</div>
                      <div style={{ display: 'flex', color: '#d97706' }}>
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} size={14} fill="#d97706" />
                        ))}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 8 }}>{rev.date}</div>
                    <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: 1.5 }}>
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>

              {/* Write Review Form */}
              <div style={{ background: '#f8fafc', borderRadius: 16, padding: 20, border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 12 }}>
                  Write a Review
                </h4>
                <form onSubmit={handleAddReview}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748b' }}>Rating:</span>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="sort-select"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5/5 Excellent)</option>
                      <option value={4}>⭐⭐⭐⭐ (4/5 Very Good)</option>
                      <option value={3}>⭐⭐⭐ (3/5 Average)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <textarea
                      rows={3}
                      placeholder={user ? "Share your experience about the stays, guide, safety..." : "Please log in to write a review"}
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      className="form-input form-textarea"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-sm">
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Tab Content 5: Gallery */}
          {activeTab === 'gallery' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16 }}>Photo Gallery</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                {destination.gallery.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt={`${destination.name} ${i}`}
                    style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12, cursor: 'pointer' }}
                    onClick={() => setSelectedPhoto(photo)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Booking Card (Matching Mockup) */}
        <div>
          <div className="booking-card">
            <div className="booking-price-header">
              <span className="booking-price-amount">₹{destination.price.toLocaleString('en-IN')}</span>
              <span className="booking-price-unit">/ person</span>
            </div>
            <div className="booking-duration-badge">
              {destination.duration}
            </div>

            <button 
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', marginBottom: 12, fontSize: '1.05rem' }}
              onClick={() => setIsBookingOpen(true)}
            >
              Book Trip
            </button>

            <button 
              className="btn btn-outline"
              style={{ width: '100%', padding: '12px' }}
              onClick={() => toggleWishlist(destination)}
            >
              <Heart size={16} fill={isFavorited ? '#f43f5e' : 'none'} stroke={isFavorited ? '#f43f5e' : 'currentColor'} />
              <span>{isFavorited ? 'In Wishlist' : 'Add to Wishlist'}</span>
            </button>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={16} color="#10b981" /> Instant Confirmation
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Users size={16} color="#0284c7" /> Dedicated Solo Room or Shared Option
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        destination={destination}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};
