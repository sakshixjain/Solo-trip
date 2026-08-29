import { useNavigate } from 'react-router-dom';
import { Heart, Star, Navigation, Users } from 'lucide-react';
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

  const groupInfo = destination.groupInfo;

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

      {/* Top Badges */}
      <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 5, zIndex: 3 }}>
        {travelEstimate && (
          <div className="destination-travel-badge">
            <Navigation size={11} />
            <span>{travelEstimate.durationText}</span>
          </div>
        )}
        {groupInfo && (
          <div 
            style={{ 
              background: 'rgba(15, 23, 42, 0.88)', 
              backdropFilter: 'blur(4px)',
              color: '#38bdf8', 
              fontSize: '0.72rem', 
              fontWeight: 700, 
              padding: '3px 8px', 
              borderRadius: '999px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              whiteSpace: 'nowrap'
            }}
          >
            <Users size={11} /> Group: {groupInfo.originCity}
          </div>
        )}
      </div>

      {/* Wishlist Heart Button */}
      <button 
        className={`destination-card-wishlist ${isFavorited ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(destination);
        }}
        title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
      >
        <Heart size={15} fill={isFavorited ? '#f43f5e' : 'none'} stroke={isFavorited ? '#f43f5e' : '#ffffff'} />
      </button>

      {/* Bottom Content */}
      <div className="destination-card-content">
        <h3 className="destination-name">{destination.name}</h3>
        <p className="destination-tags">
          {destination.tags.slice(0, 2).join(' · ')}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="destination-rating">
            <Star size={12} fill="#fbbf24" stroke="#fbbf24" />
            <span>{destination.rating.toFixed(1)}</span>
            <span className="destination-review-count">({destination.reviewsCount})</span>
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>
            ₹{destination.price.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
};
