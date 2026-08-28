import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, LayoutGrid, Map as MapIcon, Users, User, MapPin } from 'lucide-react';
import { TripCard } from '../components/TripCard';
import { GoogleMapView } from '../components/GoogleMapView';
import type { Destination } from '../services/api';
import { fetchDestinations, INITIAL_DESTINATIONS } from '../services/api';

export const TripsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('type') || 'All';
  const initialStyle = searchParams.get('style') || 'All';
  const initialOrigin = searchParams.get('origin') || '';

  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [travelStyle, setTravelStyle] = useState<string>(initialStyle); // 'All' | 'Solo' | 'Group'
  const [selectedOrigin, setSelectedOrigin] = useState<string>(initialOrigin);
  const [searchTerm, setSearchTerm] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [priceMax, setPriceMax] = useState<number>(50000);
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  useEffect(() => {
    fetchDestinations().then((data) => {
      if (data && data.length > 0) setDestinations(data);
    });
  }, []);

  const categories = ['All', 'Adventure', 'Beach', 'Mountains', 'Culture', 'Wellness'];

  const filteredTrips = destinations.filter((trip) => {
    // Travel style match (Solo vs Group)
    if (travelStyle === 'Group' && !trip.groupInfo) return false;

    // Origin city match
    if (selectedOrigin && selectedOrigin !== '') {
      if (!trip.groupInfo || !trip.groupInfo.originCity.toLowerCase().includes(selectedOrigin.toLowerCase())) {
        return false;
      }
    }

    // Category match
    const categoryMatches =
      selectedCategory === 'All' ||
      trip.category.toLowerCase() === selectedCategory.toLowerCase() ||
      trip.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase());

    // Search text match
    const searchMatches =
      searchTerm === '' ||
      trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trip.groupInfo && trip.groupInfo.originCity.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (trip.groupInfo && trip.groupInfo.groupName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      trip.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    // Price match
    const priceMatches = trip.price <= priceMax;

    return categoryMatches && searchMatches && priceMatches;
  });

  // Sorting
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'duration') return b.days - a.days;
    return 0; // recommended
  });

  const displayedTrips = sortedTrips.slice(0, visibleCount);

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 80 }}>
      {/* Page Title Header with View Mode Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
            Explore Trips & Group Tours
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.98rem' }}>
            Choose between independent solo travel or join curated group batches departing from key cities.
          </p>
        </div>

        {/* View Toggle: Grid vs Map */}
        <div className="view-mode-toggle">
          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <LayoutGrid size={15} />
            <span>Grid</span>
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
            title="Interactive Google Map View"
          >
            <MapIcon size={15} />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* Travel Style Tabs: All | Solo | Group */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          className={`filter-pill ${travelStyle === 'All' ? 'active' : ''}`}
          onClick={() => setTravelStyle('All')}
        >
          All Adventures ({destinations.length})
        </button>
        <button
          className={`filter-pill ${travelStyle === 'Solo' ? 'active' : ''}`}
          onClick={() => setTravelStyle('Solo')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <User size={14} /> Solo Expeditions
        </button>
        <button
          className={`filter-pill ${travelStyle === 'Group' ? 'active' : ''}`}
          onClick={() => setTravelStyle('Group')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <Users size={14} /> Group Tours (With Departure Cities)
        </button>
      </div>

      {/* Filter and Search Controls Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Category Filter Pills */}
          <div className="filter-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Group Origin City & Sort Selects */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {/* Departure Origin Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={13} /> Group From:
              </span>
              <select
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="sort-select"
              >
                <option value="">All Departure Cities</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="All-India">All-India Pickup</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="duration">Trip Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Search & Budget Filter Row */}
        <div 
          style={{ 
            display: 'flex', 
            gap: 16, 
            background: '#ffffff', 
            padding: 14, 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-light)',
            flexWrap: 'wrap',
            alignItems: 'center' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 240 }}>
            <Search size={17} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search by city, group name (e.g. Delhi, Spiti, Rafting)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.92rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 220 }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#64748b' }}>
              Max Budget: ₹{priceMax.toLocaleString('en-IN')}
            </span>
            <input
              type="range"
              min={5000}
              max={50000}
              step={2000}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              style={{ cursor: 'pointer', accentColor: '#0f172a' }}
            />
          </div>
        </div>
      </div>

      {/* Trips Content (Grid or Google Map) */}
      {viewMode === 'grid' ? (
        displayedTrips.length === 0 ? (
          <div 
            style={{ 
              textAlign: 'center', 
              padding: '50px 20px', 
              background: '#ffffff', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-light)' 
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>No trips match your filters</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 18 }}>
              Try switching travel style, departure city, or clearing the search term.
            </p>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => {
                setSelectedCategory('All');
                setTravelStyle('All');
                setSelectedOrigin('');
                setSearchTerm('');
                setPriceMax(50000);
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="trips-grid animate-fade-in">
              {displayedTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < sortedTrips.length && (
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <button
                  className="btn btn-primary"
                  style={{ padding: '10px 28px' }}
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                >
                  Load More Trips ({sortedTrips.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )
      ) : (
        <div className="destinations-map-layout animate-fade-in">
          <div className="map-view-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>
                Showing {sortedTrips.length} curated trips on Google Maps
              </span>
            </div>
            <span style={{ fontSize: '0.84rem', color: '#64748b' }}>
              Click any location marker to view trip duration, pricing, and group details
            </span>
          </div>

          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <GoogleMapView
              destinations={sortedTrips}
              height="540px"
              showControls={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};
