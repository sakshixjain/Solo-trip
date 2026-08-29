import React from 'react';
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
        <div className="trip-card-img-overlay" />
        
        {/* Top-Left Badges Strip */}
        <div className="trip-card-badges-container">
          {trip.category && (
            <span className="trip-card-badge-category">
              {trip.category}
            </span>
          )}
          {groupInfo && groupInfo.originCity && (
            <span className="trip-card-badge-origin">
              <MapPin size={11} className="trip-origin-pin-icon" />
              <span>From {groupInfo.originCity}</span>
            </span>
          )}
        </div>

        {/* Top-Right Heart Wishlist Button */}
        <button 
          type="button"
          className={`trip-card-wishlist-btn ${isFavorited ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(trip);
          }}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart 
            size={15} 
            fill={isFavorited ? '#ef4444' : 'none'} 
            color={isFavorited ? '#ef4444' : '#64748b'} 
          />
        </button>
      </div>

      <div className="trip-card-body">
        <div className="trip-card-header-row">
          <h3 className="trip-card-title">{trip.name}</h3>
        </div>
        <p className="trip-card-meta">
          {trip.days} Days · {trip.state || trip.country}
        </p>

        {/* Group Info Snippet */}
        {groupInfo && (
          <div className="trip-group-snippet">
            <div className="trip-group-name">
              <Users size={13} color="#059669" />
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
            <span className="trip-price-label">/ person</span>
          </div>

          <div className="trip-rating-badge">
            <Star size={12} fill="#eab308" color="#eab308" />
            <span>{trip.rating ? trip.rating.toFixed(1) : '4.8'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
