import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF, DirectionsRenderer } from '@react-google-maps/api';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Layers, 
  ExternalLink, 
  Copy, 
  Check, 
  Star, 
  Maximize2,
  Car,
  Train,
  Footprints,
  Plane,
  Crosshair,
  Route,
  ChevronDown
} from 'lucide-react';
import { GOOGLE_MAPS_API_KEY, type Destination } from '../services/api';
import { Link } from 'react-router-dom';
import { 
  getTravelEstimates, 
  getCurrentUserLocation, 
  POPULAR_ORIGIN_CITIES, 
  getDirectionsUrl,
  type GeoPoint,
  type TravelEstimate
} from '../utils/geoUtils';

const libraries: ('places' | 'geometry')[] = ['places', 'geometry'];

// Custom styling to give Google Maps a clean, premium modern look
const mapStyles = [
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'simplified' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{ color: '#cde4f7' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ lightness: 20 }]
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{ color: '#f1f5f9' }]
  }
];

export interface GoogleMapViewProps {
  destination?: Destination;
  destinations?: Destination[];
  initialUserLocation?: GeoPoint;
  height?: string | number;
  zoom?: number;
  showControls?: boolean;
  showRouteEstimates?: boolean;
  className?: string;
  onSelectDestination?: (dest: Destination) => void;
  onDurationCalculated?: (estimates: Record<'DRIVING' | 'TRANSIT' | 'WALKING' | 'FLYING', TravelEstimate>) => void;
}

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  destination,
  destinations,
  initialUserLocation,
  height = '460px',
  zoom = 12,
  showControls = true,
  showRouteEstimates = true,
  className = '',
  onSelectDestination,
  onDurationCalculated
}) => {
  const apiKey = GOOGLE_MAPS_API_KEY;

  const [authError, setAuthError] = useState(false);

  // Catch Google Maps authorization errors (RefererNotAllowedMapError, ApiNotActivatedMapError, etc.)
  useEffect(() => {
    const previousAuthFailure = (window as any).gm_authFailure;
    (window as any).gm_authFailure = () => {
      console.warn("Google Maps Auth Error detected (e.g. RefererNotAllowedMapError). Switching to fallback map view.");
      setAuthError(true);
      if (typeof previousAuthFailure === 'function') {
        try {
          previousAuthFailure();
        } catch {
          // ignore
        }
      }
    };
    return () => {
      (window as any).gm_authFailure = previousAuthFailure;
    };
  }, []);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries
  });

  const [map, setMap] = useState<any>(null);
  const [mapTypeId, setMapTypeId] = useState<string>('roadmap');
  const [selectedPin, setSelectedPin] = useState<Destination | null>(destination || null);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // User Location State
  const [userLocation, setUserLocation] = useState<GeoPoint | null>(initialUserLocation || null);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedCityPickerOpen, setSelectedCityPickerOpen] = useState(false);
  const [showUserPinInfo, setShowUserPinInfo] = useState(false);

  // Route & Travel Mode State
  const [travelMode, setTravelMode] = useState<'DRIVING' | 'TRANSIT' | 'WALKING' | 'FLYING'>('DRIVING');
  const [directionsResult, setDirectionsResult] = useState<any>(null);

  // Compute active coordinates
  const activeDestinations = useMemo(() => {
    if (destinations && destinations.length > 0) {
      return destinations.filter((d) => d.latitude != null && d.longitude != null);
    }
    if (destination && destination.latitude != null && destination.longitude != null) {
      return [destination];
    }
    return [];
  }, [destinations, destination]);

  const primaryDest = selectedPin || destination || activeDestinations[0];

  // Calculate Duration and Distance Estimates
  const travelEstimates = useMemo(() => {
    if (!userLocation || !primaryDest || primaryDest.latitude == null || primaryDest.longitude == null) {
      return null;
    }
    const estimates = getTravelEstimates(
      userLocation.latitude,
      userLocation.longitude,
      primaryDest.latitude,
      primaryDest.longitude
    );
    if (onDurationCalculated) {
      onDurationCalculated(estimates);
    }
    return estimates;
  }, [userLocation, primaryDest, onDurationCalculated]);

  const activeEstimate = travelEstimates ? travelEstimates[travelMode] : null;

  // Handler to request User's Current Location via GPS
  const handleDetectLocation = async () => {
    setIsLocating(true);
    try {
      const loc = await getCurrentUserLocation();
      setUserLocation(loc);
      if (map) {
        map.panTo({ lat: loc.latitude, lng: loc.longitude });
        map.setZoom(10);
      }
    } catch {
      // Fallback
    } finally {
      setIsLocating(false);
    }
  };

  // Set Manual Origin City
  const handleSelectCity = (city: GeoPoint) => {
    setUserLocation(city);
    setSelectedCityPickerOpen(false);
    if (map) {
      map.panTo({ lat: city.latitude, lng: city.longitude });
    }
  };

  // Google Maps DirectionsService Request
  useEffect(() => {
    if (!isLoaded || !map || !userLocation || !primaryDest || primaryDest.latitude == null || primaryDest.longitude == null) {
      setDirectionsResult(null);
      return;
    }

    if (!window.google?.maps?.DirectionsService) return;

    if (travelMode === 'FLYING') {
      setDirectionsResult(null);
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    const googleMode = 
      travelMode === 'TRANSIT' 
        ? window.google.maps.TravelMode.TRANSIT 
        : travelMode === 'WALKING' 
        ? window.google.maps.TravelMode.WALKING 
        : window.google.maps.TravelMode.DRIVING;

    directionsService.route(
      {
        origin: { lat: userLocation.latitude, lng: userLocation.longitude },
        destination: { lat: primaryDest.latitude, lng: primaryDest.longitude },
        travelMode: googleMode
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          setDirectionsResult(result);
        } else {
          setDirectionsResult(null);
        }
      }
    );
  }, [isLoaded, map, userLocation, primaryDest, travelMode]);

  // Adjust map viewport to fit both user location and destinations
  useEffect(() => {
    if (!map || !window.google?.maps?.LatLngBounds) return;

    const bounds = new window.google.maps.LatLngBounds();
    let count = 0;

    if (userLocation) {
      bounds.extend({ lat: userLocation.latitude, lng: userLocation.longitude });
      count++;
    }

    if (primaryDest && primaryDest.latitude != null && primaryDest.longitude != null) {
      bounds.extend({ lat: primaryDest.latitude, lng: primaryDest.longitude });
      count++;
    }

    if (count >= 2) {
      map.fitBounds(bounds, { top: 60, right: 60, bottom: 90, left: 60 });
    }
  }, [map, userLocation, primaryDest]);

  const defaultCenter = useMemo(() => {
    if (userLocation) {
      return { lat: userLocation.latitude, lng: userLocation.longitude };
    }
    if (primaryDest && primaryDest.latitude != null && primaryDest.longitude != null) {
      return { lat: primaryDest.latitude, lng: primaryDest.longitude };
    }
    if (activeDestinations.length > 0) {
      return { lat: activeDestinations[0].latitude!, lng: activeDestinations[0].longitude! };
    }
    return { lat: 20.5937, lng: 78.9629 };
  }, [userLocation, primaryDest, activeDestinations]);

  const onLoad = useCallback((mapInstance: any) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleCopyCoords = (lat: number, lng: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${lat}, ${lng}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const mapOptions = useMemo(() => ({
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    fullscreenControl: false,
    styles: mapStyles,
  }), []);

  // Handle Loading State
  if (!isLoaded && !authError && !loadError) {
    return (
      <div 
        className={`google-map-loader-container ${className}`} 
        style={{ height }}
      >
        <div className="map-loader-card">
          <div className="map-loader-spinner" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a', fontWeight: 600 }}>
            <Compass className="animate-spin-slow" size={20} color="#0284c7" />
            <span>Loading Google Maps & Routes...</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
            Fetching high-precision satellite, user GPS & duration estimates
          </p>
        </div>
      </div>
    );
  }

  // Handle Fallback Mode (e.g. if API Key is unauthorized or offline)
  if (loadError || authError) {
    const lat = primaryDest?.latitude || 32.2396;
    const lng = primaryDest?.longitude || 77.1887;
    const name = primaryDest?.name || 'Destination Location';

    const originLat = userLocation?.latitude || 28.6139;
    const originLng = userLocation?.longitude || 77.2090;

    const iframeSrc = userLocation
      ? `https://maps.google.com/maps?saddr=${originLat},${originLng}&daddr=${lat},${lng}&hl=en&output=embed`
      : `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=${zoom}&output=embed`;

    return (
      <div 
        className={`google-map-fallback-container ${className}`} 
        style={{ height, position: 'relative', overflow: 'hidden', borderRadius: 16 }}
      >
        {/* Floating Top Bar with GPS Locate */}
        <div style={{ position: 'absolute', top: 12, left: 12, right: 12, zIndex: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="map-action-pill"
              style={{ background: userLocation ? '#0284c7' : '#ffffff', color: userLocation ? '#ffffff' : '#0f172a', fontWeight: 700 }}
            >
              <Crosshair size={14} className={isLocating ? 'animate-spin-slow' : ''} />
              <span>{isLocating ? 'Detecting GPS...' : userLocation ? '📍 GPS Active' : '📍 Use My Location'}</span>
            </button>

            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setSelectedCityPickerOpen(!selectedCityPickerOpen)}
                className="map-action-pill"
              >
                <span>{userLocation ? userLocation.name : 'Choose Starting City'}</span>
                <ChevronDown size={13} />
              </button>

              {selectedCityPickerOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', minWidth: 180, maxHeight: 220, overflowY: 'auto', zIndex: 30 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', padding: '4px 8px', textTransform: 'uppercase' }}>Select Origin</div>
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
          </div>
        </div>

        {/* Live Route & Duration Floating Card */}
        {showRouteEstimates && travelEstimates && (
          <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, zIndex: 12, background: 'rgba(255, 255, 255, 0.96)', backdropFilter: 'blur(12px)', borderRadius: 14, padding: '14px 18px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                  <Route size={14} color="#0284c7" />
                  <span>{userLocation?.name || 'Your Location'} &rarr; {name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                    {activeEstimate?.durationText}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
                    ({activeEstimate?.distanceText} away)
                  </span>
                </div>
              </div>

              {/* Mode Selectors */}
              <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 3, borderRadius: 10 }}>
                <button
                  type="button"
                  onClick={() => setTravelMode('DRIVING')}
                  className={`btn btn-sm ${travelMode === 'DRIVING' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                >
                  <Car size={13} /> Drive
                </button>
                <button
                  type="button"
                  onClick={() => setTravelMode('TRANSIT')}
                  className={`btn btn-sm ${travelMode === 'TRANSIT' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                >
                  <Train size={13} /> Train
                </button>
                <button
                  type="button"
                  onClick={() => setTravelMode('FLYING')}
                  className={`btn btn-sm ${travelMode === 'FLYING' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                >
                  <Plane size={13} /> Flight
                </button>
              </div>

              <a
                href={getDirectionsUrl(originLat, originLng, lat, lng, name, travelMode === 'TRANSIT' ? 'transit' : travelMode === 'WALKING' ? 'walking' : 'driving')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Navigation size={14} /> Start Live GPS Navigation
              </a>
            </div>
          </div>
        )}

        {/* Embedded Iframe Preview */}
        <iframe
          title="Map Route Fallback"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'saturate(1.1)', width: '100%', height: '100%' }}
          loading="lazy"
          src={iframeSrc}
        />
      </div>
    );
  }

  const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '16px'
  };

  return (
    <div 
      ref={containerRef}
      className={`google-map-wrapper ${isFullscreen ? 'fullscreen' : ''} ${className}`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Top Floating Control Bar */}
      {showControls && (
        <div className="map-floating-bar">
          {/* Map Layer Toggles */}
          <div className="map-type-toggles">
            <button
              type="button"
              className={`map-type-btn ${mapTypeId === 'roadmap' ? 'active' : ''}`}
              onClick={() => {
                setMapTypeId('roadmap');
                map?.setMapTypeId('roadmap');
              }}
            >
              <Compass size={14} /> Map
            </button>
            <button
              type="button"
              className={`map-type-btn ${mapTypeId === 'satellite' ? 'active' : ''}`}
              onClick={() => {
                setMapTypeId('satellite');
                map?.setMapTypeId('satellite');
              }}
            >
              <Layers size={14} /> Satellite
            </button>
            <button
              type="button"
              className={`map-type-btn ${mapTypeId === 'terrain' ? 'active' : ''}`}
              onClick={() => {
                setMapTypeId('terrain');
                map?.setMapTypeId('terrain');
              }}
            >
              <Layers size={14} /> Terrain
            </button>
          </div>

          {/* User Location Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="map-action-pill"
              style={{
                background: userLocation ? '#0284c7' : 'rgba(255, 255, 255, 0.95)',
                color: userLocation ? '#ffffff' : '#0f172a',
                fontWeight: 600
              }}
              title="Detect your live GPS location"
            >
              <Crosshair size={14} className={isLocating ? 'animate-spin-slow' : ''} />
              <span>{isLocating ? 'Locating...' : userLocation ? '📍 GPS On' : 'Detect My Location'}</span>
            </button>

            {/* City Selector Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setSelectedCityPickerOpen(!selectedCityPickerOpen)}
                className="map-action-pill"
                title="Choose origin city"
              >
                <span>{userLocation?.name || 'Starting City'}</span>
                <ChevronDown size={12} />
              </button>

              {selectedCityPickerOpen && (
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

            {primaryDest && primaryDest.latitude != null && (
              <button
                type="button"
                className="map-action-pill"
                onClick={() => handleCopyCoords(primaryDest.latitude!, primaryDest.longitude!)}
                title="Copy GPS coordinates"
              >
                {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : `${primaryDest.latitude.toFixed(2)}°, ${primaryDest.longitude?.toFixed(2)}°`}</span>
              </button>
            )}

            <button
              type="button"
              className="map-action-pill"
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Google Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={userLocation && primaryDest ? 7 : activeDestinations.length > 1 ? 5 : zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* User Location Marker */}
        {userLocation && (
          <MarkerF
            position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
            title="Your Current Location"
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: window.google?.maps?.Size ? new window.google.maps.Size(42, 42) : undefined
            }}
            onClick={() => setShowUserPinInfo(true)}
          />
        )}

        {/* User Location Info Window */}
        {userLocation && showUserPinInfo && (
          <InfoWindowF
            position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
            onCloseClick={() => setShowUserPinInfo(false)}
          >
            <div style={{ padding: 6, color: '#0f172a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.9rem' }}>
                <Crosshair size={14} color="#0284c7" />
                <span>{userLocation.name || 'Your Location'}</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                {userLocation.latitude.toFixed(4)}° N, {userLocation.longitude.toFixed(4)}° E
              </p>
            </div>
          </InfoWindowF>
        )}

        {/* Google Maps Directions Renderer (Route Line) */}
        {directionsResult && (
          <DirectionsRenderer
            directions={directionsResult}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: '#0284c7',
                strokeWeight: 5,
                strokeOpacity: 0.85
              }
            }}
          />
        )}

        {/* Render Markers for Destinations (when directions line is not suppressing them) */}
        {!directionsResult && activeDestinations.map((dest) => {
          if (dest.latitude == null || dest.longitude == null) return null;
          const isSelected = selectedPin?.id === dest.id;

          return (
            <MarkerF
              key={dest.id}
              position={{ lat: dest.latitude, lng: dest.longitude }}
              title={dest.name}
              animation={isSelected && window.google?.maps?.Animation ? window.google.maps.Animation.BOUNCE : undefined}
              onClick={() => {
                setSelectedPin(dest);
                if (onSelectDestination) onSelectDestination(dest);
              }}
            />
          );
        })}

        {/* Info Window for Selected Pin */}
        {selectedPin && selectedPin.latitude != null && selectedPin.longitude != null && !directionsResult && (
          <InfoWindowF
            position={{ lat: selectedPin.latitude, lng: selectedPin.longitude }}
            onCloseClick={() => setSelectedPin(null)}
            options={{
              pixelOffset: window.google?.maps?.Size ? new window.google.maps.Size(0, -30) : undefined
            }}
          >
            <div className="map-infowindow-card">
              {selectedPin.image && (
                <div className="infowindow-img-wrap">
                  <img src={selectedPin.image} alt={selectedPin.name} className="infowindow-img" />
                  <span className="infowindow-badge">{selectedPin.category}</span>
                </div>
              )}
              <div className="infowindow-body">
                <h4 className="infowindow-title">{selectedPin.name}</h4>
                <p className="infowindow-address">
                  <MapPin size={12} color="#0284c7" />
                  {selectedPin.address || selectedPin.location}
                </p>

                <div className="infowindow-meta">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#d97706', fontWeight: 700, fontSize: '0.85rem' }}>
                    <Star size={13} fill="#d97706" />
                    <span>{selectedPin.rating.toFixed(1)}</span>
                  </div>
                  {selectedPin.price && (
                    <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>
                      ₹{selectedPin.price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div className="infowindow-actions">
                  <Link 
                    to={`/trips/${selectedPin.id}`} 
                    className="infowindow-btn infowindow-btn-primary"
                  >
                    View Trip Details
                  </Link>
                  <a
                    href={getDirectionsUrl(
                      userLocation?.latitude || selectedPin.latitude,
                      userLocation?.longitude || (selectedPin.longitude ?? 77.1887),
                      selectedPin.latitude,
                      selectedPin.longitude ?? 77.1887,
                      selectedPin.name
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="infowindow-btn infowindow-btn-outline"
                    title="Open Navigation in Google Maps"
                  >
                    <Navigation size={12} /> Directions
                  </a>
                </div>
              </div>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>

      {/* Floating Travel Duration & Live Route Overview Card */}
      {showRouteEstimates && userLocation && primaryDest && primaryDest.latitude != null && (
        <div className="map-route-duration-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#475569', fontWeight: 700 }}>
              <Route size={15} color="#0284c7" />
              <span>Route ETA & Duration</span>
            </div>

            {/* Travel Mode Toggle Pills */}
            <div className="map-travel-mode-pills">
              <button
                type="button"
                onClick={() => setTravelMode('DRIVING')}
                className={`map-mode-pill ${travelMode === 'DRIVING' ? 'active' : ''}`}
                title="Driving by Car / Bike"
              >
                <Car size={13} />
                <span>Car</span>
              </button>
              <button
                type="button"
                onClick={() => setTravelMode('TRANSIT')}
                className={`map-mode-pill ${travelMode === 'TRANSIT' ? 'active' : ''}`}
                title="Train / Transit"
              >
                <Train size={13} />
                <span>Train</span>
              </button>
              <button
                type="button"
                onClick={() => setTravelMode('FLYING')}
                className={`map-mode-pill ${travelMode === 'FLYING' ? 'active' : ''}`}
                title="Flight + Transfer"
              >
                <Plane size={13} />
                <span>Flight</span>
              </button>
              <button
                type="button"
                onClick={() => setTravelMode('WALKING')}
                className={`map-mode-pill ${travelMode === 'WALKING' ? 'active' : ''}`}
                title="Walking / Trekking"
              >
                <Footprints size={13} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span className="route-duration-highlight">
                  {activeEstimate?.durationText || 'Calculating...'}
                </span>
                <span className="route-distance-highlight">
                  • {activeEstimate?.distanceText} away
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                From <strong>{userLocation.name || 'Your Location'}</strong> to <strong>{primaryDest.name}</strong>
              </p>
            </div>

            <a
              href={getDirectionsUrl(
                userLocation.latitude,
                userLocation.longitude,
                primaryDest.latitude,
                primaryDest.longitude ?? 77.1887,
                primaryDest.name,
                travelMode === 'TRANSIT' ? 'transit' : travelMode === 'WALKING' ? 'walking' : 'driving'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', fontSize: '0.82rem' }}
            >
              <Navigation size={13} />
              <span>Open in Google Maps</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}

      {/* Bottom Quick Info Bar for Single Destination (when no user location selected) */}
      {!userLocation && destination && destination.latitude != null && (
        <div className="map-bottom-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <div className="map-pin-icon-wrap">
              <MapPin size={16} color="#0284c7" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {destination.address || destination.location}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                GPS: {destination.latitude.toFixed(4)}° N, {destination.longitude?.toFixed(4)}° E
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button
              type="button"
              onClick={handleDetectLocation}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: '0.82rem' }}
            >
              <Crosshair size={13} />
              <span>Calculate Duration From Me</span>
            </button>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&destination_place_id=${encodeURIComponent(destination.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontSize: '0.82rem' }}
            >
              <Navigation size={13} />
              <span>Get Directions</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
