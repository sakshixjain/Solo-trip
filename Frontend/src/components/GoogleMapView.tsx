import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
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
  AlertCircle
} from 'lucide-react';
import { GOOGLE_MAPS_API_KEY, type Destination } from '../services/api';
import { Link } from 'react-router-dom';

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
  height?: string | number;
  zoom?: number;
  showControls?: boolean;
  className?: string;
  onSelectDestination?: (dest: Destination) => void;
}

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  destination,
  destinations,
  height = '440px',
  zoom = 12,
  showControls = true,
  className = '',
  onSelectDestination
}) => {
  const apiKey = GOOGLE_MAPS_API_KEY;

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

  const defaultCenter = useMemo(() => {
    if (destination && destination.latitude != null && destination.longitude != null) {
      return { lat: destination.latitude, lng: destination.longitude };
    }
    if (activeDestinations.length > 0) {
      return { lat: activeDestinations[0].latitude!, lng: activeDestinations[0].longitude! };
    }
    // Fallback to India center
    return { lat: 20.5937, lng: 78.9629 };
  }, [destination, activeDestinations]);

  const onLoad = useCallback((mapInstance: any) => {
    setMap(mapInstance);
    if (activeDestinations.length > 1 && window.google?.maps?.LatLngBounds) {
      const bounds = new window.google.maps.LatLngBounds();
      activeDestinations.forEach((d) => {
        if (d.latitude != null && d.longitude != null) {
          bounds.extend({ lat: d.latitude, lng: d.longitude });
        }
      });
      mapInstance.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
    }
  }, [activeDestinations]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Update bounds when destinations list change
  useEffect(() => {
    if (map && activeDestinations.length > 1 && window.google?.maps?.LatLngBounds) {
      const bounds = new window.google.maps.LatLngBounds();
      activeDestinations.forEach((d) => {
        if (d.latitude != null && d.longitude != null) {
          bounds.extend({ lat: d.latitude, lng: d.longitude });
        }
      });
      map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
    } else if (map && destination && destination.latitude != null && destination.longitude != null) {
      map.panTo({ lat: destination.latitude, lng: destination.longitude });
      map.setZoom(zoom);
    }
  }, [map, activeDestinations, destination, zoom]);

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

  const getDirectionsUrl = (lat: number, lng: number, placeName?: string) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(placeName || '')}`;
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
  if (!isLoaded) {
    return (
      <div 
        className={`google-map-loader-container ${className}`} 
        style={{ height }}
      >
        <div className="map-loader-card">
          <div className="map-loader-spinner" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a', fontWeight: 600 }}>
            <Compass className="animate-spin-slow" size={20} color="#0284c7" />
            <span>Loading Google Maps...</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
            Fetching high-precision satellite & terrain coordinates
          </p>
        </div>
      </div>
    );
  }

  // Handle Load Error or Fallback
  if (loadError) {
    const lat = destination?.latitude || 32.2396;
    const lng = destination?.longitude || 77.1887;
    const name = destination?.name || 'Destination Location';
    const address = destination?.address || destination?.location || 'India';

    return (
      <div 
        className={`google-map-fallback-container ${className}`} 
        style={{ height }}
      >
        <div className="map-fallback-overlay">
          <div className="fallback-badge">
            <AlertCircle size={16} color="#d97706" />
            <span>Interactive Location View</span>
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '8px 0 4px', color: '#0f172a' }}>{name}</h3>
          <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: 12 }}>
            <MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4, color: '#0284c7' }} />
            {address}
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a 
              href={getDirectionsUrl(lat, lng, name)}
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Navigation size={14} /> Open in Google Maps
            </a>
            <button 
              onClick={() => handleCopyCoords(lat, lng)}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              {copied ? 'Copied Coordinates' : `${lat.toFixed(4)}, ${lng.toFixed(4)}`}
            </button>
          </div>
        </div>

        {/* Embedded Iframe Preview */}
        <iframe
          title="Map Location Fallback"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'saturate(1.1)' }}
          loading="lazy"
          src={`https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=${zoom}&output=embed`}
        />
      </div>
    );
  }

  const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '16px'
  };

  const primaryDest = destination || activeDestinations[0];

  return (
    <div 
      ref={containerRef}
      className={`google-map-wrapper ${isFullscreen ? 'fullscreen' : ''} ${className}`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Top Floating Control Bar */}
      {showControls && (
        <div className="map-floating-bar">
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
        zoom={activeDestinations.length > 1 ? 5 : zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* Render Markers for Destinations */}
        {activeDestinations.map((dest) => {
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
        {selectedPin && selectedPin.latitude != null && selectedPin.longitude != null && (
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
                    href={getDirectionsUrl(selectedPin.latitude, selectedPin.longitude, selectedPin.name)}
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

      {/* Bottom Quick Info Bar for Single Destination */}
      {destination && destination.latitude != null && (
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
            <a
              href={getDirectionsUrl(destination.latitude, destination.longitude!, destination.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontSize: '0.82rem' }}
            >
              <Navigation size={13} />
              <span>Get Directions</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
