import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Star, 
  Map as MapIcon, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  Mountain, 
  Palmtree, 
  Landmark, 
  Trees, 
  Flower2, 
  Navigation, 
  Home as HomeIcon, 
  Edit3, 
  ShieldCheck, 
  Plane,
  Users,
  Camera,
  MapPin,
  Sparkles,
  BookOpen,
  ChevronDown,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { SearchWidget } from '../components/SearchWidget';
import { TripCard } from '../components/TripCard';
import { StoryModal } from '../components/StoryModal';
import { DiscussionModal } from '../components/DiscussionModal';
import { InteractiveRouteMap, type RouteCircuit } from '../components/InteractiveRouteMap';
import { useWishlist } from '../context/WishlistContext';
import { 
  fetchDestinations, 
  fetchGalleryPhotos, 
  likeGalleryPhoto,
  type Destination, 
  type Story, 
  type Discussion, 
  type GalleryPhoto,
  INITIAL_DESTINATIONS,
  INITIAL_STORIES,
  INITIAL_DISCUSSIONS,
  INITIAL_GALLERY_PHOTOS
} from '../services/api';

// Circuits for the Interactive Map Planner with real GPS coordinates & highway route waypoints
const ROUTE_CIRCUITS: RouteCircuit[] = [
  {
    id: 'rajasthan',
    title: 'Rajasthan Royal Route',
    totalKm: '940 km',
    totalDuration: '15.5 hrs',
    googleMapsUrl: 'https://www.google.com/maps/dir/Delhi/Jaipur/Jodhpur/Udaipur',
    waypoints: [
      { name: 'Delhi', note: 'Start Point (Origin Hub)', type: 'start', lat: 28.6139, lng: 77.2090 },
      { name: 'Jaipur', note: '~ 280 km • 5 hrs', type: 'stop', lat: 26.9124, lng: 75.7873 },
      { name: 'Jodhpur', note: '~ 260 km • 4.5 hrs', type: 'stop', lat: 26.2389, lng: 73.0243 },
      { name: 'Udaipur', note: '~ 400 km • 6 hrs', type: 'stop', lat: 24.5854, lng: 73.7125 }
    ],
    routeCoords: [
      [28.6139, 77.2090],
      [28.4595, 77.0266],
      [27.9942, 76.3813],
      [27.7088, 76.2023],
      [27.1752, 75.9525],
      [26.9124, 75.7873],
      [26.7580, 75.4020],
      [26.4499, 74.6399],
      [26.0743, 73.8820],
      [26.2389, 73.0243],
      [25.7711, 73.3234],
      [25.1166, 73.5350],
      [24.5854, 73.7125]
    ]
  },
  {
    id: 'himachal',
    title: 'Himachal Mountain Circuit',
    totalKm: '545 km',
    totalDuration: '13 hrs',
    googleMapsUrl: 'https://www.google.com/maps/dir/Delhi/Chandigarh/Kasol/Manali',
    waypoints: [
      { name: 'Delhi', note: 'Start Point (Origin Hub)', type: 'start', lat: 28.6139, lng: 77.2090 },
      { name: 'Chandigarh', note: '~ 240 km • 4 hrs', type: 'stop', lat: 30.7333, lng: 76.7794 },
      { name: 'Kasol', note: '~ 230 km • 6.5 hrs', type: 'stop', lat: 32.0100, lng: 77.3150 },
      { name: 'Manali', note: '~ 75 km • 2.5 hrs', type: 'stop', lat: 32.2432, lng: 77.1892 }
    ],
    routeCoords: [
      [28.6139, 77.2090],
      [29.3909, 76.9635],
      [29.9695, 76.8783],
      [30.3782, 76.7767],
      [30.7333, 76.7794],
      [31.1048, 77.1734],
      [31.3260, 76.7640],
      [31.5892, 76.9182],
      [31.7084, 76.9320],
      [31.9579, 77.1095],
      [32.0100, 77.3150],
      [32.2432, 77.1892]
    ]
  },
  {
    id: 'goa',
    title: 'Goa & Coastal Karnataka',
    totalKm: '745 km',
    totalDuration: '15.5 hrs',
    googleMapsUrl: 'https://www.google.com/maps/dir/Mumbai/North+Goa/South+Goa/Gokarna',
    waypoints: [
      { name: 'Mumbai', note: 'Start Point (Origin Hub)', type: 'start', lat: 19.0760, lng: 72.8777 },
      { name: 'North Goa', note: '~ 580 km • 11 hrs', type: 'stop', lat: 15.5439, lng: 73.7553 },
      { name: 'South Goa', note: '~ 45 km • 1.5 hrs', type: 'stop', lat: 15.0100, lng: 74.0232 },
      { name: 'Gokarna', note: '~ 120 km • 3 hrs', type: 'stop', lat: 14.5479, lng: 74.3188 }
    ],
    routeCoords: [
      [19.0760, 72.8777],
      [18.5204, 73.8567],
      [17.6805, 74.0183],
      [16.7050, 74.2433],
      [15.8647, 74.5089],
      [15.5439, 73.7553],
      [15.2736, 73.9580],
      [15.0100, 74.0232],
      [14.8150, 74.1300],
      [14.5479, 74.3188]
    ]
  }
];

// 6 Categories matching the reference screenshot
const CATEGORIES = [
  { id: 'adventure', title: 'Adventure', icon: Mountain, color: '#059669', bgColor: '#ecfdf5', darkBg: 'rgba(16, 185, 129, 0.12)', darkColor: '#34d399', darkBorder: 'rgba(16, 185, 129, 0.25)' },
  { id: 'beach', title: 'Beach', icon: Palmtree, color: '#d97706', bgColor: '#fffbeb', darkBg: 'rgba(245, 158, 11, 0.12)', darkColor: '#fbbf24', darkBorder: 'rgba(245, 158, 11, 0.25)' },
  { id: 'heritage', title: 'Heritage', icon: Landmark, color: '#7c3aed', bgColor: '#f5f3ff', darkBg: 'rgba(139, 92, 246, 0.12)', darkColor: '#a78bfa', darkBorder: 'rgba(139, 92, 246, 0.25)' },
  { id: 'nature', title: 'Nature', icon: Trees, color: '#16a34a', bgColor: '#f0fdf4', darkBg: 'rgba(34, 197, 94, 0.12)', darkColor: '#4ade80', darkBorder: 'rgba(34, 197, 94, 0.25)' },
  { id: 'spiritual', title: 'Spiritual', icon: Flower2, color: '#e11d48', bgColor: '#fff1f2', darkBg: 'rgba(244, 63, 94, 0.12)', darkColor: '#fb7185', darkBorder: 'rgba(244, 63, 94, 0.25)' },
  { id: 'offbeat', title: 'Offbeat', icon: Navigation, color: '#0284c7', bgColor: '#f0f9ff', darkBg: 'rgba(14, 165, 233, 0.12)', darkColor: '#38bdf8', darkBorder: 'rgba(14, 165, 233, 0.25)' }
];

// Why SoloTrip 4 Features
const WHY_SOLOTRIP_FEATURES = [
  { id: 1, title: 'Discover', desc: 'Find amazing places curated for solo travelers.', icon: HomeIcon, iconColor: '#059669', bgColor: '#ecfdf5', darkBg: 'rgba(16, 185, 129, 0.15)', darkColor: '#34d399' },
  { id: 2, title: 'Plan', desc: 'Plan your trip, the way you want.', icon: Edit3, iconColor: '#d97706', bgColor: '#fffbeb', darkBg: 'rgba(245, 158, 11, 0.15)', darkColor: '#fbbf24' },
  { id: 3, title: 'Save', desc: 'Save your favorite places and trips.', icon: Heart, iconColor: '#e11d48', bgColor: '#fff1f2', darkBg: 'rgba(244, 63, 94, 0.15)', darkColor: '#fb7185' },
  { id: 4, title: 'Review', desc: 'Share your experience and help others.', icon: Star, iconColor: '#0284c7', bgColor: '#f0f9ff', darkBg: 'rgba(14, 165, 233, 0.15)', darkColor: '#38bdf8' }
];

// Testimonials
const TESTIMONIALS = [
  {
    id: 1,
    name: 'Ananya Sharma',
    city: 'From Delhi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    quote: '"SoloTrip helped me plan my first solo trip to Manali. Everything was so easy!"',
    rating: 5
  },
  {
    id: 2,
    name: 'Rohan Verma',
    city: 'From Mumbai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    quote: '"The routes and place suggestions are perfect. Highly recommended!"',
    rating: 5
  },
  {
    id: 3,
    name: 'Megha Iyer',
    city: 'From Bangalore',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
    quote: '"I found so many offbeat places that are not crowded. Loved it!"',
    rating: 5
  }
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist, showToast } = useWishlist();

  // Dynamic Data States
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(INITIAL_GALLERY_PHOTOS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [discussions, setDiscussions] = useState<Discussion[]>(INITIAL_DISCUSSIONS);

  // Modals
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isWriteStoryOpen, setIsWriteStoryOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [isCreateDiscussionOpen, setIsCreateDiscussionOpen] = useState(false);

  // Map & Route Planner States
  const [activeCircuitIdx, setActiveCircuitIdx] = useState(0);
  const [mapType, setMapType] = useState<'map' | 'satellite'>('map');
  const [hoveredWaypoint, setHoveredWaypoint] = useState<string | null>(null);

  // Carousel & FAQ
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    fetchDestinations().then((data) => {
      if (data && data.length > 0) setDestinations(data);
    });
    fetchGalleryPhotos().then((photos) => {
      if (photos && photos.length > 0) setGalleryPhotos(photos);
    });
  }, []);

  const activeCircuit = ROUTE_CIRCUITS[activeCircuitIdx];

  const handlePrevTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev > 0 ? prev - 1 : TESTIMONIALS.length - 1));
  };

  const handleNextTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev < TESTIMONIALS.length - 1 ? prev + 1 : 0));
  };

  const toggleFaq = (index: number) => {
    setActiveFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleLikePhoto = async (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    const updated = await likeGalleryPhoto(id);
    setGalleryPhotos(updated);
  };

  const handleSaveRouteTrip = () => {
    showToast(`✨ ${activeCircuit.title} saved to your Saved Wishlist!`, 'success');
  };

  const faqs = [
    {
      q: 'What makes SoloTrip different from standard travel booking websites?',
      a: 'SoloTrip is purpose-built exclusively for solo travelers. Unlike traditional tour platforms that impose heavy single-supplement penalties or rigid group schedules, we offer verified safe solo stays, transparent itemized travel costs, live route estimates from your location, and an active community where you can meet fellow wanderers or get real-time advice before departing.'
    },
    {
      q: 'How do you ensure the safety of first-time and solo female travelers?',
      a: 'Every accommodation on SoloTrip undergoes a rigorous 25-point safety and cleanliness audit. We prioritize stays with 24/7 reception desk presence, secure lockers, female-only dorm options, central well-lit locations, and reviews from verified solo travelers. Our community and safety checklist give you on-ground guidance for any region.'
    },
    {
      q: 'How are travel times and charges calculated on SoloTrip?',
      a: 'SoloTrip uses real-time geolocation to compute driving and transit duration directly from your current GPS coordinates. For charges, we show transparent breakdowns for accommodation, food, local transport, and activities so you can budget accurately with zero surprise fees.'
    },
    {
      q: 'Can I connect with other solo travelers without losing my privacy and independence?',
      a: 'Absolutely! Solo travel gives you complete autonomy over your journey. Through our Community Discussions and Story threads, you can connect with solo explorers taking similar routes, team up for day treks or shared cabs, while keeping full freedom over your personal stay and daily schedule.'
    },
    {
      q: 'What if I need to modify or review my trip booking?',
      a: 'All bookings made on SoloTrip include transparent confirmation and cancellation terms. You can manage, review, and track all your reservations in real-time directly from your My Bookings dashboard.'
    }
  ];

  return (
    <div className="solotrip-home-root">
      {/* =========================================================================
          1. HERO SECTION (IMMERSIVE, BALANCED SCREEN VIEW WITH RICH ANIMATIONS)
          ========================================================================= */}
      <section className="solotrip-hero">
        <div className="solotrip-hero-image-backdrop" />
        <div className="solotrip-hero-gradient-overlay" />
        <div className="solotrip-hero-glow-orb solotrip-hero-glow-1" />
        <div className="solotrip-hero-glow-orb solotrip-hero-glow-2" />

        <div className="container solotrip-hero-content-wrapper">
          <div className="solotrip-hero-text-block">
            {/* Top Pill Badge */}
            <div className="solotrip-hero-badge">
              <Plane size={14} className="solotrip-badge-plane" />
              <span>SOLO TRAVEL, ENDLESS POSSIBILITIES</span>
              <span className="solotrip-badge-arrow">➔</span>
            </div>

            {/* Main Headline */}
            <h1 className="solotrip-hero-title">
              YOUR JOURNEY.<br />
              <span className="solotrip-highlight-text">YOUR RULES.</span>
            </h1>

            {/* Subtitle */}
            <p className="solotrip-hero-subtitle">
              Discover places, plan your trips, and create unforgettable memories on your own terms.
            </p>

            {/* Hero Search Box */}
            <div className="solotrip-hero-search-box">
              <SearchWidget />
            </div>

            {/* 3 Sub-Features Below Search */}
            <div className="solotrip-hero-features-strip">
              <div className="solotrip-hero-feat-item">
                <div className="solotrip-hero-feat-icon">
                  <HomeIcon size={16} />
                </div>
                <div className="solotrip-hero-feat-text">
                  <strong>Handpicked</strong>
                  <span>Best Places</span>
                </div>
              </div>

              <div className="solotrip-hero-feat-item">
                <div className="solotrip-hero-feat-icon">
                  <ShieldCheck size={16} />
                </div>
                <div className="solotrip-hero-feat-text">
                  <strong>Solo Friendly</strong>
                  <span>Travel Safe</span>
                </div>
              </div>

              <div className="solotrip-hero-feat-item">
                <div className="solotrip-hero-feat-icon">
                  <CheckCircle2 size={16} />
                </div>
                <div className="solotrip-hero-feat-text">
                  <strong>Save & Plan</strong>
                  <span>Your Trips</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Scroll Down Indicator */}
        <a 
          href="#popular-destinations" 
          className="solotrip-hero-scroll-hint"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('popular-destinations')?.scrollIntoView({ behavior: 'smooth' });
          }}
          aria-label="Scroll to destinations"
        >
          <span className="solotrip-scroll-text">Explore Destinations</span>
          <ChevronDown size={18} className="solotrip-scroll-chevron" />
        </a>
      </section>

      {/* =========================================================================
          2. EXPLORE POPULAR DESTINATIONS SECTION (5 FEATURED CARDS)
          ========================================================================= */}
      <section className="solotrip-section" id="popular-destinations">
        <div className="container">
          <div className="solotrip-section-header">
            <div className="solotrip-section-title-wrap">
              <span className="solotrip-section-icon green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
                </svg>
              </span>
              <h2 className="solotrip-section-heading">Explore Popular Destinations</h2>
            </div>
            <Link to="/destinations" className="solotrip-view-all-link">
              <span>View all destinations</span>
              <span className="solotrip-arrow">➔</span>
            </Link>
          </div>

          {/* 5 Destination Cards Row */}
          <div className="solotrip-destinations-grid">
            {destinations.slice(0, 5).map((dest) => {
              const liked = isInWishlist(dest.id);
              return (
                <div 
                  key={dest.id} 
                  className="solotrip-dest-card"
                  onClick={() => navigate(`/destinations/${dest.id}`)}
                >
                  <img src={dest.image} alt={dest.name} className="solotrip-dest-img" loading="lazy" />
                  <div className="solotrip-dest-gradient" />

                  {/* Wishlist Heart Button */}
                  <button 
                    type="button"
                    className={`solotrip-dest-heart-btn ${liked ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(dest);
                    }}
                    aria-label="Save to Wishlist"
                  >
                    <Heart size={15} fill={liked ? '#ef4444' : 'none'} color={liked ? '#ef4444' : '#ffffff'} />
                  </button>

                  {/* Card Bottom Meta */}
                  <div className="solotrip-dest-meta">
                    <div className="solotrip-dest-rating-badge">
                      <Star size={11} fill="#eab308" color="#eab308" />
                      <span>{dest.rating}</span>
                    </div>
                    <div className="solotrip-dest-title-group">
                      <h3 className="solotrip-dest-name">{dest.name}</h3>
                      <span className="solotrip-dest-state">{dest.state || dest.location}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. EXPLORE BY CATEGORY SECTION (6 PASTEL CATEGORY CARDS)
          ========================================================================= */}
      <section className="solotrip-section" style={{ paddingTop: 10 }}>
        <div className="container">
          <div className="solotrip-section-header">
            <div className="solotrip-section-title-wrap">
              <span className="solotrip-section-icon green">
                <Compass size={22} />
              </span>
              <h2 className="solotrip-section-heading">Explore by Category</h2>
            </div>
          </div>

          {/* 6 Category Cards Grid */}
          <div className="solotrip-categories-grid">
            {CATEGORIES.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <div 
                  key={cat.id} 
                  className={`solotrip-category-card cat-${cat.id}`}
                  style={{
                    '--cat-color': cat.color,
                    '--cat-bg': cat.bgColor,
                    '--cat-dark-bg': cat.darkBg,
                    '--cat-dark-color': cat.darkColor,
                    '--cat-dark-border': cat.darkBorder
                  } as React.CSSProperties}
                  onClick={() => navigate(`/destinations?category=${cat.title}`)}
                >
                  <div className="solotrip-cat-icon-wrap">
                    <IconComponent size={22} />
                  </div>
                  <span className="solotrip-cat-label">
                    {cat.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PLAN YOUR TRIP SECTION (HIGH QUALITY INTERACTIVE ROUTE MAP)
          ========================================================================= */}
      <section className="solotrip-section" style={{ paddingTop: 20 }}>
        <div className="container">
          {/* Circuit Switcher Tabs */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              📍 Popular Circuits:
            </span>
            {ROUTE_CIRCUITS.map((circ, idx) => (
              <button
                key={circ.id}
                type="button"
                className={`solotrip-circuit-pill ${activeCircuitIdx === idx ? 'active' : ''}`}
                onClick={() => {
                  setActiveCircuitIdx(idx);
                  setHoveredWaypoint(null);
                }}
              >
                {circ.title}
              </button>
            ))}
          </div>

          <div className="solotrip-route-planner-card">
            {/* Left Column: Itinerary Details & Waypoints */}
            <div className="solotrip-route-left-col">
              <div>
                <div className="solotrip-route-header">
                  <div className="solotrip-route-icon-box">
                    <MapIcon size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 className="solotrip-route-title">Plan Your Trip</h3>
                    <p className="solotrip-route-subtitle">
                      Map your journey, add places, and see the best route for your solo adventure.
                    </p>
                  </div>
                </div>

                {/* Circuit Info Strip */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-subtle)', padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-light)', marginBottom: 16 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    🛣️ {activeCircuit.totalKm} Total
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>
                    ⏱️ {activeCircuit.totalDuration} Drive
                  </span>
                </div>

                {/* Vertical Waypoint Timeline */}
                <div className="solotrip-timeline">
                  {activeCircuit.waypoints.map((wp, wIdx) => (
                    <div 
                      key={wIdx} 
                      className={`solotrip-timeline-item ${hoveredWaypoint === wp.name ? 'highlight' : ''}`}
                      onMouseEnter={() => setHoveredWaypoint(wp.name)}
                      onMouseLeave={() => setHoveredWaypoint(null)}
                    >
                      <div className={`solotrip-timeline-dot ${wp.type === 'start' ? 'green' : 'red'}`} />
                      {wIdx < activeCircuit.waypoints.length - 1 && (
                        <div className="solotrip-timeline-line" />
                      )}
                      <div className="solotrip-timeline-content">
                        <strong className="solotrip-timeline-city">{wp.name}</strong>
                        <span className="solotrip-timeline-note">{wp.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="solotrip-route-actions">
                <a 
                  href={activeCircuit.googleMapsUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="solotrip-btn-dark"
                  style={{ textDecoration: 'none' }}
                >
                  <Navigation size={15} />
                  <span>View on Google Maps</span>
                  <ExternalLink size={12} />
                </a>
                
                <button 
                  type="button" 
                  className="solotrip-btn-outline"
                  onClick={handleSaveRouteTrip}
                >
                  <Heart size={15} />
                  <span>Save Trip</span>
                </button>
              </div>
            </div>

            {/* Right Column: Realistic Interactive Leaflet Route Map */}
            <div className="solotrip-route-map-col">
              {/* Map Type Switch Top Left */}
              <div className="solotrip-map-type-switch">
                <button 
                  type="button" 
                  className={`solotrip-map-tab ${mapType === 'map' ? 'active' : ''}`}
                  onClick={() => setMapType('map')}
                >
                  Map View
                </button>
                <button 
                  type="button" 
                  className={`solotrip-map-tab ${mapType === 'satellite' ? 'active' : ''}`}
                  onClick={() => setMapType('satellite')}
                >
                  Satellite Terrain
                </button>
              </div>

              {/* Real Leaflet Map Component with Live Tiles, Polyline, and Pins */}
              <InteractiveRouteMap 
                circuit={activeCircuit}
                mapType={mapType}
                hoveredWaypoint={hoveredWaypoint}
                onSelectWaypoint={(name) => navigate(`/destinations?search=${name}`)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. WHY SOLOTRIP? SECTION (4 CORE PILLARS)
          ========================================================================= */}
      <section className="solotrip-section" style={{ paddingTop: 20 }}>
        <div className="container">
          <div className="solotrip-section-header">
            <div className="solotrip-section-title-wrap">
              <span className="solotrip-section-icon green">
                <CheckCircle2 size={22} />
              </span>
              <h2 className="solotrip-section-heading">Why SoloTrip?</h2>
            </div>
          </div>

          {/* 4 Feature Cards */}
          <div className="solotrip-why-grid">
            {WHY_SOLOTRIP_FEATURES.map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.id} className="solotrip-why-card">
                  <div 
                    className="solotrip-why-icon-box" 
                    style={{ 
                      '--why-bg': item.bgColor, 
                      '--why-color': item.iconColor,
                      '--why-dark-bg': item.darkBg,
                      '--why-dark-color': item.darkColor
                    } as React.CSSProperties}
                  >
                    <IconComp size={22} />
                  </div>
                  <div className="solotrip-why-content">
                    <h4 className="solotrip-why-title">{item.title}</h4>
                    <p className="solotrip-why-desc">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. UPCOMING GROUP TOURS (FIXED BATCHES WITH DEPARTURE CITIES)
          ========================================================================= */}
      <section className="solotrip-section" style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="solotrip-section-header">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                <Users size={15} /> Group Batches & Fixed Departures
              </div>
              <h2 className="solotrip-section-heading" style={{ fontSize: '1.45rem' }}>Upcoming Group Tours</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Join curated small group batches departing from Delhi, Mumbai, Bangalore & Chandigarh with certified captains.
              </p>
            </div>
            <Link to="/trips?style=Group" className="solotrip-view-all-link">
              <span>View All Group Batches</span>
              <span className="solotrip-arrow">➔</span>
            </Link>
          </div>

          <div className="trips-grid">
            {destinations.filter((d) => d.groupInfo).slice(0, 3).map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. SOLOTRIP VS TRADITIONAL TOUR OPERATORS COMPARISON
          ========================================================================= */}
      <section className="solotrip-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 36px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, background: 'rgba(52, 211, 153, 0.12)', padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(52, 211, 153, 0.25)' }}>
              <Sparkles size={15} /> The Solo Revolution
            </div>
            <h2 className="solotrip-section-heading" style={{ fontSize: '2rem', fontWeight: 800 }}>
              Why Travel Solo With Us?
            </h2>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-muted)', margin: '8px 0 0 0', lineHeight: 1.6 }}>
              Traditional travel agencies force solo explorers into rigid group compromises and hefty single-room penalties. Here is how SoloTrip puts you in complete control.
            </p>
          </div>

          <div className="comparison-wrapper">
            {/* Center Floating VS Badge for Desktop */}
            <div className="comparison-vs-badge">
              <span>VS</span>
            </div>

            <div className="comparison-container">
              {/* Traditional Agency Card */}
              <div className="comparison-card negative">
                <div className="comparison-card-top">
                  <div className="comparison-card-badge negative-badge">
                    <XCircle size={14} /> Outdated Agency Model
                  </div>
                  <h3 className="comparison-title">Traditional Tour Operators</h3>
                  <p className="comparison-subtitle">
                    Designed for rigid herds, not independent solo travelers.
                  </p>
                </div>

                <div className="comparison-items-list">
                  <div className="comparison-row-item negative-row">
                    <div className="comparison-icon-box negative-icon">
                      <XCircle size={18} />
                    </div>
                    <div className="comparison-row-text">
                      <strong>Hefty Single Supplements</strong>
                      <span>Penalized up to 40% more for wanting your own private room.</span>
                    </div>
                  </div>

                  <div className="comparison-row-item negative-row">
                    <div className="comparison-icon-box negative-icon">
                      <XCircle size={18} />
                    </div>
                    <div className="comparison-row-text">
                      <strong>Rigid 6 AM Schedules</strong>
                      <span>Forced wake-ups, hurried 15-minute stops, and zero personal freedom.</span>
                    </div>
                  </div>

                  <div className="comparison-row-item negative-row">
                    <div className="comparison-icon-box negative-icon">
                      <XCircle size={18} />
                    </div>
                    <div className="comparison-row-text">
                      <strong>Isolated Suburban Hotels</strong>
                      <span>Generic highway corporate hotels far away from authentic city life.</span>
                    </div>
                  </div>

                  <div className="comparison-row-item negative-row">
                    <div className="comparison-icon-box negative-icon">
                      <XCircle size={18} />
                    </div>
                    <div className="comparison-row-text">
                      <strong>Hidden On-Spot Surcharges</strong>
                      <span>Opaque pricing with surprise mandatory tips, guide fees & permit extras.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SoloTrip Positive Card (Champion Highlight) */}
              <div className="comparison-card positive">
                {/* Luminous Glow Highlight */}
                <div className="comparison-glow-effect" />
                
                <div className="comparison-card-top">
                  <div className="comparison-card-badge positive-badge">
                    <Sparkles size={14} /> 100% Tailored For Solos
                  </div>
                  <h3 className="comparison-title">The SoloTrip Ecosystem</h3>
                  <p className="comparison-subtitle">
                    Total freedom, authentic stays, and verified safety for independent explorers.
                  </p>
                </div>

                <div className="comparison-items-list">
                  <div className="comparison-row-item positive-row">
                    <div className="comparison-icon-box positive-icon">
                      <CheckCircle2 size={18} />
                    </div>
                    <div className="comparison-row-text">
                      <strong>Zero Single Room Penalties</strong>
                      <span>Transparent, direct itemized rates with guaranteed fair solo pricing.</span>
                    </div>
                  </div>

                  <div className="comparison-row-item positive-row">
                    <div className="comparison-icon-box positive-icon">
                      <CheckCircle2 size={18} />
                    </div>
                    <div className="comparison-row-text">
                      <strong>100% Schedule Autonomy</strong>
                      <span>Sleep in, linger at mountain cafes, or hike spontaneous trails at your pace.</span>
                    </div>
                  </div>

                  <div className="comparison-row-item positive-row">
                    <div className="comparison-icon-box positive-icon">
                      <CheckCircle2 size={18} />
                    </div>
                    <div className="comparison-row-text">
                      <strong>Handpicked Social Stays</strong>
                      <span>Vetted boutique hostels and homestays with common lounges & fast WiFi.</span>
                    </div>
                  </div>

                  <div className="comparison-row-item positive-row">
                    <div className="comparison-icon-box positive-icon">
                      <CheckCircle2 size={18} />
                    </div>
                    <div className="comparison-row-text">
                      <strong>Active Community & Live GPS Routes</strong>
                      <span>Real-time travel estimates from your city + forums to meet co-travelers.</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Trust Banner */}
                <div className="comparison-trust-banner">
                  <ShieldCheck size={16} />
                  <span>25-Point Safety Audit • Zero Hidden Fees • 24/7 Solo Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. REAL TRAVELER STORIES SNIPPET
          ========================================================================= */}
      <section className="solotrip-section" style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="solotrip-section-header">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                <BookOpen size={15} /> Real Solo Travelogues
              </div>
              <h2 className="solotrip-section-heading" style={{ fontSize: '1.45rem' }}>Traveler Stories & Guides</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Unfiltered perspectives, budgeting secrets, and guides written by real solo explorers.
              </p>
            </div>
            <Link to="/stories" className="solotrip-view-all-link">
              <span>Read All Stories</span>
              <span className="solotrip-arrow">➔</span>
            </Link>
          </div>

          <div className="stories-grid">
            {stories.slice(0, 3).map((story) => (
              <div 
                key={story.id} 
                className="story-card"
                onClick={() => setSelectedStory(story)}
                style={{ cursor: 'pointer' }}
              >
                <div className="story-card-img-wrap">
                  <img src={story.coverImage} alt={story.title} className="story-card-img" loading="lazy" />
                  <div 
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: 'rgba(15, 23, 42, 0.8)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 999
                    }}
                  >
                    {story.category}
                  </div>
                </div>
                <div className="story-card-body">
                  <h3 className="story-card-title">{story.title}</h3>
                  <div className="story-card-author">
                    <img src={story.author.avatar} alt={story.author.name} className="story-author-avatar" />
                    <div className="story-author-info">
                      <span className="story-author-name">{story.author.name}</span>
                      <span className="story-date">{story.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. TRAVELER PHOTO GALLERY SHOWCASE
          ========================================================================= */}
      <section className="solotrip-section">
        <div className="container">
          <div className="solotrip-section-header">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                <Camera size={15} /> Real Wanderers Community Feed
              </div>
              <h2 className="solotrip-section-heading" style={{ fontSize: '1.45rem' }}>Travelers Photo Gallery</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Live moments, mountain summits, and group memories posted by solo travelers and group batches.
              </p>
            </div>
            <Link to="/gallery" className="solotrip-view-all-link">
              <span>Explore Full Gallery ({galleryPhotos.length}+)</span>
              <span className="solotrip-arrow">➔</span>
            </Link>
          </div>

          <div className="gallery-grid">
            {galleryPhotos.slice(0, 3).map((photo) => (
              <div key={photo.id} className="gallery-card" onClick={() => navigate('/gallery')}>
                <img src={photo.imageUrl} alt={photo.caption} className="gallery-card-img" loading="lazy" />
                <div className="gallery-card-overlay" />
                
                <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6, zIndex: 3 }}>
                  <span className="gallery-tag">{photo.category}</span>
                  <span className="gallery-tag" style={{ background: 'rgba(15, 23, 42, 0.85)', color: '#fff' }}>
                    {photo.tripMode === 'Group' ? '👥 Group' : '👤 Solo'}
                  </span>
                </div>

                <button 
                  type="button"
                  className={`gallery-like-btn ${photo.isLiked ? 'liked' : ''}`}
                  onClick={(e) => handleLikePhoto(e, photo.id)}
                >
                  <Heart size={14} fill={photo.isLiked ? '#f43f5e' : 'none'} stroke={photo.isLiked ? '#f43f5e' : '#ffffff'} />
                  <span>{photo.likesCount}</span>
                </button>

                <div className="gallery-card-info">
                  <p className="gallery-card-caption">{photo.caption}</p>
                  <div className="gallery-card-author-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <img src={photo.travelerAvatar} alt={photo.travelerName} className="gallery-author-avatar" />
                      <span className="gallery-author-name">{photo.travelerName}</span>
                    </div>
                    <span className="gallery-location-tag">
                      <MapPin size={11} /> {photo.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. WHAT TRAVELERS SAY SECTION (TESTIMONIALS CAROUSEL)
          ========================================================================= */}
      <section className="solotrip-section" style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="solotrip-section-header">
            <div className="solotrip-section-title-wrap">
              <span className="solotrip-section-icon green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                </svg>
              </span>
              <h2 className="solotrip-section-heading">What Travelers Say</h2>
            </div>

            {/* Carousel Navigation Buttons */}
            <div className="solotrip-carousel-nav">
              <button 
                type="button" 
                className="solotrip-carousel-arrow-btn" 
                onClick={handlePrevTestimonial}
                aria-label="Previous Testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                type="button" 
                className="solotrip-carousel-arrow-btn" 
                onClick={handleNextTestimonial}
                aria-label="Next Testimonial"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="solotrip-testimonials-grid">
            {TESTIMONIALS.map((testi, idx) => (
              <div 
                key={testi.id} 
                className={`solotrip-testimonial-card ${activeTestimonialIdx === idx ? 'highlight' : ''}`}
              >
                <div className="solotrip-testi-author-row">
                  <img src={testi.avatar} alt={testi.name} className="solotrip-testi-avatar" />
                  <div>
                    <h4 className="solotrip-testi-name">{testi.name}</h4>
                    <span className="solotrip-testi-city">{testi.city}</span>
                  </div>
                </div>

                <p className="solotrip-testi-quote">{testi.quote}</p>

                <div className="solotrip-testi-stars">
                  {[...Array(testi.rating)].map((_, starIdx) => (
                    <Star key={starIdx} size={14} fill="#eab308" color="#eab308" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          11. FREQUENTLY ASKED QUESTIONS (ACCORDION)
          ========================================================================= */}
      <section className="solotrip-section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
              <BookOpen size={16} /> Clear Answers
            </div>
            <h2 className="solotrip-section-heading" style={{ fontSize: '1.6rem' }}>Frequently Asked Questions</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Everything you need to know about planning, safety, pricing, and community on SoloTrip.
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`faq-item ${activeFaqIndex === idx ? 'active' : ''}`}
              >
                <button 
                  type="button" 
                  className="faq-question-btn"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={activeFaqIndex === idx}
                >
                  <span className="faq-question-text">{faq.q}</span>
                  <span className="faq-icon-toggle">
                    <ChevronDown size={18} />
                  </span>
                </button>
                {activeFaqIndex === idx && (
                  <div className="faq-answer animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      <StoryModal 
        story={selectedStory}
        isOpen={!!selectedStory}
        onClose={() => setSelectedStory(null)}
        isWriting={isWriteStoryOpen}
        onStoryCreated={(newStory) => {
          setStories([newStory, ...stories]);
          setIsWriteStoryOpen(false);
          showToast('🎉 Your travel story has been published!', 'success');
        }}
      />

      <DiscussionModal
        discussion={selectedDiscussion}
        isOpen={!!selectedDiscussion || isCreateDiscussionOpen}
        onClose={() => {
          setSelectedDiscussion(null);
          setIsCreateDiscussionOpen(false);
        }}
        isCreating={isCreateDiscussionOpen}
        onDiscussionCreated={(newDisc) => {
          setDiscussions([newDisc, ...discussions]);
          setIsCreateDiscussionOpen(false);
          showToast('🎉 Discussion thread created!', 'success');
        }}
      />
    </div>
  );
};
