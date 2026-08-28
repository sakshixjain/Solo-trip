import React, { useState, useEffect } from 'react';
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
  BookOpen,
  MessageSquare
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

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trips' | 'gallery' | 'bookings' | 'community'>('trips');
  
  // Data States
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [discussions, setDiscussions] = useState<Discussion[]>(INITIAL_DISCUSSIONS);
  
  // Search / Filter States
  const [tripSearch, setTripSearch] = useState('');
  const [selectedOriginFilter, setSelectedOriginFilter] = useState('All');

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
  
  // Group Tour Specific Fields
  const [isGroupTour, setIsGroupTour] = useState(true);
  const [groupOriginCity, setGroupOriginCity] = useState('Delhi');
  const [groupDeparturePoint, setGroupDeparturePoint] = useState('Majnu Ka Tilla / Kashmiri Gate Metro');
  const [groupName, setGroupName] = useState('');
  const [groupType, setGroupType] = useState('Young Professionals & Solo Backpackers (20-35 yrs)');
  const [groupTotalSeats, setGroupTotalSeats] = useState<number>(14);
  const [groupBookedSeats, setGroupBookedSeats] = useState<number>(8);
  const [groupNextBatchDate, setGroupNextBatchDate] = useState('Every Friday (12 Sep)');
  const [groupTripCaptain, setGroupTripCaptain] = useState('Capt. Vikram (Certified Trek Leader)');

  // Gallery Modal State
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryImageUrl, setGalleryImageUrl] = useState('');
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryTravelerName, setGalleryTravelerName] = useState('');
  const [galleryLocation, setGalleryLocation] = useState('');
  const [galleryCategory, setGalleryCategory] = useState<GalleryPhoto['category']>('Mountains');
  const [galleryTripMode, setGalleryTripMode] = useState<'Solo' | 'Group'>('Solo');

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
    loadData();
  }, []);

  // Open Trip Modal for Add or Edit
  const handleOpenAddTrip = () => {
    setEditingTripId(null);
    setTripName('');
    setTripCity('');
    setTripState('');
    setTripCategory('Mountains');
    setTripPrice(6999);
    setTripDays(4);
    setTripNights(3);
    setTripImage('https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80');
    setTripAbout('A scenic getaway perfect for solo explorers and group batches.');
    setTripBestTime('Mar - Jun, Sep - Nov');
    setTripDifficulty('Easy to Moderate');
    
    setIsGroupTour(true);
    setGroupOriginCity('Delhi');
    setGroupDeparturePoint('Majnu Ka Tilla / Kashmiri Gate Metro, Delhi');
    setGroupName('Delhi Weekend Backpackers Batch');
    setGroupType('Young Professionals & Solo Backpackers (20-35 yrs)');
    setGroupTotalSeats(14);
    setGroupBookedSeats(6);
    setGroupNextBatchDate('Every Friday');
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
      reviewsCount: 24,
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
        groupName: groupName || `${groupOriginCity} Backpackers Group`,
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
        { day: 3, title: 'Trek / Outdoor Adventure', description: 'Scenic group trek with photos and evening celebration.' },
        { day: 4, title: 'Souvenirs & Departure', description: 'Farewell breakfast and return transit.' }
      ],
      inclusions: ['Accommodation in solo/group friendly stays', 'Daily breakfast & dinner', 'Certified trip leader', 'Local sightseeing transfers'],
      exclusions: ['Personal expenses', 'Optional adventure tickets'],
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
      showToast('🗑️ Trip deleted.', 'info');
    }
  };

  // Gallery Photo CRUD
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
      likesCount: 12
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

  // Booking status update
  const handleStatusChange = async (id: string, status: 'Confirmed' | 'Pending' | 'Completed') => {
    const updated = await updateBookingStatus(id, status);
    setBookings(updated);
    showToast(`Booking ${id} status changed to ${status}`, 'success');
  };

  // Filtered destinations
  const filteredDestinations = destinations.filter((d) => {
    const searchMatch = tripSearch === '' || 
      d.name.toLowerCase().includes(tripSearch.toLowerCase()) || 
      (d.groupInfo && d.groupInfo.originCity.toLowerCase().includes(tripSearch.toLowerCase())) ||
      (d.groupInfo && d.groupInfo.groupName.toLowerCase().includes(tripSearch.toLowerCase()));
    
    const originMatch = selectedOriginFilter === 'All' || 
      (d.groupInfo && d.groupInfo.originCity.toLowerCase() === selectedOriginFilter.toLowerCase());

    return searchMatch && originMatch;
  });

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
      {/* Admin Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#0284c7', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            <ShieldCheck size={16} /> Admin Management Console
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Dynamic Website Control Panel
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: 4 }}>
            Add, update, or remove trips, group batches, departure cities, client bookings, and traveler photos in real-time.
          </p>
        </div>

        {activeTab === 'trips' && (
          <button 
            className="btn btn-primary"
            onClick={handleOpenAddTrip}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <Plus size={16} /> Add New Trip / Group Tour
          </button>
        )}

        {activeTab === 'gallery' && (
          <button 
            className="btn btn-primary"
            onClick={() => setIsGalleryModalOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <Plus size={16} /> Add Traveler Photo
          </button>
        )}
      </div>

      {/* KPI Stats Strip */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon blue">
            <Layers size={22} />
          </div>
          <div>
            <div className="admin-stat-val">{destinations.length}</div>
            <div className="admin-stat-label">Total Active Trips</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon emerald">
            <Users size={22} />
          </div>
          <div>
            <div className="admin-stat-val">
              {destinations.filter((d) => d.groupInfo).length}
            </div>
            <div className="admin-stat-label">Group Tour Batches</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon purple">
            <ImageIcon size={22} />
          </div>
          <div>
            <div className="admin-stat-val">{galleryPhotos.length}</div>
            <div className="admin-stat-label">Gallery Photos</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon orange">
            <Calendar size={22} />
          </div>
          <div>
            <div className="admin-stat-val">{bookings.length}</div>
            <div className="admin-stat-label">Client Bookings</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs-bar">
        <button 
          className={`admin-tab-btn ${activeTab === 'trips' ? 'active' : ''}`}
          onClick={() => setActiveTab('trips')}
        >
          <Layers size={16} /> Trips & Group Tours ({destinations.length})
        </button>

        <button 
          className={`admin-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          <ImageIcon size={16} /> Traveler Gallery ({galleryPhotos.length})
        </button>

        <button 
          className={`admin-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <Calendar size={16} /> Client Bookings ({bookings.length})
        </button>

        <button 
          className={`admin-tab-btn ${activeTab === 'community' ? 'active' : ''}`}
          onClick={() => setActiveTab('community')}
        >
          <MessageSquare size={16} /> Community & Stories ({stories.length + discussions.length})
        </button>
      </div>

      {/* TAB 1: TRIPS & GROUP TOURS */}
      {activeTab === 'trips' && (
        <div>
          {/* Filter / Search Bar */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20, background: '#ffffff', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 220 }}>
              <Search size={16} color="#94a3b8" />
              <input 
                type="text"
                placeholder="Search trips by destination name or departure city..."
                value={tripSearch}
                onChange={(e) => setTripSearch(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.92rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Filter Departure:</span>
              <select 
                value={selectedOriginFilter}
                onChange={(e) => setSelectedOriginFilter(e.target.value)}
                className="sort-select"
              >
                <option value="All">All Origins</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="All-India">All-India</option>
              </select>
            </div>
          </div>

          {/* Trips Table */}
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Destination</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Group Tour Departure</th>
                  <th>Batch / Seats</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDestinations.map((dest) => (
                  <tr key={dest.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img 
                          src={dest.image} 
                          alt={dest.name} 
                          style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} 
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{dest.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{dest.location}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge">{dest.category}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>
                      ₹{dest.price.toLocaleString('en-IN')}
                    </td>
                    <td>{dest.duration}</td>
                    <td>
                      {dest.groupInfo ? (
                        <div>
                          <div style={{ fontWeight: 700, color: '#0284c7', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <MapPin size={12} /> From {dest.groupInfo.originCity}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                            {dest.groupInfo.groupName}
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Solo Self-Travel</span>
                      )}
                    </td>
                    <td>
                      {dest.groupInfo ? (
                        <div>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>
                            {dest.groupInfo.bookedSeats}/{dest.groupInfo.totalSeats} booked
                          </span>
                          <div style={{ fontSize: '0.74rem', color: '#059669' }}>
                            {dest.groupInfo.nextBatchDate}
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>N/A</span>
                      )}
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

      {/* TAB 2: TRAVELER GALLERY */}
      {activeTab === 'gallery' && (
        <div>
          <div className="gallery-grid animate-fade-in">
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

      {/* TAB 3: CLIENT BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Trip Destination</th>
                <th>Client Name / Email</th>
                <th>Travel Date</th>
                <th>Travelers</th>
                <th>Total Paid</th>
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
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Booked on: {b.bookedAt}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.userName}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.userEmail}</div>
                  </td>
                  <td>{b.date}</td>
                  <td>{b.travelers} Traveler(s)</td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>₹{b.totalPrice.toLocaleString('en-IN')}</td>
                  <td>
                    <span 
                      className="admin-badge" 
                      style={{ 
                        background: b.status === 'Confirmed' ? '#dcfce7' : b.status === 'Pending' ? '#fef3c7' : '#f1f5f9',
                        color: b.status === 'Confirmed' ? '#15803d' : b.status === 'Pending' ? '#b45309' : '#475569'
                      }}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value as any)}
                      className="sort-select"
                      style={{ fontSize: '0.82rem', padding: '4px 8px' }}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: COMMUNITY & STORIES */}
      {activeTab === 'community' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Stories Management Card */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', padding: 20, border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={18} color="#0284c7" /> Published Stories ({stories.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stories.map((story) => (
                <div key={story.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>{story.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>By {story.author.name} • {story.category}</div>
                  </div>
                  <button 
                    className="admin-action-btn delete"
                    onClick={() => {
                      setStories((prev) => prev.filter((s) => s.id !== story.id));
                      showToast('Story removed', 'info');
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Discussions Moderation Card */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', padding: 20, border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MessageSquare size={18} color="#7c3aed" /> Community Threads ({discussions.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {discussions.map((disc) => (
                <div key={disc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>{disc.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>By {disc.author.name} • {disc.repliesCount} replies</div>
                  </div>
                  <button 
                    className="admin-action-btn delete"
                    onClick={() => {
                      setDiscussions((prev) => prev.filter((d) => d.id !== disc.id));
                      showToast('Thread removed', 'info');
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TRIP CREATE / EDIT MODAL */}
      {isTripModalOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setIsTripModalOpen(false)}>
          <div 
            className="modal-container glass-panel animate-scale-up"
            style={{ maxWidth: 680, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                {editingTripId ? 'Edit Trip / Group Tour' : 'Add New Trip / Group Tour'}
              </h3>
              <button className="modal-close" onClick={() => setIsTripModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTrip} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Basic Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">Trip Title / Destination Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Manali Himalayan Expedition" 
                    value={tripName} 
                    onChange={(e) => setTripName(e.target.value)} 
                    className="form-input" 
                    required 
                  />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select 
                    value={tripCategory} 
                    onChange={(e) => setTripCategory(e.target.value as any)} 
                    className="form-input"
                  >
                    <option value="Mountains">Mountains</option>
                    <option value="Beach">Beach</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Culture">Culture</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Wildlife">Wildlife</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
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
                  <label className="form-label">Days</label>
                  <input 
                    type="number" 
                    value={tripDays} 
                    onChange={(e) => setTripDays(Number(e.target.value))} 
                    className="form-input" 
                    required 
                  />
                </div>
                <div>
                  <label className="form-label">Nights</label>
                  <input 
                    type="number" 
                    value={tripNights} 
                    onChange={(e) => setTripNights(Number(e.target.value))} 
                    className="form-input" 
                    required 
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">City / Hub</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Manali, Kaza, Goa..." 
                    value={tripCity} 
                    onChange={(e) => setTripCity(e.target.value)} 
                    className="form-input" 
                  />
                </div>
                <div>
                  <label className="form-label">State / Region</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Himachal Pradesh, Goa..." 
                    value={tripState} 
                    onChange={(e) => setTripState(e.target.value)} 
                    className="form-input" 
                  />
                </div>
              </div>

              <div>
                <label className="form-label">About the Trip</label>
                <textarea 
                  value={tripAbout} 
                  onChange={(e) => setTripAbout(e.target.value)} 
                  className="form-input" 
                  rows={2} 
                />
              </div>

              {/* Group Tour Section */}
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Users size={18} color="#0284c7" />
                    <strong>Group Tour & Departure Settings</strong>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={isGroupTour} 
                      onChange={(e) => setIsGroupTour(e.target.checked)} 
                    />
                    <span>Enable Group Tour Batch</span>
                  </label>
                </div>

                {isGroupTour && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                      <div>
                        <label className="form-label">Departure Origin City</label>
                        <select 
                          value={groupOriginCity} 
                          onChange={(e) => setGroupOriginCity(e.target.value)} 
                          className="form-input"
                        >
                          <option value="Delhi">Delhi</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Bangalore">Bangalore</option>
                          <option value="Chandigarh">Chandigarh</option>
                          <option value="All-India">All-India</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Pickup & Meeting Point</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Majnu Ka Tilla / Kashmiri Gate Metro" 
                          value={groupDeparturePoint} 
                          onChange={(e) => setGroupDeparturePoint(e.target.value)} 
                          className="form-input" 
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label className="form-label">Group Name / Batch Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Delhi Weekend Trekkers Batch" 
                          value={groupName} 
                          onChange={(e) => setGroupName(e.target.value)} 
                          className="form-input" 
                        />
                      </div>
                      <div>
                        <label className="form-label">Trip Captain / Guide</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Capt. Vikram (Trek Leader)" 
                          value={groupTripCaptain} 
                          onChange={(e) => setGroupTripCaptain(e.target.value)} 
                          className="form-input" 
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 12 }}>
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
                          placeholder="e.g. Every Friday (12 Sep)" 
                          value={groupNextBatchDate} 
                          onChange={(e) => setGroupNextBatchDate(e.target.value)} 
                          className="form-input" 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsTripModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingTripId ? 'Update Trip' : 'Publish Trip to Website'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY PHOTO ADD MODAL */}
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
