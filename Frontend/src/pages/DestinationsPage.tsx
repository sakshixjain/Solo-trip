import { useState, useEffect, useMemo } from 'react';
import { Search, LayoutGrid, Map as MapIcon, MapPin, Compass, Crosshair, ChevronDown } from 'lucide-react';
import { DestinationCard } from '../components/DestinationCard';
import { GoogleMapView } from '../components/GoogleMapView';
import type { Destination } from '../services/api';
import { fetchDestinations, INITIAL_DESTINATIONS } from '../services/api';
import { 
  calculateDistanceKm, 
  getCurrentUserLocation, 
  POPULAR_ORIGIN_CITIES, 
  type GeoPoint 
} from '../utils/geoUtils';

export const DestinationsPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [activeSelectedDest, setActiveSelectedDest] = useState<Destination | null>(null);

  // User Location & Distance Sorting State
  const [userLocation, setUserLocation] = useState<GeoPoint | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [sortByNearest, setSortByNearest] = useState<boolean>(false);
  const [cityPickerOpen, setCityPickerOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchDestinations().then((data) => {
      if (data && data.length > 0) setDestinations(data);
    });
  }, []);

  const handleLocateMe = async () => {
    setIsLocating(true);
    try {
      const loc = await getCurrentUserLocation();
      setUserLocation(loc);
      setSortByNearest(true);
    } catch (err: any) {
      alert(err.message || 'Could not fetch your location.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSelectCity = (city: GeoPoint) => {
    setUserLocation(city);
    setSortByNearest(true);
    setCityPickerOpen(false);
  };

  const tags = ['All', 'Mountains', 'Beach', 'Culture', 'Adventure', 'Nature', 'Wellness'];

  const filtered = useMemo(() => {
    let result = destinations.filter((dest) => {
      const tagMatch = selectedTag === 'All' || dest.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
      const searchMatch = search === '' || dest.name.toLowerCase().includes(search.toLowerCase()) || dest.location.toLowerCase().includes(search.toLowerCase());
      return tagMatch && searchMatch;
    });

    if (sortByNearest && userLocation) {
      result = [...result].sort((a, b) => {
        const distA = (a.latitude != null && a.longitude != null)
          ? calculateDistanceKm(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude)
          : 99999;
        const distB = (b.latitude != null && b.longitude != null)
          ? calculateDistanceKm(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude)
          : 99999;
        return distA - distB;
      });
    }

    return result;
  }, [destinations, selectedTag, search, sortByNearest, userLocation]);

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      {/* Header with Title & View Mode Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
            Popular Destinations
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
            Discover iconic towns, tranquil beaches, and Himalayan getaways curated for solo travelers.
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

      {/* Filter, Search & Location Sort Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
        <div className="filter-pills">
          {tags.map((tag) => (
            <button
              key={tag}
              className={`filter-pill ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Location & GPS Sorting Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            className={`btn btn-sm ${sortByNearest ? 'btn-primary' : 'btn-outline'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', padding: '7px 14px' }}
            title="Sort destinations by distance from your live GPS location"
          >
            <Crosshair size={14} className={isLocating ? 'animate-spin-slow' : ''} />
            <span>{isLocating ? 'Detecting...' : userLocation ? `📍 Near ${userLocation.name}` : '📍 Nearest to Me'}</span>
          </button>

          {/* Quick Origin City Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setCityPickerOpen(!cityPickerOpen)}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.82rem', padding: '7px 12px' }}
            >
              <span>{userLocation?.name || 'Set City'}</span>
              <ChevronDown size={12} />
            </button>

            {cityPickerOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 6, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', minWidth: 180, maxHeight: 220, overflowY: 'auto', zIndex: 30 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', padding: '4px 8px', textTransform: 'uppercase' }}>Select Origin City</div>
                {POPULAR_ORIGIN_CITIES.map((city) => (
                  <button
                    key={city.name}
                    type="button"
                    onClick={() => handleSelectCity(city)}
                    style={{ width: '100%', textAlign: 'left', padding: '6px 10px', fontSize: '0.82rem', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 6, color: '#1e293b' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    📍 {city.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', padding: '7px 14px', borderRadius: 999, border: '1px solid #e2e8f0', minWidth: 220 }}>
            <Search size={15} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem' }}
            />
          </div>
        </div>
      </div>

      {/* Conditional Rendering: Grid or Interactive Google Map */}
      {viewMode === 'grid' ? (
        <div className="destinations-grid animate-fade-in">
          {filtered.map((dest) => (
            <DestinationCard 
              key={dest.id} 
              destination={dest} 
              userLocation={userLocation}
            />
          ))}
        </div>
      ) : (
        <div className="destinations-map-layout animate-fade-in">
          <div className="map-view-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Compass size={18} color="#0284c7" />
              <span style={{ fontWeight: 700, color: '#0f172a' }}>
                Showing {filtered.length} solo destinations on Google Maps
              </span>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {userLocation ? `Live route lines and durations calculated from ${userLocation.name}` : 'Click any pin to inspect the trip details and calculate live travel duration'}
            </span>
          </div>

          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 6px 24px rgba(0,0,0,0.06)' }}>
            <GoogleMapView
              destinations={filtered}
              initialUserLocation={userLocation || undefined}
              height="540px"
              showControls={true}
              onSelectDestination={(dest) => setActiveSelectedDest(dest)}
            />
          </div>

          {/* Quick Selection Strip under map */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 14, color: '#0f172a' }}>
              Destinations in this filter ({filtered.length})
            </h3>
            <div className="destinations-horizontal-scroll">
              {filtered.map((dest) => (
                <div 
                  key={dest.id} 
                  className={`dest-scroll-card ${activeSelectedDest?.id === dest.id ? 'active' : ''}`}
                  onClick={() => setActiveSelectedDest(dest)}
                >
                  <img src={dest.image} alt={dest.name} className="dest-scroll-img" />
                  <div className="dest-scroll-info">
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {dest.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} color="#0284c7" />
                      {dest.location}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0284c7' }}>
                        ₹{dest.price.toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700 }}>
                        ★ {dest.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
