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
  ShieldCheck,
  MapPin,
  Navigation,
  ExternalLink,
  Car,
  Train,
  Plane,
  Footprints,
  Crosshair,
  Clock
} from 'lucide-react';
import { BookingModal } from '../components/BookingModal';
import { GoogleMapView } from '../components/GoogleMapView';
import type { Destination } from '../services/api';
import { fetchDestinationById, INITIAL_DESTINATIONS } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { 
  getTravelEstimates, 
  getCurrentUserLocation, 
  POPULAR_ORIGIN_CITIES, 
  getDirectionsUrl,
  type GeoPoint
} from '../utils/geoUtils';

export const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const { isInWishlist, toggleWishlist, showToast } = useWishlist();

  const [destination, setDestination] = useState<Destination>(() => {
    return INITIAL_DESTINATIONS.find((d) => String(d.id) === String(id)) || INITIAL_DESTINATIONS[0];
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'map' | 'inclusions' | 'reviews' | 'gallery'>('overview');
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>(destination.image);

  // User location and duration state
  const [userLocation, setUserLocation] = useState<GeoPoint | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

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

  const handleDetectMyLocation = async () => {
    setIsLocating(true);
    try {
      const loc = await getCurrentUserLocation();
      setUserLocation(loc);
      showToast('📍 Live GPS location detected!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Could not fetch your location.', 'error');
    } finally {
      setIsLocating(false);
    }
  };

  const travelEstimates = (userLocation && destination.latitude != null && destination.longitude != null)
    ? getTravelEstimates(userLocation.latitude, userLocation.longitude, destination.latitude, destination.longitude)
    : null;

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
              className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => setActiveTab('map')}
            >
              <MapPin size={14} style={{ marginRight: 4, display: 'inline' }} />
              Location & Map
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
              {/* Group Tour Departure & Crowd Details Card (If available) */}
              {destination.groupInfo && (
                <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 20, marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Users size={18} color="var(--primary)" />
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Group Tour & Departure Info
                      </h4>
                    </div>
                    <span 
                      style={{ 
                        background: '#0284c7', 
                        color: '#ffffff', 
                        fontSize: '0.76rem', 
                        fontWeight: 700, 
                        padding: '3px 10px', 
                        borderRadius: 'var(--radius-sm)' 
                      }}
                    >
                      📍 Origin: {destination.groupInfo.originCity}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Pickup & Meeting Point</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                        {destination.groupInfo.departurePoint}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Batch Crowd & Age Group</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                        {destination.groupInfo.groupType} ({destination.groupInfo.ageGroup})
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Next Departure Batch</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#059669' }}>
                        📅 {destination.groupInfo.nextBatchDate}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Trip Captain / Guide</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                        🧭 {destination.groupInfo.tripCaptain}
                      </div>
                    </div>
                  </div>

                  {/* Seat Booking Progress */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                      <span style={{ color: '#475569', fontWeight: 600 }}>
                        Seat Availability: {destination.groupInfo.bookedSeats} of {destination.groupInfo.totalSeats} seats filled
                      </span>
                      <span style={{ color: '#ef4444', fontWeight: 700 }}>
                        Only {destination.groupInfo.totalSeats - destination.groupInfo.bookedSeats} seats left!
                      </span>
                    </div>
                    <div style={{ height: 6, background: '#e2e8f0', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${(destination.groupInfo.bookedSeats / destination.groupInfo.totalSeats) * 100}%`,
                          background: '#0284c7' 
                        }} 
                      />
                    </div>
                  </div>
                </div>
              )}

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12 }}>
                Solo & Group Traveler Highlights
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#334155' }}>
                  <ShieldCheck size={20} color="#10b981" /> 
                  <span><strong>Safe Curated Stays:</strong> Verified hostels and boutique homestays with security checks.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#334155' }}>
                  <Users size={20} color="#0284c7" /> 
                  <span><strong>Meet Companions:</strong> Group evening bonfires, cafe crawls, and shared local transit.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#334155' }}>
                  <Compass size={20} color="#f59e0b" /> 
                  <span><strong>Local Guide Support:</strong> 24/7 on-ground assistance and certified trek leaders.</span>
                </li>
              </ul>

              {/* Quick Map Preview Widget */}
              <div style={{ marginTop: 24, marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    Location on Google Map
                  </h3>
                  <button 
                    onClick={() => setActiveTab('map')} 
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.82rem', padding: '4px 12px' }}
                  >
                    Open Full Map View &rarr;
                  </button>
                </div>
                <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                  <GoogleMapView 
                    destination={destination} 
                    initialUserLocation={userLocation || undefined}
                    height="320px" 
                    zoom={13} 
                    showControls={true} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: Location & Map */}
          {activeTab === 'map' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                    Explore {destination.name} on Map
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0' }}>
                    Interactive Google Map with user location, directions route & real-time travel duration
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleDetectMyLocation}
                    disabled={isLocating}
                    className="btn btn-outline btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <Crosshair size={14} className={isLocating ? 'animate-spin-slow' : ''} />
                    <span>{isLocating ? 'Locating...' : userLocation ? '📍 GPS Updated' : 'Detect My Location'}</span>
                  </button>

                  {destination.latitude != null && (
                    <a
                      href={getDirectionsUrl(
                        userLocation?.latitude || 28.6139,
                        userLocation?.longitude || 77.2090,
                        destination.latitude,
                        destination.longitude ?? 77.1887,
                        destination.name
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                      <Navigation size={14} /> Open Live GPS Navigation <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              {/* Main Interactive Google Map Component */}
              <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <GoogleMapView 
                  destination={destination} 
                  initialUserLocation={userLocation || undefined}
                  height="480px" 
                  zoom={13} 
                  showControls={true} 
                />
              </div>

              {/* Live Travel Duration Calculator Card */}
              <div className="travel-duration-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Clock size={18} color="#0284c7" />
                      <span>Travel Duration & Distance Calculator</span>
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '4px 0 0' }}>
                      {userLocation ? (
                        <span>Calculated from: <strong>{userLocation.name}</strong> to <strong>{destination.name}</strong></span>
                      ) : (
                        <span>Choose your starting city or click "Detect My Location" to see exact travel times</span>
                      )}
                    </p>
                  </div>

                  {/* Origin City Pills */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {POPULAR_ORIGIN_CITIES.slice(0, 5).map((city) => (
                      <button
                        key={city.name}
                        type="button"
                        onClick={() => {
                          setUserLocation(city);
                          showToast(`📍 Set origin to ${city.name}`, 'info');
                        }}
                        className={`btn btn-sm ${userLocation?.name === city.name ? 'btn-primary' : 'btn-outline'}`}
                        style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration Mode Cards Grid */}
                {travelEstimates && (
                  <div className="duration-estimates-grid">
                    {/* Driving / Car Card */}
                    <div className="duration-mode-card">
                      <div className="duration-mode-header">
                        <div className="duration-icon-box blue">
                          <Car size={20} />
                        </div>
                        <div>
                          <div className="duration-mode-title">By Road / Car / Cab</div>
                          <div className="duration-mode-subtitle">{travelEstimates.DRIVING.distanceText}</div>
                        </div>
                      </div>
                      <div className="duration-val-big">{travelEstimates.DRIVING.durationText}</div>
                      <p className="duration-mode-hint">Direct highway route with scenic mountain roads & pitstops</p>
                    </div>

                    {/* Train / Transit Card */}
                    <div className="duration-mode-card">
                      <div className="duration-mode-header">
                        <div className="duration-icon-box emerald">
                          <Train size={20} />
                        </div>
                        <div>
                          <div className="duration-mode-title">By Train / Transit</div>
                          <div className="duration-mode-subtitle">{travelEstimates.TRANSIT.distanceText}</div>
                        </div>
                      </div>
                      <div className="duration-val-big">{travelEstimates.TRANSIT.durationText}</div>
                      <p className="duration-mode-hint">Budget-friendly sleeper & express train connections</p>
                    </div>

                    {/* Flight Card */}
                    <div className="duration-mode-card">
                      <div className="duration-mode-header">
                        <div className="duration-icon-box purple">
                          <Plane size={20} />
                        </div>
                        <div>
                          <div className="duration-mode-title">By Flight + Cab</div>
                          <div className="duration-mode-subtitle">{travelEstimates.FLYING.distanceText} (Air)</div>
                        </div>
                      </div>
                      <div className="duration-val-big">{travelEstimates.FLYING.durationText}</div>
                      <p className="duration-mode-hint">Fastest travel via nearest domestic airport</p>
                    </div>

                    {/* Walking / Trek Card */}
                    <div className="duration-mode-card">
                      <div className="duration-mode-header">
                        <div className="duration-icon-box orange">
                          <Footprints size={20} />
                        </div>
                        <div>
                          <div className="duration-mode-title">Trek / Local Walk</div>
                          <div className="duration-mode-subtitle">{travelEstimates.WALKING.distanceText}</div>
                        </div>
                      </div>
                      <div className="duration-val-big">{travelEstimates.WALKING.durationText}</div>
                      <p className="duration-mode-hint">Local trails and exploration around the area</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Surrounding & Transit Info */}
              <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                <div style={{ background: 'var(--bg-subtle)', padding: 18, borderRadius: 14, border: '1px solid var(--border-light)' }}>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={16} color="var(--primary)" /> Exact Address
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                    {destination.address || destination.location}
                  </p>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: 18, borderRadius: 14, border: '1px solid var(--border-light)' }}>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Compass size={16} color="#10b981" /> Coordinates & Region
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                    {destination.latitude?.toFixed(4)}° N, {destination.longitude?.toFixed(4)}° E • {destination.city || destination.state || destination.country}
                  </p>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: 18, borderRadius: 14, border: '1px solid var(--border-light)' }}>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={16} color="#f59e0b" /> Solo Transit Safety
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                    Verified taxi pickups, bus terminals, and solo-friendly hostel clusters nearby.
                  </p>
                </div>
              </div>
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
              <div style={{ background: 'var(--bg-subtle)', borderRadius: 16, padding: 20, border: '1px solid var(--border-light)' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>
                  Write a Review
                </h4>
                <form onSubmit={handleAddReview}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Rating:</span>
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
