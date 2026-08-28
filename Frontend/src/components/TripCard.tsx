import { useNavigate } from 'react-router-dom';
import { Heart, Star, Users, MapPin, Calendar } from 'lucide-react';
import type { Destination } from '../services/api';
import { useWishlist } from '../context/WishlistContext';

interface TripCardProps {
  trip: Destination;
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorited = isInWishlist(trip.id);

  const groupInfo = trip.groupInfo;
  const seatsLeft = groupInfo ? groupInfo.totalSeats - groupInfo.bookedSeats : null;

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
        
        {/* Category & Group Origin Tag */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 2 }}>
          <span className="trip-card-badge">
            {trip.category}
          </span>
          {groupInfo && (
            <span 
              className="trip-card-badge" 
              style={{ background: 'rgba(15, 23, 42, 0.88)', color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <MapPin size={11} /> From {groupInfo.originCity}
            </span>
          )}
        </div>

        <button 
          className={`destination-card-wishlist ${isFavorited ? 'active' : ''}`}
          style={{ top: 10, right: 10 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(trip);
          }}
          title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={15} fill={isFavorited ? '#f43f5e' : 'none'} stroke={isFavorited ? '#f43f5e' : '#ffffff'} />
        </button>
      </div>

      <div className="trip-card-body">
        <h3 className="trip-card-title">{trip.name}</h3>
        <p className="trip-card-meta">
          {trip.days} Days · {trip.state || trip.country}
        </p>

        {/* Group Info Strip (if available) */}
        {groupInfo && (
          <div className="trip-group-snippet">
            <div className="trip-group-name">
              <Users size={12} color="#0284c7" />
              <span>{groupInfo.groupName}</span>
            </div>
            <div className="trip-group-meta-row">
              <span className="trip-group-batch">
                <Calendar size={11} /> {groupInfo.nextBatchDate}
              </span>
              {seatsLeft != null && (
                <span className={`trip-group-seats ${seatsLeft <= 3 ? 'urgent' : ''}`}>
                  {seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} left
                </span>
              )}
            </div>
          </div>
        )}

        <div className="trip-card-footer">
          <div className="trip-price-wrap">
            <span className="trip-price-val">₹{trip.price.toLocaleString('en-IN')}</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: 4 }}>/ person</span>
          </div>

          <div className="trip-rating-badge">
            <Star size={13} fill="#d97706" stroke="#d97706" />
            <span>{trip.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
