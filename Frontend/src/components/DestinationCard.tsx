import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import type { Destination } from '../services/api';
import { useWishlist } from '../context/WishlistContext';

interface DestinationCardProps {
  destination: Destination;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorited = isInWishlist(destination.id);

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
