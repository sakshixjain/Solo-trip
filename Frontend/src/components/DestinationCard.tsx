import { useNavigate } from 'react-router-dom';
import { Heart, Star, Navigation } from 'lucide-react';
import type { Destination } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { getTravelEstimates, type GeoPoint } from '../utils/geoUtils';

interface DestinationCardProps {
  destination: Destination;
  userLocation?: GeoPoint | null;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination, userLocation }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorited = isInWishlist(destination.id);

  const travelEstimate = (userLocation && destination.latitude != null && destination.longitude != null)
    ? getTravelEstimates(userLocation.latitude, userLocation.longitude, destination.latitude, destination.longitude).DRIVING
    : null;

  return (
    <div 
      className="destination-card"
      onClick={() => navigate(`/trips/${destination.id}`)}
    >
      <img 
        src={destination.image} 
        alt={destination.name} 
        className="destination-card-img" 
        loading="lazy"
      />
      <div className="destination-card-overlay" />

      {/* Travel Duration from User Badge (if available) */}
      {travelEstimate && (
        <div className="destination-travel-badge">
          <Navigation size={11} />
          <span>{travelEstimate.durationText} ({travelEstimate.distanceText})</span>
        </div>
      )}

      {/* Wishlist Heart Button */}
      <button 
        className={`destination-card-wishlist ${isFavorited ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(destination);
        }}
        title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
      >
        <Heart size={16} fill={isFavorited ? '#f43f5e' : 'none'} stroke={isFavorited ? '#f43f5e' : '#ffffff'} />
      </button>

      {/* Bottom Content */}
      <div className="destination-card-content">
        <h3 className="destination-name">{destination.name}</h3>
        <p className="destination-tags">
          {destination.tags.slice(0, 2).join(' · ')}
        </p>
        <div className="destination-rating">
          <Star size={13} fill="#fbbf24" stroke="#fbbf24" />
          <span>{destination.rating.toFixed(1)}</span>
          <span className="destination-review-count">({destination.reviewsCount})</span>
        </div>
      </div>
    </div>
  );
};
