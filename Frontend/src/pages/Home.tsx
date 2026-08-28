import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  ArrowRight, 
  Users, 
  Smile, 
  Camera, 
  MessageSquare,
  ThumbsUp,
  MapPin,
  Map as MapIcon,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  DollarSign,
  Navigation,
  BookOpen,
  Route,
  ChevronDown,
  XCircle,
  Award,
  Heart
} from 'lucide-react';
import { SearchWidget } from '../components/SearchWidget';
import { DestinationCard } from '../components/DestinationCard';
import { TripCard } from '../components/TripCard';
import { GoogleMapView } from '../components/GoogleMapView';
import { StoryModal } from '../components/StoryModal';
import { DiscussionModal } from '../components/DiscussionModal';
import type { Destination, Story, Discussion, GalleryPhoto } from '../services/api';
import { 
  fetchDestinations, 
  fetchGalleryPhotos,
  likeGalleryPhoto,
  INITIAL_DESTINATIONS, 
  INITIAL_STORIES, 
  INITIAL_DISCUSSIONS,
  INITIAL_GALLERY_PHOTOS
} from '../services/api';

export const Home: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(INITIAL_GALLERY_PHOTOS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [discussions, setDiscussions] = useState<Discussion[]>(INITIAL_DISCUSSIONS);

  // Modals
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isWriteStoryOpen, setIsWriteStoryOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [isCreateDiscussionOpen, setIsCreateDiscussionOpen] = useState(false);

  // FAQ Accordion State
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    fetchDestinations().then((data) => {
      if (data && data.length > 0) setDestinations(data);
    });
    fetchGalleryPhotos().then((photos) => {
      if (photos && photos.length > 0) setGalleryPhotos(photos);
    });
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleLikePhoto = async (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    const updated = await likeGalleryPhoto(id);
    setGalleryPhotos(updated);
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
    <div>
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-background" />
        <div className="hero-overlay" />
        
        <div className="container" style={{ width: '100%' }}>
          <div className="hero-content animate-fade-in">
            <div className="hero-badge">
              <Compass size={16} /> <span>India's Dedicated Solo Travel Platform</span>
            </div>
            
            <h1 className="hero-title">
              Explore the World.<br />
              <span>Discover Yourself.</span>
            </h1>
            
            <p className="hero-subtitle">
              Your all-in-one ecosystem for independent adventures. Handcrafted solo itineraries, verified safe stays, transparent travel costs, live route estimates, and a community of 50,000+ fearless wanderers.
            </p>

            {/* Quick Platform Value Badges */}
            <div className="hero-pills-row">
              <span className="hero-pill-badge">
                <ShieldCheck size={14} color="#34d399" /> 100% Vetted Solo Stays
              </span>
              <span className="hero-pill-badge">
                <Navigation size={14} color="#38bdf8" /> Live Route & Distance
              </span>
              <span className="hero-pill-badge">
                <DollarSign size={14} color="#fbbf24" /> Zero Single Penalty
              </span>
              <span className="hero-pill-badge">
                <Users size={14} color="#c084fc" /> 50K+ Co-Wanderers
              </span>
            </div>

            {/* Hero Search Box / Widget */}
            <div className="hero-search-container">
              <SearchWidget />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Overview & Ecosystem Description */}
      <section className="section" style={{ paddingTop: 30, paddingBottom: 20 }}>
        <div className="container">
          <div className="platform-intro-card">
            <div className="platform-intro-header">
              <div className="platform-pill-tag">
                <Sparkles size={14} /> What is SoloTrip?
              </div>
              <h2 className="platform-intro-title">
                Your Complete Ecosystem for Fearless, Authentic Solo Travel
              </h2>
              <p className="platform-intro-desc">
                Solo travel is the ultimate catalyst for personal freedom, self-reliance, and unforgettable life experiences. SoloTrip eliminates the fear of isolation, opaque charges, and unsafe accommodations. We give you vetted stays, transparent pricing, live travel calculations, and a supportive community that always has your back.
              </p>
            </div>

            {/* 4 Core Pillars of SoloTrip */}
            <div className="platform-pillars-grid">
              {/* Pillar 1 */}
              <div className="platform-pillar-card">
                <div className="pillar-icon-box sky">
                  <Compass size={24} />
                </div>
                <h3 className="pillar-title">Curated Solo Itineraries</h3>
                <p className="pillar-text">
                  Handcrafted day-by-day travel plans designed specifically for solo explorers with realistic pace and cultural depth.
                </p>
                <ul className="pillar-features-list">
                  <li className="pillar-feature-item">
                    <CheckCircle2 size={14} color="#38bdf8" /> Transparent cost breakdown
                  </li>
                  <li className="pillar-feature-item">
                    <CheckCircle2 size={14} color="#38bdf8" /> Zero single-person surcharges
                  </li>
                  <li className="pillar-feature-item">
                    <CheckCircle2 size={14} color="#38bdf8" /> Best season & packing guides
                  </li>
                </ul>
              </div>

              {/* Pillar 2 */}
              <div className="platform-pillar-card">
                <div className="pillar-icon-box emerald">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="pillar-title">100% Vetted Safe Stays</h3>
                <p className="pillar-text">
                  Hostels, boutique homestays, and boutique lodges verified with our 25-point solo traveler safety and hygiene checklist.
                </p>
                <ul className="pillar-features-list">
                  <li className="pillar-feature-item">
                    <CheckCircle2 size={14} color="#34d399" /> Female-friendly verified stays
                  </li>
                  <li className="pillar-feature-item">
                    <CheckCircle2 size={14} color="#34d399" /> 24/7 check-in & secure lockers
                  </li>
                  <li className="pillar-feature-item">
                    <CheckCircle2 size={14} color="#34d399" /> Social common rooms & cafes
                  </li>
                </ul>
              </div>

              {/* Pillar 3 */}
              <div className="platform-pillar-card">
                <div className="pillar-icon-box amber">
                  <Navigation size={24} />
                </div>
                <h3 className="pillar-title">Smart Route & Distance</h3>
                <p className="pillar-text">
                  Interactive travel calculator providing exact driving distances and transit durations directly from your current location.
                </p>
                <ul className="pillar-features-list">
                  <li className="pillar-feature-item">
                    <CheckCircle2 size={14} color="#fbbf24" /> Live GPS distance calculation
                  </li>
                  <li className="pillar-feature-item">
                    <CheckCircle2 size={14} color="#fbbf24" /> Mountain & road status alerts
                  </li>
                  <li className="pillar-feature-item">
                    <CheckCircle2 size={14} color="#fbbf24" /> Interactive Google Map explorer
                  </li>
                </ul>
              </div>

              {/* Pillar 4 */}
              <div className="platform-pillar-card">
                <div className="pillar-icon-box purple">
                  <Users size={24} />
                </div>
                <h3 className="pillar-title">Thriving Solo Community</h3>
                <p className="pillar-text">
                  Connect with fellow solo wanderers, exchange real-time local advice, find travel buddies for shared legs, and share your stories.
                </p>
                <ul className="pillar-features-list">
                  <li className="pillar-feature-item">
                    <CheckCircle2 size={14} color="#c084fc" /> Real unfiltered travelogues
                  </li>
                  <li className="pillar-feature-item">
                    <CheckCircle2 size={14} color="#c084fc" /> Destination discussion forums
                  </li>
                  <li className="pillar-feature-item">
                    <CheckCircle2 size={14} color="#c084fc" /> Find verified travel companions
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Stats Impact Banner */}
          <div className="stats-banner">
            <div className="stat-item">
              <div className="stat-icon-wrapper" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                <Users size={26} />
              </div>
              <div>
                <div className="stat-number">50,000+</div>
                <div className="stat-label">Solo Travelers Empowered</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrapper" style={{ background: '#ecfdf5', color: '#059669' }}>
                <MapPin size={26} />
              </div>
              <div>
                <div className="stat-number">120+</div>
                <div className="stat-label">Handpicked Destinations</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrapper" style={{ background: '#fff7ed', color: '#ea580c' }}>
                <ShieldCheck size={26} />
              </div>
              <div>
                <div className="stat-number">100%</div>
                <div className="stat-label">Safety Vetted Accommodations</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrapper" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                <Award size={26} />
              </div>
              <div>
                <div className="stat-number">4.9 / 5.0</div>
                <div className="stat-label">Community Satisfaction Score</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How SoloTrip Works (4-Step Process) */}
      <section className="section" style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 16px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#0284c7', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              <Route size={16} /> Seamless Solo Journey
            </div>
            <h2 className="section-title">How SoloTrip Works</h2>
            <p className="section-subtitle">
              From your initial travel dream to arriving on-ground and making lifelong memories, we streamline every single step.
            </p>
          </div>

          <div className="how-it-works-grid">
            {/* Step 1 */}
            <div className="how-step-card">
              <span className="step-num-pill">STEP 01</span>
              <h3 className="how-step-title">Discover & Calculate</h3>
              <p className="how-step-desc">
                Browse curated destinations filtered by budget, vibe (mountains, beaches, heritage), and see live driving & transit travel duration directly from your city.
              </p>
              <span className="how-step-tag">
                <Navigation size={13} /> Live Geo-Calculations
              </span>
            </div>

            {/* Step 2 */}
            <div className="how-step-card">
              <span className="step-num-pill">STEP 02</span>
              <h3 className="how-step-title">Review Real Costs</h3>
              <p className="how-step-desc">
                Explore day-by-day itineraries with full itemized cost breakdowns (stay + activities + food estimates) so you never encounter unexpected hidden expenses.
              </p>
              <span className="how-step-tag" style={{ background: '#ecfdf5', color: '#059669' }}>
                <DollarSign size={13} /> Transparent Pricing
              </span>
            </div>

            {/* Step 3 */}
            <div className="how-step-card">
              <span className="step-num-pill">STEP 03</span>
              <h3 className="how-step-title">Book with Peace of Mind</h3>
              <p className="how-step-desc">
                Reserve vetted solo stays, receive emergency checklists, connect with certified local guides, and manage all your bookings with flexible cancellation.
              </p>
              <span className="how-step-tag" style={{ background: '#fef3c7', color: '#d97706' }}>
                <ShieldCheck size={13} /> Vetted Safety Audit
              </span>
            </div>

            {/* Step 4 */}
            <div className="how-step-card">
              <span className="step-num-pill">STEP 04</span>
              <h3 className="how-step-title">Connect & Share</h3>
              <p className="how-step-desc">
                Join active community threads, meet solo wanderers at your destination, share your photos and reviews, and inspire the next wave of solo explorers.
              </p>
              <span className="how-step-tag" style={{ background: '#f3e8ff', color: '#7e22ce' }}>
                <Users size={13} /> Global Community
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Popular Destinations Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Popular Solo Destinations</h2>
              <p className="section-subtitle">Trending spots handpicked for safety, scenic beauty, and vibrant solo culture</p>
            </div>
            <Link to="/destinations" className="view-all-link">
              View All Destinations <ArrowRight size={16} />
            </Link>
          </div>

          <div className="destinations-grid">
            {destinations.slice(0, 5).map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>

          {/* Interactive Google Map Section */}
          <div style={{ marginTop: 48, background: '#ffffff', borderRadius: 24, padding: '32px 28px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0284c7', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                  <MapIcon size={16} /> Interactive Map Explorer
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Discover Places by Location & Route
                </h3>
              </div>
              <Link 
                to="/destinations" 
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <MapPin size={14} /> Fullscreen Map View <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <GoogleMapView
                destinations={destinations}
                height="420px"
                showControls={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4b. Upcoming Group Tours Section (With Defined Departure Origin Cities) */}
      <section className="section" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#0284c7', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                <Users size={15} /> Group Batches & Fixed Departures
              </div>
              <h2 className="section-title">Upcoming Group Tours</h2>
              <p className="section-subtitle">
                Join curated small group batches departing from Delhi, Mumbai, Bangalore & Chandigarh with certified trip captains.
              </p>
            </div>
            <Link to="/trips?style=Group" className="view-all-link">
              View All Group Batches <ArrowRight size={16} />
            </Link>
          </div>

          <div className="trips-grid">
            {destinations.filter((d) => d.groupInfo).slice(0, 3).map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. SoloTrip vs Traditional Tour Operators Comparison */}
      <section className="section" style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 16px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#0284c7', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              <Sparkles size={16} /> The Solo Difference
            </div>
            <h2 className="section-title">Why Travel Solo With Us?</h2>
            <p className="section-subtitle">
              Traditional tour agencies force solo travelers into rigid group compromises and expensive penalties. Here is how SoloTrip rewrites the rules.
            </p>
          </div>

          <div className="comparison-container">
            {/* Traditional Agency Card */}
            <div className="comparison-card negative">
              <div className="comparison-card-badge">
                <XCircle size={14} /> Traditional Tour Agencies
              </div>
              <h3 className="comparison-title">The Outdated Group Model</h3>
              <ul className="comparison-list">
                <li className="comparison-item">
                  <XCircle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span><strong>Hefty Single Penalties:</strong> Charged up to 40% more for traveling solo without a shared room partner.</span>
                </li>
                <li className="comparison-item">
                  <XCircle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span><strong>Rigid Fixed Schedules:</strong> Forced wake-up times, hurried sightseeing stops, and zero personal freedom.</span>
                </li>
                <li className="comparison-item">
                  <XCircle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span><strong>Disconnected Big Hotels:</strong> Generic corporate hotels outside city centers with zero social traveler atmosphere.</span>
                </li>
                <li className="comparison-item">
                  <XCircle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span><strong>Hidden Extra Charges:</strong> Opaque pricing with surprise on-spot fees for meals, guides, and permits.</span>
                </li>
              </ul>
            </div>

            {/* SoloTrip Positive Card */}
            <div className="comparison-card positive">
              <div className="comparison-card-badge">
                <CheckCircle2 size={14} /> The SoloTrip Ecosystem
              </div>
              <h3 className="comparison-title">Built 100% For Your Independence</h3>
              <ul className="comparison-list">
                <li className="comparison-item">
                  <CheckCircle2 size={18} color="#34d399" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span><strong>Zero Single-Person Surcharges:</strong> Transparent, direct itemized pricing with fair rates for solo bookings.</span>
                </li>
                <li className="comparison-item">
                  <CheckCircle2 size={18} color="#34d399" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span><strong>Total Schedule Autonomy:</strong> Wake up when you want, explore hidden cafes, or linger by mountain streams without rushing.</span>
                </li>
                <li className="comparison-item">
                  <CheckCircle2 size={18} color="#34d399" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span><strong>Vetted Social Stays:</strong> Handpicked boutique hostels and homestays with common lounges, fast WiFi, and certified security.</span>
                </li>
                <li className="comparison-item">
                  <CheckCircle2 size={18} color="#34d399" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span><strong>Supportive Community & Live GPS:</strong> Real-time route estimates from your city and forums to meet co-travelers when you want company.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why Solo Travel? Core Benefits */}
      <section className="section" style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 40px' }}>
            <h2 className="section-title">The Transformative Power of Solo Travel</h2>
            <p className="section-subtitle">
              It is not just a journey across geographical maps; it is a profound journey of self-discovery and resilience.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1: Freedom */}
            <div className="feature-card">
              <div className="feature-icon-badge sky">
                <Compass size={26} />
              </div>
              <h3 className="feature-title">Absolute Freedom</h3>
              <p className="feature-desc">
                Go where you want, when you want. Set your own pace, alter your plans spontaneously, and travel with zero compromises.
              </p>
            </div>

            {/* Feature 2: Self Discovery */}
            <div className="feature-card">
              <div className="feature-icon-badge emerald">
                <Smile size={26} />
              </div>
              <h3 className="feature-title">Self Discovery & Resilience</h3>
              <p className="feature-desc">
                Conquer new terrains, solve real-world transit challenges, and discover a profound inner confidence you never knew you had.
              </p>
            </div>

            {/* Feature 3: New Connections */}
            <div className="feature-card">
              <div className="feature-icon-badge indigo">
                <Users size={26} />
              </div>
              <h3 className="feature-title">Lifelong Connections</h3>
              <p className="feature-desc">
                Meet kindred solo wanderers, backpackers, and welcoming locals who turn accidental conversations into lifelong friendships.
              </p>
            </div>

            {/* Feature 4: Unforgettable Memories */}
            <div className="feature-card">
              <div className="feature-icon-badge orange">
                <Camera size={26} />
              </div>
              <h3 className="feature-title">Unfiltered Stories</h3>
              <p className="feature-desc">
                Collect raw, authentic memories, personal photographs, and empowering moments that stay etched in your heart forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Share Your Journey Banner */}
      <div className="container">
        <div className="share-banner">
          <div className="share-banner-bg" />
          <div className="share-banner-overlay" />
          <div className="share-banner-content">
            <h2 className="share-banner-title">Share Your Solo Journey</h2>
            <p className="share-banner-subtitle">
              Your personal experience, budget breakdown, and travel tips can inspire thousands of solo wanderers taking their very first brave step.
            </p>
            <button 
              className="btn btn-primary"
              style={{ background: '#ffffff', color: '#0f172a', fontWeight: 700 }}
              onClick={() => setIsWriteStoryOpen(true)}
            >
              Write Your Story
            </button>
          </div>
        </div>
      </div>

      {/* 8. Travel Stories Snippet */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Real Solo Travel Stories</h2>
              <p className="section-subtitle">Unfiltered perspectives, budgeting secrets, and guides written by real solo explorers</p>
            </div>
            <Link to="/stories" className="view-all-link">
              Read All Stories <ArrowRight size={16} />
            </Link>
          </div>

          <div className="stories-grid">
            {stories.slice(0, 3).map((story) => (
              <div 
                key={story.id} 
                className="story-card"
                onClick={() => setSelectedStory(story)}
              >
                <div className="story-card-img-wrap">
                  <img src={story.coverImage} alt={story.title} className="story-card-img" loading="lazy" />
                  <div 
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: 'rgba(15, 23, 42, 0.75)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 600,
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

      {/* 8b. Real Traveler Photo Gallery Showcase */}
      <section className="section" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#0284c7', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                <Camera size={15} /> Real Wanderers Community Feed
              </div>
              <h2 className="section-title">Travelers Photo Gallery</h2>
              <p className="section-subtitle">
                Live moments, summits conquered, and group laughter posted by solo travelers and group batches.
              </p>
            </div>
            <Link to="/gallery" className="view-all-link">
              Explore Full Gallery ({galleryPhotos.length}+) <ArrowRight size={16} />
            </Link>
          </div>

          <div className="gallery-grid">
            {galleryPhotos.slice(0, 3).map((photo) => (
              <div key={photo.id} className="gallery-card" onClick={() => window.location.href = '/gallery'}>
                <img src={photo.imageUrl} alt={photo.caption} className="gallery-card-img" loading="lazy" />
                <div className="gallery-card-overlay" />
                
                <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6, zIndex: 3 }}>
                  <span className="gallery-tag">{photo.category}</span>
                  <span className="gallery-tag" style={{ background: 'rgba(15, 23, 42, 0.85)', color: '#fff' }}>
                    {photo.tripMode === 'Group' ? '👥 Group' : '👤 Solo'}
                  </span>
                </div>

                <button 
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

      {/* 9. Interactive Solo Travel FAQ Section */}
      <section className="section" style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#0284c7', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              <BookOpen size={16} /> Clear Answers
            </div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
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
                    <ChevronDown size={20} />
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

      {/* 10. Community Section Preview */}
      <section className="section" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Solo Traveler Community</h2>
              <p className="section-subtitle">Ask questions, share advice, and connect with fellow explorers worldwide</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setIsCreateDiscussionOpen(true)}
              >
                Start a Discussion
              </button>
              <Link to="/community" className="btn btn-secondary btn-sm">
                View All Discussions
              </Link>
            </div>
          </div>

          <div className="discussions-list">
            {discussions.slice(0, 3).map((disc) => (
              <div 
                key={disc.id} 
                className="discussion-item"
                onClick={() => setSelectedDiscussion(disc)}
              >
                <div className="discussion-left">
                  <div className="discussion-avatar">
                    {disc.author.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="discussion-title">{disc.title}</h4>
                    <div className="discussion-meta">
                      {disc.author.name} · {disc.timeAgo}
                    </div>
                  </div>
                </div>

                <div className="discussion-stats">
                  <div className="discussion-stat-item">
                    <MessageSquare size={16} />
                    <span>{disc.repliesCount}</span>
                  </div>
                  <div className="discussion-stat-item">
                    <ThumbsUp size={16} />
                    <span>{disc.likesCount}</span>
                  </div>
                </div>
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
      />

      <StoryModal 
        isWriting={true}
        isOpen={isWriteStoryOpen}
        onClose={() => setIsWriteStoryOpen(false)}
        onStoryCreated={(newStory) => {
          setStories((prev) => [newStory, ...prev]);
        }}
      />

      <DiscussionModal
        discussion={selectedDiscussion}
        isOpen={!!selectedDiscussion}
        onClose={() => setSelectedDiscussion(null)}
      />

      <DiscussionModal
        isCreating={true}
        isOpen={isCreateDiscussionOpen}
        onClose={() => setIsCreateDiscussionOpen(false)}
        onDiscussionCreated={(newDisc) => {
          setDiscussions((prev) => [newDisc, ...prev]);
        }}
      />
    </div>
  );
};

