import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  MapPin, 
  Users, 
  Calendar, 
  Image as ImageIcon, 
  X, 
  Search, 
  ShieldCheck, 
  Layers, 
  MessageSquare, 
  LayoutDashboard, 
  User, 
  Star, 
  Settings, 
  ExternalLink, 
  DollarSign, 
  PlaneTakeoff, 
  Eye, 
  EyeOff,
  Clock, 
  Menu,
  Lock,
  LogOut,
  KeyRound,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { 
  fetchDestinations, 
  saveDestination, 
  deleteDestination, 
  fetchGalleryPhotos, 
  saveGalleryPhoto, 
  deleteGalleryPhoto, 
  fetchAllBookings, 
  updateBookingStatus, 
  type Destination, 
  type GalleryPhoto, 
  type Booking, 
  INITIAL_STORIES, 
  INITIAL_DISCUSSIONS, 
  type Story, 
  type Discussion 
} from '../services/api';
import { useWishlist } from '../context/WishlistContext';

type AdminTab = 
  | 'dashboard'
  | 'destinations'
  | 'all-trips'
  | 'solo-tours'
  | 'group-tours'
  | 'gallery'
  | 'bookings'
  | 'community'
  | 'reviews'
  | 'settings';

export const AdminPage: React.FC = () => {
  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('solotrip_admin_auth') === 'true' || 
           localStorage.getItem('solotrip_admin_auth') === 'true';
  });

  // Admin Login Form States
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab & UI
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Data States
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stories] = useState<Story[]>(INITIAL_STORIES);
  const [discussions] = useState<Discussion[]>(INITIAL_DISCUSSIONS);
  
  // Search / Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOriginFilter, setSelectedOriginFilter] = useState('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Trip Modal States (Create / Edit)
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [editingTripId, setEditingTripId] = useState<string | number | null>(null);
  
  // Trip Form Fields
  const [tripName, setTripName] = useState('');
  const [tripCity, setTripCity] = useState('');
  const [tripState, setTripState] = useState('');
  const [tripCategory, setTripCategory] = useState<Destination['category']>('Mountains');
  const [tripPrice, setTripPrice] = useState<number>(6999);
  const [tripDays, setTripDays] = useState<number>(4);
  const [tripNights, setTripNights] = useState<number>(3);
  const [tripImage, setTripImage] = useState('');
  const [tripAbout, setTripAbout] = useState('');
  const [tripBestTime, setTripBestTime] = useState('Mar - Jun, Sep - Nov');
  const [tripDifficulty, setTripDifficulty] = useState('Easy to Moderate');
  
  // Tour Style Toggle
  const [isGroupTour, setIsGroupTour] = useState(true);
  const [groupOriginCity, setGroupOriginCity] = useState('Delhi');
  const [groupDeparturePoint, setGroupDeparturePoint] = useState('Majnu Ka Tilla / Kashmiri Gate Metro');
  const [groupName, setGroupName] = useState('');
  const [groupType, setGroupType] = useState('Young Professionals & Solo Backpackers (20-35 yrs)');
  const [groupTotalSeats, setGroupTotalSeats] = useState<number>(14);
  const [groupBookedSeats, setGroupBookedSeats] = useState<number>(8);
  const [groupNextBatchDate, setGroupNextBatchDate] = useState('Every Friday');
  const [groupTripCaptain, setGroupTripCaptain] = useState('Capt. Vikram (Certified Mountain Guide)');

  // Destination (Location) Modal State
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const [editingDestId, setEditingDestId] = useState<string | number | null>(null);
  const [destName, setDestName] = useState('');
  const [destState, setDestState] = useState('');
  const [destCity, setDestCity] = useState('');
  const [destCategory, setDestCategory] = useState<Destination['category']>('Mountains');
  const [destImage, setDestImage] = useState('');
  const [destAbout, setDestAbout] = useState('');
  const [destBestTime, setDestBestTime] = useState('All Year Round');
  const [destPrice, setDestPrice] = useState<number>(7500);

  // Gallery Modal State
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryImageUrl, setGalleryImageUrl] = useState('');
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryTravelerName, setGalleryTravelerName] = useState('');
  const [galleryLocation, setGalleryLocation] = useState('');
  const [galleryCategory, setGalleryCategory] = useState<GalleryPhoto['category']>('Mountains');
  const [galleryTripMode, setGalleryTripMode] = useState<'Solo' | 'Group'>('Solo');

  // Platform Settings States
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210');
  const [supportEmail, setSupportEmail] = useState('support@solotrip.in');
  const [heroAnnouncement, setHeroAnnouncement] = useState('🔥 15% OFF on upcoming Himachal & Spiti Solo Departures!');
  const [zeroPenaltyBadge, setZeroPenaltyBadge] = useState(true);

  const { showToast } = useWishlist();

  const loadData = async () => {
    const [dests, photos, bks] = await Promise.all([
      fetchDestinations(),
      fetchGalleryPhotos(),
      fetchAllBookings()
    ]);
    setDestinations(dests);
    setGalleryPhotos(photos);
    setBookings(bks);
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadData();
    }
  }, [isAdminAuthenticated]);

  // --- ADMIN LOGIN HANDLERS ---
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    setTimeout(() => {
      const cleanEmail = adminEmail.trim().toLowerCase();
      const cleanPass = adminPassword.trim();

      // Check Master Admin Credentials
      if (
        (cleanEmail === 'admin@solotrip.in' || cleanEmail === 'admin') &&
        (cleanPass === 'admin@solotrip123' || cleanPass === 'admin' || cleanPass === 'solotrip2026')
      ) {
        sessionStorage.setItem('solotrip_admin_auth', 'true');
        setIsAdminAuthenticated(true);
        setIsLoggingIn(false);
        showToast('🔓 Welcome to SoloTrip Admin Console!', 'success');
      } else {
        setIsLoggingIn(false);
        setLoginError('Invalid credentials. Please enter valid admin email & security password.');
      }
    }, 400);
  };

  const handleFillDemoCredentials = () => {
    setAdminEmail('admin@solotrip.in');
    setAdminPassword('admin@solotrip123');
    setLoginError('');
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('solotrip_admin_auth');
    localStorage.removeItem('solotrip_admin_auth');
    setIsAdminAuthenticated(false);
    showToast('🔒 Admin session signed out successfully.', 'info');
  };

  // --- FILTERED LISTS ---
  const soloTrips = destinations.filter(d => !d.groupInfo || d.travelType === 'Solo' || d.travelType === 'Both');
  const groupTrips = destinations.filter(d => !!d.groupInfo);

  // Total Revenue Calculation
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const confirmedBookingsCount = bookings.filter(b => b.status === 'Confirmed').length;

  // --- TRIP CRUD ---
  const handleOpenAddTrip = (forceGroup = false, forceSolo = false) => {
    setEditingTripId(null);
    setTripName('');
    setTripCity('');
    setTripState('');
    setTripCategory('Mountains');
    setTripPrice(6999);
    setTripDays(4);
    setTripNights(3);
    setTripImage('https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80');
    setTripAbout('A scenic getaway handcrafted for solo explorers and group travel batches.');
    setTripBestTime('Mar - Jun, Sep - Nov');
    setTripDifficulty('Easy to Moderate');
    
    setIsGroupTour(forceSolo ? false : forceGroup ? true : true);
    setGroupOriginCity('Delhi');
    setGroupDeparturePoint('Majnu Ka Tilla / Kashmiri Gate Metro, Delhi');
    setGroupName('Delhi Weekend Backpackers Batch');
    setGroupType('Young Professionals & Solo Backpackers (20-35 yrs)');
    setGroupTotalSeats(14);
    setGroupBookedSeats(6);
    setGroupNextBatchDate('Every Friday (Upcoming)');
    setGroupTripCaptain('Capt. Vikram (Certified Mountain Guide)');
    
    setIsTripModalOpen(true);
  };

  const handleOpenEditTrip = (trip: Destination) => {
    setEditingTripId(trip.id);
    setTripName(trip.name);
    setTripCity(trip.city || '');
    setTripState(trip.state || '');
    setTripCategory(trip.category);
    setTripPrice(trip.price);
    setTripDays(trip.days);
    setTripNights(trip.nights);
    setTripImage(trip.image);
    setTripAbout(trip.about);
    setTripBestTime(trip.bestTime);
    setTripDifficulty(trip.difficulty);

    if (trip.groupInfo) {
      setIsGroupTour(true);
      setGroupOriginCity(trip.groupInfo.originCity);
      setGroupDeparturePoint(trip.groupInfo.departurePoint);
      setGroupName(trip.groupInfo.groupName);
      setGroupType(trip.groupInfo.groupType);
      setGroupTotalSeats(trip.groupInfo.totalSeats);
      setGroupBookedSeats(trip.groupInfo.bookedSeats);
      setGroupNextBatchDate(trip.groupInfo.nextBatchDate);
      setGroupTripCaptain(trip.groupInfo.tripCaptain);
    } else {
      setIsGroupTour(false);
    }

    setIsTripModalOpen(true);
  };

  const handleSaveTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripName || !tripImage) {
      showToast('Please provide trip title and image URL', 'error');
      return;
    }

    const tripData: Destination = {
      id: editingTripId || Date.now(),
      name: tripName,
      location: `${tripCity || tripName}, ${tripState || 'India'}`,
      country: 'India',
      city: tripCity,
      state: tripState,
      address: `${tripName}, ${tripCity || ''}, ${tripState || ''}`,
      category: tripCategory,
      tags: [tripCategory, isGroupTour ? 'Group Tour' : 'Solo Friendly'],
      rating: 4.8,
      reviewsCount: 28,
      price: Number(tripPrice),
      duration: `${tripDays} Days / ${tripNights} Nights`,
      days: Number(tripDays),
      nights: Number(tripNights),
      image: tripImage,
      gallery: [tripImage],
      about: tripAbout,
      bestTime: tripBestTime,
      tripType: isGroupTour ? 'Group Tour, Adventure' : 'Solo Expedition',
      difficulty: tripDifficulty,
      groupSize: isGroupTour ? `1 - ${groupTotalSeats} People` : '1 - 10 People',
      travelType: isGroupTour ? 'Both' : 'Solo',
      groupInfo: isGroupTour ? {
        originCity: groupOriginCity,
        departurePoint: groupDeparturePoint,
        groupName: groupName || `${groupOriginCity} Backpackers Batch`,
        groupType: groupType,
        ageGroup: '20 - 35 yrs',
        totalSeats: Number(groupTotalSeats),
        bookedSeats: Number(groupBookedSeats),
        nextBatchDate: groupNextBatchDate,
        upcomingBatches: [groupNextBatchDate, 'Next Week', 'Following Weekend'],
        tripCaptain: groupTripCaptain,
        genderRatio: '50% Female / 50% Male'
      } : undefined,
      itinerary: [
        { day: 1, title: 'Arrival & Welcome Meetup', description: 'Check into your stay, meet the trip captain and fellow travelers.' },
        { day: 2, title: 'Main Expedition & Local Sightseeing', description: 'Explore top scenic attractions and local culture.' },
        { day: 3, title: 'Trek / Outdoor Adventure', description: 'Scenic trek with photos and evening community bonfire.' },
        { day: 4, title: 'Souvenirs & Departure', description: 'Farewell breakfast and return transit.' }
      ],
      inclusions: ['Accommodation in vetted stays', 'Daily breakfast & dinner', 'Certified trip leader', 'Local transfers'],
      exclusions: ['Personal expenses', 'Optional adventure sports'],
      reviews: []
    };

    const updated = await saveDestination(tripData);
    setDestinations(updated);
    setIsTripModalOpen(false);
    showToast(editingTripId ? '✅ Trip updated successfully!' : '🎉 New trip added to catalog!', 'success');
  };

  const handleDeleteTrip = async (id: string | number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const updated = await deleteDestination(id);
      setDestinations(updated);
      showToast('🗑️ Trip deleted from catalog.', 'info');
    }
  };

  // --- DESTINATION / LOCATION CRUD ---
  const handleOpenAddDestination = () => {
    setEditingDestId(null);
    setDestName('');
    setDestCity('');
    setDestState('');
    setDestCategory('Mountains');
    setDestImage('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80');
    setDestAbout('A pristine travel destination offering picturesque vistas, local trails, and rich culture.');
    setDestBestTime('Sep - May');
    setDestPrice(7999);
    setIsDestModalOpen(true);
  };

  const handleOpenEditDestination = (d: Destination) => {
    setEditingDestId(d.id);
    setDestName(d.name);
    setDestCity(d.city || '');
    setDestState(d.state || '');
    setDestCategory(d.category);
    setDestImage(d.image);
    setDestAbout(d.about);
    setDestBestTime(d.bestTime);
    setDestPrice(d.price);
    setIsDestModalOpen(true);
  };

  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destName || !destImage) {
      showToast('Please provide destination name and image URL', 'error');
      return;
    }

    const destData: Destination = {
      id: editingDestId || Date.now(),
      name: destName,
      location: `${destCity || destName}, ${destState || 'India'}`,
      country: 'India',
      city: destCity || destName,
      state: destState || 'India',
      address: `${destName}, ${destCity || ''}, ${destState || ''}`,
      category: destCategory,
      tags: [destCategory, 'Featured Destination'],
      rating: 4.9,
      reviewsCount: 35,
      price: Number(destPrice),
      duration: '4 Days / 3 Nights',
      days: 4,
      nights: 3,
      image: destImage,
      gallery: [destImage],
      about: destAbout,
      bestTime: destBestTime,
      tripType: 'Solo, Group Expeditions',
      difficulty: 'Moderate',
      groupSize: '1 - 15 People',
      travelType: 'Both',
      itinerary: [
        { day: 1, title: 'Arrival & Check-in', description: 'Settle into accommodation and explore local surroundings.' },
        { day: 2, title: 'Sightseeing & Adventure', description: 'Full day exploring prime attractions.' },
        { day: 3, title: 'Culture & Leisure', description: 'Experience local cuisine and evening sunset.' },
        { day: 4, title: 'Departure', description: 'Check-out with lifelong memories.' }
      ],
      inclusions: ['Stays', 'Breakfast', 'Guide assistance'],
      exclusions: ['Travel to destination', 'Personal shopping'],
      reviews: []
    };

    const updated = await saveDestination(destData);
    setDestinations(updated);
    setIsDestModalOpen(false);
    showToast(editingDestId ? '✅ Location details updated!' : '📍 New destination location added!', 'success');
  };

  // --- GALLERY PHOTO CRUD ---
  const handleSaveGalleryPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryImageUrl || !galleryCaption || !galleryTravelerName || !galleryLocation) {
      showToast('Please fill all gallery fields', 'error');
      return;
    }

    const newPhoto: GalleryPhoto = {
      id: Date.now(),
      imageUrl: galleryImageUrl,
      caption: galleryCaption,
      travelerName: galleryTravelerName,
      travelerAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(galleryTravelerName)}`,
      location: galleryLocation,
      category: galleryCategory,
      tripMode: galleryTripMode,
      date: 'Aug 2026',
      likesCount: 14
    };

    const updated = await saveGalleryPhoto(newPhoto);
    setGalleryPhotos(updated);
    setIsGalleryModalOpen(false);
    setGalleryImageUrl('');
    setGalleryCaption('');
    setGalleryTravelerName('');
    setGalleryLocation('');
    showToast('🎉 Photo added to Traveler Gallery!', 'success');
  };

  const handleDeleteGalleryPhoto = async (id: string | number) => {
    if (window.confirm('Delete this photo from gallery?')) {
      const updated = await deleteGalleryPhoto(id);
      setGalleryPhotos(updated);
      showToast('Photo removed from gallery', 'info');
    }
  };

  // --- BOOKINGS CRUD ---
  const handleStatusChange = async (id: string, status: 'Confirmed' | 'Pending' | 'Completed') => {
    const updated = await updateBookingStatus(id, status);
    setBookings(updated);
    showToast(`Booking ${id} status updated to ${status}`, 'success');
  };

  // --- FILTERED DESTINATIONS ---
  const getFilteredList = (list: Destination[]) => {
    return list.filter((d) => {
      const matchSearch = searchQuery === '' || 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.groupInfo && d.groupInfo.originCity.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d.groupInfo && d.groupInfo.groupName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchOrigin = selectedOriginFilter === 'All' ||
        (d.groupInfo && d.groupInfo.originCity.toLowerCase() === selectedOriginFilter.toLowerCase());

      const matchCat = selectedCategoryFilter === 'All' ||
        d.category.toLowerCase() === selectedCategoryFilter.toLowerCase();

      return matchSearch && matchOrigin && matchCat;
    });
  };

  // =========================================================================
  // 1. ADMIN LOGIN PROTECTION SCREEN (IF NOT AUTHENTICATED)
  // =========================================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-backdrop" />
        
        <div className="admin-login-card animate-scale-up">
          <div className="admin-login-header">
            <img src="/solotrip-logo.png" alt="SoloTrip" className="admin-login-logo-img" />
            <h2 className="admin-login-title">SoloTrip Master Admin</h2>
            <p className="admin-login-subtitle">
              Secure authentication gateway for platform operators and managers.
            </p>
          </div>

          {loginError && (
            <div className="admin-login-error animate-fade-in">
              <Lock size={15} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="admin-login-form">
            <div className="admin-form-group">
              <label className="admin-form-label">Admin Email or ID</label>
              <div className="admin-input-wrap">
                <User size={17} className="admin-input-icon" />
                <input 
                  type="text"
                  placeholder="admin@solotrip.in"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="admin-form-input"
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="admin-form-label">Security Password</label>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="admin-pwd-toggle"
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="admin-input-wrap">
                <KeyRound size={17} className="admin-input-icon" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="admin-form-input"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="admin-login-submit"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <span>Authenticating Console...</span>
              ) : (
                <>
                  <span>Unlock Admin Console</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Helper Credentials Card */}
          <div className="admin-credentials-helper">
            <div className="admin-helper-title">
              <CheckCircle2 size={14} color="#10b981" />
              <span>Master Admin Credentials</span>
            </div>
            <div className="admin-helper-credentials">
              <div><strong>Email:</strong> <code>admin@solotrip.in</code></div>
              <div><strong>Password:</strong> <code>admin@solotrip123</code></div>
            </div>
            <button 
              type="button" 
              className="admin-autofill-btn"
              onClick={handleFillDemoCredentials}
            >
              Auto-Fill Credentials
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <Link to="/" style={{ color: '#94a3b8', fontSize: '0.84rem', textDecoration: 'none', fontWeight: 600 }}>
              ← Return to SoloTrip User Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. AUTHENTICATED ADMIN CONSOLE
  // =========================================================================
  return (
    <div className="admin-layout-root">
      {/* =========================================================================
          ADMIN SIDEBAR NAVIGATION
          ========================================================================= */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <img src="/solotrip-logo.png" alt="SoloTrip Logo" className="admin-brand-logo-img" />
            <div>
              <div className="admin-brand-title">SoloTrip</div>
              <div className="admin-brand-badge">ADMIN CONSOLE</div>
            </div>
          </div>
          <button 
            className="admin-sidebar-close" 
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-sidebar-nav">
          <div className="admin-nav-group-title">MAIN MANAGEMENT</div>
          
          <button 
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard Overview</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'destinations' ? 'active' : ''}`}
            onClick={() => { setActiveTab('destinations'); setSidebarOpen(false); }}
          >
            <MapPin size={18} />
            <span>Destinations & Locations</span>
            <span className="admin-nav-counter">{destinations.length}</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'all-trips' ? 'active' : ''}`}
            onClick={() => { setActiveTab('all-trips'); setSidebarOpen(false); }}
          >
            <Layers size={18} />
            <span>All Trips Catalog</span>
            <span className="admin-nav-counter">{destinations.length}</span>
          </button>

          <div className="admin-nav-group-title">TOUR TYPES</div>

          <button 
            className={`admin-nav-item ${activeTab === 'solo-tours' ? 'active' : ''}`}
            onClick={() => { setActiveTab('solo-tours'); setSidebarOpen(false); }}
          >
            <User size={18} />
            <span>Solo Trips (100% Safe)</span>
            <span className="admin-nav-counter green">{soloTrips.length}</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'group-tours' ? 'active' : ''}`}
            onClick={() => { setActiveTab('group-tours'); setSidebarOpen(false); }}
          >
            <Users size={18} />
            <span>Group Tours & Batches</span>
            <span className="admin-nav-counter blue">{groupTrips.length}</span>
          </button>

          <div className="admin-nav-group-title">MEDIA & COMMUNITY</div>

          <button 
            className={`admin-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => { setActiveTab('gallery'); setSidebarOpen(false); }}
          >
            <ImageIcon size={18} />
            <span>Traveler Gallery</span>
            <span className="admin-nav-counter purple">{galleryPhotos.length}</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('bookings'); setSidebarOpen(false); }}
          >
            <Calendar size={18} />
            <span>Bookings & Orders</span>
            <span className="admin-nav-counter orange">{bookings.length}</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => { setActiveTab('community'); setSidebarOpen(false); }}
          >
            <MessageSquare size={18} />
            <span>Community & Stories</span>
            <span className="admin-nav-counter">{stories.length + discussions.length}</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => { setActiveTab('reviews'); setSidebarOpen(false); }}
          >
            <Star size={18} />
            <span>Reviews & Ratings</span>
          </button>

          <div className="admin-nav-group-title">SYSTEM</div>

          <button 
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
          >
            <Settings size={18} />
            <span>Platform Settings</span>
          </button>
        </div>

        {/* Live Site Link & Logout Footer */}
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-live-site-btn" style={{ marginBottom: 8 }}>
            <ExternalLink size={15} />
            <span>View Live Website</span>
          </Link>
          <button 
            className="admin-live-site-btn" 
            onClick={handleAdminLogout}
            style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#f87171', width: '100%', border: 'none', cursor: 'pointer' }}
          >
            <LogOut size={15} />
            <span>Sign Out of Console</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          MAIN CONTENT AREA
          ========================================================================= */}
      <div className="admin-main-wrapper">
        {/* Top Action Navbar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button 
              className="admin-menu-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="admin-breadcrumb">
              <ShieldCheck size={16} color="#0284c7" />
              <span>Admin Management</span>
              <span className="admin-breadcrumb-sep">/</span>
              <strong style={{ color: '#0f172a', textTransform: 'capitalize' }}>
                {activeTab.replace('-', ' ')}
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="admin-user-badge">
              <ShieldCheck size={14} color="#0284c7" />
              <span>Master Admin</span>
            </div>

            <Link to="/trips" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
              <Eye size={14} /> View Trips
            </Link>
            
            {(activeTab === 'all-trips' || activeTab === 'solo-tours') && (
              <button 
                className="btn btn-primary"
                onClick={() => handleOpenAddTrip(false, activeTab === 'solo-tours')}
                style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              >
                <Plus size={15} /> Add Trip
              </button>
            )}

            {activeTab === 'group-tours' && (
              <button 
                className="btn btn-primary"
                onClick={() => handleOpenAddTrip(true, false)}
                style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              >
                <Plus size={15} /> Add Group Batch
              </button>
            )}

            {activeTab === 'destinations' && (
              <button 
                className="btn btn-primary"
                onClick={handleOpenAddDestination}
                style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              >
                <Plus size={15} /> Add Destination
              </button>
            )}

            {activeTab === 'gallery' && (
              <button 
                className="btn btn-primary"
                onClick={() => setIsGalleryModalOpen(true)}
                style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              >
                <Plus size={15} /> Add Photo
              </button>
            )}

            <button 
              className="btn btn-secondary"
              onClick={handleAdminLogout}
              style={{ padding: '8px 12px', fontSize: '0.82rem', color: '#ef4444', borderColor: '#fecaca' }}
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </header>

        {/* Dynamic Admin Body */}
        <main className="admin-content-body">
          {/* =========================================================================
              TAB: DASHBOARD OVERVIEW
              ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              <div className="admin-page-header">
                <div>
                  <h1 className="admin-page-title">Executive Dashboard</h1>
                  <p className="admin-page-subtitle">Real-time overview of catalog, solo/group itineraries, gallery content, and client reservations.</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary" onClick={() => handleOpenAddTrip(false, false)}>
                    <Plus size={16} /> Create New Tour
                  </button>
                  <button className="btn btn-secondary" onClick={() => setIsGalleryModalOpen(true)}>
                    <ImageIcon size={16} /> Add Photo
                  </button>
                </div>
              </div>

              {/* KPI Strip */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card" onClick={() => setActiveTab('all-trips')} style={{ cursor: 'pointer' }}>
                  <div className="admin-stat-icon blue">
                    <Layers size={22} />
                  </div>
                  <div>
                    <div className="admin-stat-val">{destinations.length}</div>
                    <div className="admin-stat-label">Total Active Itineraries</div>
                    <div style={{ fontSize: '0.75rem', color: '#0284c7', marginTop: 3, fontWeight: 600 }}>
                      {soloTrips.length} Solo • {groupTrips.length} Group Tours
                    </div>
                  </div>
                </div>

                <div className="admin-stat-card" onClick={() => setActiveTab('bookings')} style={{ cursor: 'pointer' }}>
                  <div className="admin-stat-icon emerald">
                    <DollarSign size={22} />
                  </div>
                  <div>
                    <div className="admin-stat-val">₹{totalRevenue.toLocaleString('en-IN')}</div>
                    <div className="admin-stat-label">Total Bookings Volume</div>
                    <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: 3, fontWeight: 600 }}>
                      {confirmedBookingsCount} Confirmed Orders
                    </div>
                  </div>
                </div>

                <div className="admin-stat-card" onClick={() => setActiveTab('gallery')} style={{ cursor: 'pointer' }}>
                  <div className="admin-stat-icon purple">
                    <ImageIcon size={22} />
                  </div>
                  <div>
                    <div className="admin-stat-val">{galleryPhotos.length}</div>
                    <div className="admin-stat-label">Traveler Moments</div>
                    <div style={{ fontSize: '0.75rem', color: '#7c3aed', marginTop: 3, fontWeight: 600 }}>
                      100% Verified Community
                    </div>
                  </div>
                </div>

                <div className="admin-stat-card" onClick={() => setActiveTab('group-tours')} style={{ cursor: 'pointer' }}>
                  <div className="admin-stat-icon orange">
                    <PlaneTakeoff size={22} />
                  </div>
                  <div>
                    <div className="admin-stat-val">{groupTrips.length}</div>
                    <div className="admin-stat-label">Active Group Batches</div>
                    <div style={{ fontSize: '0.75rem', color: '#d97706', marginTop: 3, fontWeight: 600 }}>
                      Delhi, Mumbai, BLR & More
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Bookings Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginTop: 24 }}>
                {/* Recent Bookings Stream */}
                <div className="admin-card-panel">
                  <div className="admin-card-header">
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                        Recent Client Bookings
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0 0' }}>
                        Latest solo & group reservation requests
                      </p>
                    </div>
                    <button className="btn btn-secondary" onClick={() => setActiveTab('bookings')} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      View All ({bookings.length})
                    </button>
                  </div>

                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Client</th>
                          <th>Trip</th>
                          <th>Travel Date</th>
                          <th>Paid</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 4).map((b) => (
                          <tr key={b.id}>
                            <td>
                              <div style={{ fontWeight: 700, color: '#0f172a' }}>{b.userName}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.userEmail}</div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, color: '#0284c7' }}>{b.destinationName}</div>
                            </td>
                            <td>{b.date}</td>
                            <td style={{ fontWeight: 700 }}>₹{b.totalPrice.toLocaleString('en-IN')}</td>
                            <td>
                              <span className={`status-pill ${b.status.toLowerCase()}`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Platform Shortcuts */}
                <div className="admin-card-panel">
                  <div className="admin-card-header">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      ⚡ Quick Management
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 18 }}>
                    <button 
                      className="admin-quick-action-btn"
                      onClick={() => handleOpenAddTrip(true, false)}
                    >
                      <div className="admin-quick-icon blue">
                        <Users size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Schedule Group Tour</div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Add Delhi / Mumbai fixed departure batch</div>
                      </div>
                    </button>

                    <button 
                      className="admin-quick-action-btn"
                      onClick={() => handleOpenAddTrip(false, true)}
                    >
                      <div className="admin-quick-icon emerald">
                        <User size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Publish Solo Package</div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Vetted stays with zero single fee</div>
                      </div>
                    </button>

                    <button 
                      className="admin-quick-action-btn"
                      onClick={handleOpenAddDestination}
                    >
                      <div className="admin-quick-icon purple">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Add Destination Location</div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Register new city or state hub</div>
                      </div>
                    </button>

                    <button 
                      className="admin-quick-action-btn"
                      onClick={() => setIsGalleryModalOpen(true)}
                    >
                      <div className="admin-quick-icon orange">
                        <ImageIcon size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Upload Community Capture</div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Add photo with traveler attribution</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: DESTINATIONS & LOCATIONS
              ========================================================================= */}
          {activeTab === 'destinations' && (
            <div className="animate-fade-in">
              <div className="admin-page-header">
                <div>
                  <h1 className="admin-page-title">Destinations & Location Hubs</h1>
                  <p className="admin-page-subtitle">Manage geographical travel hubs, state regions, seasonal guides, and coordinate markers.</p>
                </div>
                <button className="btn btn-primary" onClick={handleOpenAddDestination}>
                  <Plus size={16} /> Add Destination Hub
                </button>
              </div>

              {/* Grid of Destination Cards */}
              <div className="admin-dest-grid">
                {destinations.map((d) => (
                  <div key={d.id} className="admin-dest-card">
                    <div className="admin-dest-card-img-wrap">
                      <img src={d.image} alt={d.name} className="admin-dest-card-img" />
                      <span className="admin-badge top-right">{d.category}</span>
                      <span className="admin-dest-state-pill">
                        <MapPin size={12} /> {d.state || d.location}
                      </span>
                    </div>

                    <div className="admin-dest-card-body">
                      <h4 className="admin-dest-card-title">{d.name}</h4>
                      <p className="admin-dest-card-desc">{d.about?.slice(0, 100)}...</p>

                      <div className="admin-dest-meta-row">
                        <div className="admin-dest-meta-item">
                          <Clock size={13} color="#0284c7" />
                          <span>Best: {d.bestTime}</span>
                        </div>
                        <div className="admin-dest-meta-item">
                          <DollarSign size={13} color="#059669" />
                          <span>From ₹{d.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="admin-dest-card-actions">
                        <button 
                          className="btn btn-secondary" 
                          style={{ flex: 1, padding: '7px', fontSize: '0.82rem' }}
                          onClick={() => handleOpenEditDestination(d)}
                        >
                          <Edit3 size={13} /> Edit Location
                        </button>
                        <button 
                          className="admin-action-btn delete"
                          onClick={() => handleDeleteTrip(d.id, d.name)}
                          title="Delete Location"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: ALL TRIPS / SOLO TOURS / GROUP TOURS
              ========================================================================= */}
          {(activeTab === 'all-trips' || activeTab === 'solo-tours' || activeTab === 'group-tours') && (
            <div className="animate-fade-in">
              <div className="admin-page-header">
                <div>
                  <h1 className="admin-page-title">
                    {activeTab === 'all-trips' && 'All Travel Itineraries Catalog'}
                    {activeTab === 'solo-tours' && 'Solo Traveler Tours & Vetted Stays'}
                    {activeTab === 'group-tours' && 'Fixed Departure Group Tours'}
                  </h1>
                  <p className="admin-page-subtitle">
                    {activeTab === 'all-trips' && 'Manage all published trips, prices, duration, and departure schedules.'}
                    {activeTab === 'solo-tours' && 'Handcrafted solo itineraries with zero single supplement and verified safety.'}
                    {activeTab === 'group-tours' && 'Fixed departure batches from Delhi, Mumbai, Bangalore, and Chandigarh.'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  {activeTab === 'group-tours' ? (
                    <button className="btn btn-primary" onClick={() => handleOpenAddTrip(true, false)}>
                      <Plus size={16} /> Add Group Tour Batch
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={() => handleOpenAddTrip(false, activeTab === 'solo-tours')}>
                      <Plus size={16} /> Add New Itinerary
                    </button>
                  )}
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="admin-filter-bar">
                <div className="admin-search-input-box">
                  <Search size={16} color="#94a3b8" />
                  <input 
                    type="text"
                    placeholder="Search by trip name, destination, captain, or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                      <X size={14} color="#94a3b8" />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <select 
                    value={selectedCategoryFilter} 
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="admin-select-filter"
                  >
                    <option value="All">All Categories</option>
                    <option value="Mountains">Mountains</option>
                    <option value="Beach">Beach</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Culture">Culture</option>
                    <option value="Wellness">Wellness</option>
                  </select>

                  <select 
                    value={selectedOriginFilter} 
                    onChange={(e) => setSelectedOriginFilter(e.target.value)}
                    className="admin-select-filter"
                  >
                    <option value="All">All Departures</option>
                    <option value="Delhi">From Delhi NCR</option>
                    <option value="Mumbai">From Mumbai</option>
                    <option value="Bangalore">From Bangalore</option>
                    <option value="Chandigarh">From Chandigarh</option>
                    <option value="All-India">All-India Base</option>
                  </select>
                </div>
              </div>

              {/* Trips Table */}
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Trip & Destination</th>
                      <th>Category</th>
                      <th>Price per Person</th>
                      <th>Duration</th>
                      <th>Travel Style / Batch</th>
                      <th>Difficulty</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredList(
                      activeTab === 'solo-tours' 
                        ? soloTrips 
                        : activeTab === 'group-tours' 
                        ? groupTrips 
                        : destinations
                    ).map((dest) => (
                      <tr key={dest.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <img 
                              src={dest.image} 
                              alt={dest.name} 
                              className="admin-table-thumb" 
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.94rem' }}>{dest.name}</div>
                              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{dest.location}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="admin-badge">{dest.category}</span>
                        </td>
                        <td style={{ fontWeight: 800, color: '#0f172a' }}>
                          ₹{dest.price.toLocaleString('en-IN')}
                        </td>
                        <td>
                          <span style={{ fontWeight: 600 }}>{dest.duration}</span>
                        </td>
                        <td>
                          {dest.groupInfo ? (
                            <div>
                              <div style={{ fontWeight: 700, color: '#0284c7', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <PlaneTakeoff size={13} /> {dest.groupInfo.originCity} Batch
                              </div>
                              <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>
                                {dest.groupInfo.bookedSeats}/{dest.groupInfo.totalSeats} Booked • {dest.groupInfo.nextBatchDate}
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#059669', fontSize: '0.8rem', fontWeight: 700 }}>
                              <User size={13} /> 100% Solo Friendly
                            </div>
                          )}
                        </td>
                        <td>
                          <span style={{ fontSize: '0.82rem', color: '#475569' }}>{dest.difficulty}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            <button 
                              className="admin-action-btn edit"
                              onClick={() => handleOpenEditTrip(dest)}
                              title="Edit Trip"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button 
                              className="admin-action-btn delete"
                              onClick={() => handleDeleteTrip(dest.id, dest.name)}
                              title="Delete Trip"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: TRAVELER GALLERY
              ========================================================================= */}
          {activeTab === 'gallery' && (
            <div className="animate-fade-in">
              <div className="admin-page-header">
                <div>
                  <h1 className="admin-page-title">Traveler Photo & Media Gallery</h1>
                  <p className="admin-page-subtitle">Curate and manage verified traveler photos, trip memories, and community uploads.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsGalleryModalOpen(true)}>
                  <Plus size={16} /> Add Traveler Photo
                </button>
              </div>

              <div className="gallery-grid">
                {galleryPhotos.map((photo) => (
                  <div key={photo.id} className="gallery-card" style={{ cursor: 'default' }}>
                    <img src={photo.imageUrl} alt={photo.caption} className="gallery-card-img" />
                    <div className="gallery-card-overlay" />
                    
                    <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6, zIndex: 3 }}>
                      <span className="gallery-tag">{photo.category}</span>
                      <span className="gallery-tag" style={{ background: '#0f172a' }}>
                        {photo.tripMode === 'Group' ? '👥 Group' : '👤 Solo'}
                      </span>
                    </div>

                    <button 
                      className="admin-action-btn delete"
                      style={{ position: 'absolute', top: 10, right: 10, zIndex: 4, background: '#ef4444', color: 'white' }}
                      onClick={() => handleDeleteGalleryPhoto(photo.id)}
                      title="Delete Photo"
                    >
                      <Trash2 size={14} />
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
          )}

          {/* =========================================================================
              TAB: CLIENT BOOKINGS & ORDERS
              ========================================================================= */}
          {activeTab === 'bookings' && (
            <div className="animate-fade-in">
              <div className="admin-page-header">
                <div>
                  <h1 className="admin-page-title">Client Bookings & Reservations</h1>
                  <p className="admin-page-subtitle">Real-time status management for all solo and group reservation orders.</p>
                </div>
              </div>

              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Destination</th>
                      <th>Traveler Details</th>
                      <th>Travel Date</th>
                      <th>Passengers</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id}>
                        <td><strong>{b.id}</strong></td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{b.destinationName}</div>
                          <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Booked: {b.bookedAt}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{b.userName}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.userEmail}</div>
                        </td>
                        <td>{b.date}</td>
                        <td>{b.travelers} Traveler(s)</td>
                        <td style={{ fontWeight: 800, color: '#059669' }}>
                          ₹{b.totalPrice.toLocaleString('en-IN')}
                        </td>
                        <td>
                          <span className={`status-pill ${b.status.toLowerCase()}`}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value as any)}
                            className="admin-status-dropdown"
                          >
                            <option value="Confirmed">Confirmed 🟢</option>
                            <option value="Pending">Pending 🟡</option>
                            <option value="Completed">Completed 🔵</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: COMMUNITY & STORIES
              ========================================================================= */}
          {activeTab === 'community' && (
            <div className="animate-fade-in">
              <div className="admin-page-header">
                <div>
                  <h1 className="admin-page-title">Community & Travel Stories</h1>
                  <p className="admin-page-subtitle">Review and manage solo traveler articles, tips, and discussion threads.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                {stories.map((story) => (
                  <div key={story.id} className="admin-card-panel" style={{ padding: 18 }}>
                    <img 
                      src={story.coverImage} 
                      alt={story.title} 
                      style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} 
                    />
                    <span className="admin-badge">{story.category}</span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '8px 0 6px 0', color: '#0f172a' }}>
                      {story.title}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                      {story.excerpt}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700 }}>
                        By {story.author.name}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {story.date} • {story.readTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: REVIEWS & TESTIMONIALS
              ========================================================================= */}
          {activeTab === 'reviews' && (
            <div className="animate-fade-in">
              <div className="admin-page-header">
                <div>
                  <h1 className="admin-page-title">Verified Reviews & Ratings</h1>
                  <p className="admin-page-subtitle">Review feedback and 5-star ratings left by solo explorers and group tour participants.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                {destinations.slice(0, 6).map((dest) => (
                  <div key={dest.id} className="admin-card-panel" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <img src={dest.image} alt={dest.name} style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>{dest.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700 }}>
                          <Star size={13} fill="#f59e0b" /> {dest.rating} ({dest.reviewsCount} verified reviews)
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#475569', fontStyle: 'italic', background: '#f8fafc', padding: 12, borderRadius: 10 }}>
                      "The solo itinerary was exceptionally well planned. Safe accommodation, zero single fee penalty, and prompt captain support."
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: PLATFORM SETTINGS
              ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <div className="admin-page-header">
                <div>
                  <h1 className="admin-page-title">Platform Configuration</h1>
                  <p className="admin-page-subtitle">Manage platform contact lines, emergency solo assistance, and promotional banners.</p>
                </div>
              </div>

              <div className="admin-card-panel" style={{ maxWidth: 680 }}>
                <form onSubmit={(e) => { e.preventDefault(); showToast('⚙️ Settings saved successfully!', 'success'); }} style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20 }}>
                  <div>
                    <label className="form-label">24/7 Solo Support Helpline</label>
                    <input 
                      type="text" 
                      value={supportPhone} 
                      onChange={(e) => setSupportPhone(e.target.value)} 
                      className="form-input" 
                    />
                  </div>

                  <div>
                    <label className="form-label">Support Email Address</label>
                    <input 
                      type="email" 
                      value={supportEmail} 
                      onChange={(e) => setSupportEmail(e.target.value)} 
                      className="form-input" 
                    />
                  </div>

                  <div>
                    <label className="form-label">Hero Banner Announcement</label>
                    <input 
                      type="text" 
                      value={heroAnnouncement} 
                      onChange={(e) => setHeroAnnouncement(e.target.value)} 
                      className="form-input" 
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
                    <input 
                      type="checkbox" 
                      id="penaltyCheck" 
                      checked={zeroPenaltyBadge} 
                      onChange={(e) => setZeroPenaltyBadge(e.target.checked)} 
                      style={{ width: 18, height: 18 }} 
                    />
                    <label htmlFor="penaltyCheck" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
                      Enforce Zero Single Penalty Guarantee on All Solo Stays
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: 10 }}>
                    Save Platform Settings
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          ADD / EDIT TRIP MODAL
          ========================================================================= */}
      {isTripModalOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setIsTripModalOpen(false)}>
          <div 
            className="modal-container glass-panel animate-scale-up"
            style={{ maxWidth: 740, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase' }}>
                  {editingTripId ? 'Edit Itinerary' : 'Create New Itinerary'}
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                  {editingTripId ? 'Update Tour Package' : 'Publish New Tour Package'}
                </h3>
              </div>
              <button className="modal-close" onClick={() => setIsTripModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTrip} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Tour Style Selector */}
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 14, border: '1px solid #e2e8f0' }}>
                <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>Tour Style</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button 
                    type="button" 
                    className={`btn ${!isGroupTour ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, padding: '10px' }}
                    onClick={() => setIsGroupTour(false)}
                  >
                    <User size={15} /> Solo Expedition
                  </button>
                  <button 
                    type="button" 
                    className={`btn ${isGroupTour ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, padding: '10px' }}
                    onClick={() => setIsGroupTour(true)}
                  >
                    <Users size={15} /> Fixed Group Tour Batch
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="form-label">Trip Title *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Spiti Valley Backpacking Expedition" 
                    value={tripName} 
                    onChange={(e) => setTripName(e.target.value)} 
                    className="form-input" 
                    required 
                  />
                </div>

                <div>
                  <label className="form-label">Category *</label>
                  <select 
                    value={tripCategory} 
                    onChange={(e) => setTripCategory(e.target.value as any)} 
                    className="form-input"
                  >
                    <option value="Mountains">Mountains</option>
                    <option value="Beach">Beach</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Culture">Culture</option>
                    <option value="Wildlife">Wildlife</option>
                    <option value="Wellness">Wellness</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="form-label">City / Destination</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Kaza / Manali" 
                    value={tripCity} 
                    onChange={(e) => setTripCity(e.target.value)} 
                    className="form-input" 
                  />
                </div>

                <div>
                  <label className="form-label">State / Region</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Himachal Pradesh" 
                    value={tripState} 
                    onChange={(e) => setTripState(e.target.value)} 
                    className="form-input" 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <div>
                  <label className="form-label">Price per Person (₹) *</label>
                  <input 
                    type="number" 
                    value={tripPrice} 
                    onChange={(e) => setTripPrice(Number(e.target.value))} 
                    className="form-input" 
                    required 
                  />
                </div>

                <div>
                  <label className="form-label">Duration (Days)</label>
                  <input 
                    type="number" 
                    value={tripDays} 
                    onChange={(e) => setTripDays(Number(e.target.value))} 
                    className="form-input" 
                  />
                </div>

                <div>
                  <label className="form-label">Nights</label>
                  <input 
                    type="number" 
                    value={tripNights} 
                    onChange={(e) => setTripNights(Number(e.target.value))} 
                    className="form-input" 
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Cover Image URL *</label>
                <input 
                  type="url" 
                  placeholder="https://images.unsplash.com/..." 
                  value={tripImage} 
                  onChange={(e) => setTripImage(e.target.value)} 
                  className="form-input" 
                  required 
                />
              </div>

              <div>
                <label className="form-label">About the Trip</label>
                <textarea 
                  placeholder="Trip overview, highlights, and unique experiences..." 
                  value={tripAbout} 
                  onChange={(e) => setTripAbout(e.target.value)} 
                  className="form-input" 
                  rows={3} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="form-label">Best Time to Visit</label>
                  <input 
                    type="text" 
                    value={tripBestTime} 
                    onChange={(e) => setTripBestTime(e.target.value)} 
                    className="form-input" 
                  />
                </div>

                <div>
                  <label className="form-label">Difficulty Level</label>
                  <select 
                    value={tripDifficulty} 
                    onChange={(e) => setTripDifficulty(e.target.value)} 
                    className="form-input"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Easy to Moderate">Easy to Moderate</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                  </select>
                </div>
              </div>

              {/* Group Tour Specific Settings */}
              {isGroupTour && (
                <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 14, padding: 16 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0369a1', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <PlaneTakeoff size={16} /> Group Batch Departure Details
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label className="form-label">Origin / Departure City</label>
                      <select 
                        value={groupOriginCity} 
                        onChange={(e) => setGroupOriginCity(e.target.value)} 
                        className="form-input"
                      >
                        <option value="Delhi">Delhi NCR</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="All-India">All-India Basecamp</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Departure Pickup Point</label>
                      <input 
                        type="text" 
                        value={groupDeparturePoint} 
                        onChange={(e) => setGroupDeparturePoint(e.target.value)} 
                        className="form-input" 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 12 }}>
                    <div>
                      <label className="form-label">Total Seats</label>
                      <input 
                        type="number" 
                        value={groupTotalSeats} 
                        onChange={(e) => setGroupTotalSeats(Number(e.target.value))} 
                        className="form-input" 
                      />
                    </div>

                    <div>
                      <label className="form-label">Booked Seats</label>
                      <input 
                        type="number" 
                        value={groupBookedSeats} 
                        onChange={(e) => setGroupBookedSeats(Number(e.target.value))} 
                        className="form-input" 
                      />
                    </div>

                    <div>
                      <label className="form-label">Next Batch Date</label>
                      <input 
                        type="text" 
                        value={groupNextBatchDate} 
                        onChange={(e) => setGroupNextBatchDate(e.target.value)} 
                        className="form-input" 
                      />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsTripModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingTripId ? 'Save Changes' : 'Publish Tour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADD / EDIT DESTINATION MODAL
          ========================================================================= */}
      {isDestModalOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setIsDestModalOpen(false)}>
          <div 
            className="modal-container glass-panel animate-scale-up"
            style={{ maxWidth: 560, padding: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                {editingDestId ? 'Edit Destination Hub' : 'Add Destination Location'}
              </h3>
              <button className="modal-close" onClick={() => setIsDestModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDestination} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">Destination Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Spiti Valley / South Goa" 
                  value={destName} 
                  onChange={(e) => setDestName(e.target.value)} 
                  className="form-input" 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">State / Region</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Himachal Pradesh" 
                    value={destState} 
                    onChange={(e) => setDestState(e.target.value)} 
                    className="form-input" 
                  />
                </div>

                <div>
                  <label className="form-label">Category</label>
                  <select 
                    value={destCategory} 
                    onChange={(e) => setDestCategory(e.target.value as any)} 
                    className="form-input"
                  >
                    <option value="Mountains">Mountains</option>
                    <option value="Beach">Beach</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Culture">Culture</option>
                    <option value="Wildlife">Wildlife</option>
                    <option value="Wellness">Wellness</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Cover Image URL *</label>
                <input 
                  type="url" 
                  placeholder="https://images.unsplash.com/..." 
                  value={destImage} 
                  onChange={(e) => setDestImage(e.target.value)} 
                  className="form-input" 
                  required 
                />
              </div>

              <div>
                <label className="form-label">Description & Highlights</label>
                <textarea 
                  placeholder="Describe key attractions and vibe of this destination..." 
                  value={destAbout} 
                  onChange={(e) => setDestAbout(e.target.value)} 
                  className="form-input" 
                  rows={3} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">Best Season</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Oct - May" 
                    value={destBestTime} 
                    onChange={(e) => setDestBestTime(e.target.value)} 
                    className="form-input" 
                  />
                </div>

                <div>
                  <label className="form-label">Starting Price (₹)</label>
                  <input 
                    type="number" 
                    value={destPrice} 
                    onChange={(e) => setDestPrice(Number(e.target.value))} 
                    className="form-input" 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsDestModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADD GALLERY PHOTO MODAL
          ========================================================================= */}
      {isGalleryModalOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setIsGalleryModalOpen(false)}>
          <div 
            className="modal-container glass-panel animate-scale-up"
            style={{ maxWidth: 520, padding: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Add Photo to Traveler Gallery</h3>
              <button className="modal-close" onClick={() => setIsGalleryModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveGalleryPhoto} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">Image URL *</label>
                <input 
                  type="url" 
                  placeholder="https://images.unsplash.com/..." 
                  value={galleryImageUrl} 
                  onChange={(e) => setGalleryImageUrl(e.target.value)} 
                  className="form-input" 
                  required 
                />
              </div>

              <div>
                <label className="form-label">Traveler Name / Group *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Aarav Sharma & Delhi Crew" 
                  value={galleryTravelerName} 
                  onChange={(e) => setGalleryTravelerName(e.target.value)} 
                  className="form-input" 
                  required 
                />
              </div>

              <div>
                <label className="form-label">Location / Trip *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Spiti Valley, Manali, Bali..." 
                  value={galleryLocation} 
                  onChange={(e) => setGalleryLocation(e.target.value)} 
                  className="form-input" 
                  required 
                />
              </div>

              <div>
                <label className="form-label">Caption / Memory *</label>
                <textarea 
                  placeholder="Caption for this photo..." 
                  value={galleryCaption} 
                  onChange={(e) => setGalleryCaption(e.target.value)} 
                  className="form-input" 
                  rows={2} 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">Category</label>
                  <select 
                    value={galleryCategory} 
                    onChange={(e) => setGalleryCategory(e.target.value as any)} 
                    className="form-input"
                  >
                    <option value="Mountains">Mountains</option>
                    <option value="Beach">Beach</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Culture">Culture</option>
                    <option value="Group Fun">Group Fun</option>
                    <option value="Solo Moments">Solo Moments</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Trip Style</label>
                  <select 
                    value={galleryTripMode} 
                    onChange={(e) => setGalleryTripMode(e.target.value as any)} 
                    className="form-input"
                  >
                    <option value="Solo">Solo Traveler</option>
                    <option value="Group">Group Batch</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsGalleryModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
