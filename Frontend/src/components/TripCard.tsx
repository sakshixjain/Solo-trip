import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import type { Destination } from '../services/api';
import { useWishlist } from '../context/WishlistContext';

interface TripCardProps {
  trip: Destination;
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorited = isInWishlist(trip.id);

  return (
    <div 
      className="trip-card"
      onClick={() => navigate(`/trips/${trip.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="trip-card-image-wrap">
        <img 
          src={trip.image} 
          alt={trip.name} 
          className="trip-card-img" 
          loading="lazy"
        />
        <div className="trip-card-badge">
          {trip.category}
        </div>
        <button 
          className={`destination-card-wishlist ${isFavorited ? 'active' : ''}`}
          style={{ top: 12, right: 12 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(trip);
          }}
          title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={16} fill={isFavorited ? '#f43f5e' : 'none'} stroke={isFavorited ? '#f43f5e' : '#ffffff'} />
        </button>
      </div>

      <div className="trip-card-body">
        <h3 className="trip-card-title">{trip.name}</h3>
        <p className="trip-card-meta">
          {trip.days} Days · {trip.state || trip.country}
        </p>

        <div className="trip-card-footer">
          <div className="trip-price-wrap">
            <span className="trip-price-val">₹{trip.price.toLocaleString('en-IN')}</span>
          </div>

          <div className="trip-rating-badge">
            <Star size={14} fill="#d97706" stroke="#d97706" />
            <span>{trip.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
