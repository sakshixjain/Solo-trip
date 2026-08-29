import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, Plus, Minus, Maximize2, MapPin } from 'lucide-react';

export interface RouteCircuit {
  id: string;
  title: string;
  totalKm: string;
  totalDuration: string;
  googleMapsUrl: string;
  waypoints: {
    name: string;
    note: string;
    type: 'start' | 'stop';
    lat: number;
    lng: number;
    description?: string;
  }[];
  routeCoords: [number, number][];
}

interface InteractiveRouteMapProps {
  circuit: RouteCircuit;
  mapType: 'map' | 'satellite';
  onSelectWaypoint?: (name: string) => void;
  hoveredWaypoint?: string | null;
}

export const InteractiveRouteMap: React.FC<InteractiveRouteMapProps> = ({
  circuit,
  mapType,
  onSelectWaypoint,
  hoveredWaypoint
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const routeShadowRef = useRef<L.Polyline | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix default marker icons in Leaflet
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
    });

    const startWaypoint = circuit.waypoints[0];
    const initialCenter: [number, number] = startWaypoint 
      ? [startWaypoint.lat, startWaypoint.lng] 
      : [26.9124, 75.7873];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 6,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when mapType changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl = mapType === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const subdomains = mapType === 'satellite' ? [] : ['a', 'b', 'c', 'd'];

    const newTileLayer = L.tileLayer(tileUrl, {
      maxZoom: 18,
      subdomains: subdomains
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [mapType]);

  // Update Markers & Polyline when circuit changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    // Clear existing polylines
    if (routePolylineRef.current) map.removeLayer(routePolylineRef.current);
    if (routeShadowRef.current) map.removeLayer(routeShadowRef.current);

    // 1. Draw glowing Route Shadow Polyline
    const shadowPolyline = L.polyline(circuit.routeCoords, {
      color: '#2563eb',
      weight: 9,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);
    routeShadowRef.current = shadowPolyline;

    // 2. Draw active Route Polyline (Gleaming Blue highway line)
    const polyline = L.polyline(circuit.routeCoords, {
      color: '#3b82f6',
      weight: 4.5,
      opacity: 0.95,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);
    routePolylineRef.current = polyline;

    // 3. Add Custom Waypoint Markers
    circuit.waypoints.forEach((wp, index) => {
      const isStart = wp.type === 'start';
      
      const customIcon = L.divIcon({
        className: 'solotrip-custom-map-pin',
        html: `
          <div class="solotrip-pin-bubble ${isStart ? 'start-pin' : 'stop-pin'}">
            <div class="solotrip-pin-core"></div>
            ${isStart ? '<div class="solotrip-pin-radar"></div>' : ''}
          </div>
          <div class="solotrip-pin-label">
            <span>${wp.name}</span>
          </div>
        `,
        iconSize: [80, 42],
        iconAnchor: [40, 20]
      });

      const marker = L.marker([wp.lat, wp.lng], { icon: customIcon }).addTo(map);

      // Popup with destination info
      const popupHtml = `
        <div style="font-family: sans-serif; padding: 4px 6px; min-width: 150px;">
          <div style="font-weight: 800; font-size: 0.95rem; color: #0f172a; margin-bottom: 2px;">
            ${isStart ? '🟢 ' : '📍 '} ${wp.name}
          </div>
          <div style="font-size: 0.78rem; color: #64748b; margin-bottom: 6px;">
            ${wp.note}
          </div>
          <div style="font-size: 0.74rem; font-weight: 700; color: #064e3b; background: #ecfdf5; padding: 3px 8px; border-radius: 6px; display: inline-block;">
            ${isStart ? 'Journey Origin' : `Stop #${index}`}
          </div>
        </div>
      `;
      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        if (onSelectWaypoint) onSelectWaypoint(wp.name);
      });

      markersRef.current.push(marker);
    });

    // Auto-fit bounds to make the entire route perfectly centered with padding
    if (circuit.routeCoords.length > 0) {
      const bounds = L.latLngBounds(circuit.routeCoords);
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 8 });
    }
  }, [circuit, onSelectWaypoint]);

  // Handle hovered waypoint from left panel
  useEffect(() => {
    if (!hoveredWaypoint || !mapInstanceRef.current) return;
    const targetWp = circuit.waypoints.find((w) => w.name.toLowerCase() === hoveredWaypoint.toLowerCase());
    if (targetWp) {
      mapInstanceRef.current.panTo([targetWp.lat, targetWp.lng], { animate: true, duration: 0.5 });
    }
  }, [hoveredWaypoint, circuit]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleResetBounds = () => {
    if (mapInstanceRef.current && circuit.routeCoords.length > 0) {
      const bounds = L.latLngBounds(circuit.routeCoords);
      mapInstanceRef.current.fitBounds(bounds, { padding: [45, 45] });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);
  };

  return (
    <div className={`solotrip-real-map-wrapper ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="solotrip-leaflet-container" />

      {/* Floating Map Controls */}
      <div className="solotrip-real-map-controls">
        <button 
          type="button" 
          className="solotrip-real-map-btn" 
          onClick={handleResetBounds}
          title="Center on Route"
        >
          <Crosshair size={16} />
        </button>

        <div className="solotrip-real-map-zoom-group">
          <button 
            type="button" 
            className="solotrip-real-map-btn" 
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <Plus size={16} />
          </button>
          <button 
            type="button" 
            className="solotrip-real-map-btn" 
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <Minus size={16} />
          </button>
        </div>

        <button 
          type="button" 
          className="solotrip-real-map-btn" 
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
        >
          <Maximize2 size={15} />
        </button>
      </div>

      {/* Origin City Badge Overlay */}
      <div className="solotrip-map-origin-overlay">
        <MapPin size={12} color="#059669" />
        <span>Origin: <strong>{circuit.waypoints[0]?.name || 'Delhi'}</strong></span>
      </div>
    </div>
  );
};
