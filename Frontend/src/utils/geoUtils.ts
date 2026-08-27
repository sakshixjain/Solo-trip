/**
 * Geolocation, Distance and Travel Duration calculation utilities
 */

export interface GeoPoint {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export interface TravelEstimate {
  distanceKm: number;
  distanceText: string;
  durationText: string;
  totalMinutes: number;
  mode: 'DRIVING' | 'TRANSIT' | 'WALKING' | 'FLYING';
  modeLabel: string;
  icon: string;
}

export const POPULAR_ORIGIN_CITIES: GeoPoint[] = [
  { name: 'New Delhi', latitude: 28.6139, longitude: 77.2090, address: 'Delhi, India' },
  { name: 'Mumbai', latitude: 19.0760, longitude: 72.8777, address: 'Maharashtra, India' },
  { name: 'Bengaluru', latitude: 12.9716, longitude: 77.5946, address: 'Karnataka, India' },
  { name: 'Chandigarh', latitude: 30.7333, longitude: 76.7794, address: 'Punjab/Haryana, India' },
  { name: 'Jaipur', latitude: 26.9124, longitude: 75.7873, address: 'Rajasthan, India' },
  { name: 'Kolkata', latitude: 22.5726, longitude: 88.3639, address: 'West Bengal, India' },
  { name: 'Hyderabad', latitude: 17.3850, longitude: 78.4867, address: 'Telangana, India' },
  { name: 'Pune', latitude: 18.5204, longitude: 73.8567, address: 'Maharashtra, India' },
  { name: 'Chennai', latitude: 13.0827, longitude: 80.2707, address: 'Tamil Nadu, India' },
  { name: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714, address: 'Gujarat, India' }
];

/**
 * Calculates Great-Circle distance (Haversine formula) in kilometers
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Calculates realistic travel duration & road distance based on transportation mode
 */
export function getTravelEstimates(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): Record<'DRIVING' | 'TRANSIT' | 'WALKING' | 'FLYING', TravelEstimate> {
  const airDistance = calculateDistanceKm(lat1, lon1, lat2, lon2);

  // 1. Driving estimate (factors road curvature: ~1.25x in plains, ~1.4x in mountain routes)
  const isMountainous = (lat2 > 30 && lon2 < 79); // Himachal, Uttarakhand, Ladakh
  const roadCurveFactor = isMountainous ? 1.38 : 1.22;
  const roadDistanceKm = Math.round(airDistance * roadCurveFactor);
  const driveSpeedKmH = isMountainous ? 42 : (roadDistanceKm > 300 ? 68 : 52);
  const driveBreakMinutes = Math.floor(roadDistanceKm / 120) * 20; // 20m break every 120km
  const driveMinutes = Math.round((roadDistanceKm / driveSpeedKmH) * 60 + driveBreakMinutes);

  // 2. Transit / Train estimate
  const transitDistanceKm = Math.round(airDistance * 1.28);
  const transitSpeedKmH = 58;
  const transitStationBuffer = 45; // arrival & boarding buffer
  const transitMinutes = Math.round((transitDistanceKm / transitSpeedKmH) * 60 + transitStationBuffer);

  // 3. Walking / Trekking estimate
  const walkDistanceKm = Math.round(airDistance * 1.15);
  const walkMinutes = Math.round((walkDistanceKm / 4.5) * 60);

  // 4. Flight estimate (if distance > 250km)
  const flightAirMinutes = Math.round((airDistance / 680) * 60);
  const flightBufferMinutes = 135; // check-in, security, baggage
  const flightTotalMinutes = flightAirMinutes + flightBufferMinutes;

  const formatMins = (totalMins: number): string => {
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
    if (hrs > 0) return `${hrs} hr${hrs > 1 ? 's' : ''}`;
    return `${mins} mins`;
  };

  return {
    DRIVING: {
      distanceKm: roadDistanceKm,
      distanceText: `${roadDistanceKm} km`,
      durationText: formatMins(driveMinutes),
      totalMinutes: driveMinutes,
      mode: 'DRIVING',
      modeLabel: 'Driving / Cab',
      icon: 'Car'
    },
    TRANSIT: {
      distanceKm: transitDistanceKm,
      distanceText: `${transitDistanceKm} km`,
      durationText: formatMins(transitMinutes),
      totalMinutes: transitMinutes,
      mode: 'TRANSIT',
      modeLabel: 'Train / Bus',
      icon: 'Train'
    },
    WALKING: {
      distanceKm: walkDistanceKm,
      distanceText: `${walkDistanceKm} km`,
      durationText: formatMins(walkMinutes),
      totalMinutes: walkMinutes,
      mode: 'WALKING',
      modeLabel: 'Walk / Trek',
      icon: 'Footprints'
    },
    FLYING: {
      distanceKm: airDistance,
      distanceText: `${airDistance} km`,
      durationText: formatMins(flightTotalMinutes),
      totalMinutes: flightTotalMinutes,
      mode: 'FLYING',
      modeLabel: 'Flight + Transfer',
      icon: 'Plane'
    }
  };
}

/**
 * Gets user location from browser Geolocation API
 */
export function getCurrentUserLocation(): Promise<{ latitude: number; longitude: number; name: string }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          name: 'Your Current Location'
        });
      },
      (error) => {
        let errorMsg = 'Could not fetch your location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission was denied. You can select your starting city manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out. Please try again.';
        }
        reject(new Error(errorMsg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}

/**
 * Builds standard Google Maps Turn-by-Turn GPS Directions URL
 */
export function getDirectionsUrl(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  destName?: string,
  travelMode: 'driving' | 'transit' | 'walking' | 'bicycling' = 'driving'
): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&destination_place_id=${encodeURIComponent(destName || '')}&travelmode=${travelMode}`;
}
