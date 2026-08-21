import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, LayoutGrid, Map as MapIcon } from 'lucide-react';
import { TripCard } from '../components/TripCard';
import { GoogleMapView } from '../components/GoogleMapView';
import type { Destination } from '../services/api';
import { fetchDestinations, INITIAL_DESTINATIONS } from '../services/api';

export const TripsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('type') || 'All';

  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
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

  const categories = ['All', 'Adventure', 'Beach', 'Mountains', 'Culture', 'Wildlife'];

  const filteredTrips = destinations.filter((trip) => {
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
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      {/* Page Title Header with View Mode Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
            Browse Trips
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
            Handpicked trips designed specifically for solo travelers
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
            <LayoutGrid size={16} />
            <span>Grid</span>
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
            title="Interactive Google Map View"
          >
            <MapIcon size={16} />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 36 }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
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

          {/* Sort By Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>Sort by:</span>
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

        {/* Quick Search & Budget Filter Row */}
        <div 
          style={{ 
            display: 'flex', 
            gap: 16, 
            background: '#ffffff', 
            padding: 16, 
            borderRadius: 16, 
            border: '1px solid #e2e8f0',
            flexWrap: 'wrap',
            alignItems: 'center' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 240 }}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search by city, activity (e.g. Paragliding, Temples, Beach)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 220 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
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
              padding: '60px 20px', 
              background: '#ffffff', 
              borderRadius: 16, 
              border: '1px solid #e2e8f0' 
            }}
          >
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>No trips match your filters</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: 20 }}>
              Try adjusting your search keyword, category, or maximum budget slider.
            </p>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
                setPriceMax(50000);
              }}
            >
              Reset Filters
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
              <div style={{ textAlign: 'center', marginTop: 48 }}>
                <button
                  className="btn btn-primary"
                  style={{ padding: '12px 32px' }}
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
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Click any location marker to view trip duration, pricing, and book your spot
            </span>
          </div>

          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 6px 24px rgba(0,0,0,0.06)' }}>
            <GoogleMapView
              destinations={sortedTrips}
              height="560px"
              showControls={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};
