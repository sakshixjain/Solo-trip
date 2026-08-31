import { Link } from 'react-router-dom';
import { Heart, Compass } from 'lucide-react';
import { DestinationCard } from '../components/DestinationCard';
import { useWishlist } from '../context/WishlistContext';

export const WishlistPage: React.FC = () => {
  const { wishlistDestinations } = useWishlist();

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
          My Wishlist ❤️
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Saved destinations and trips ready for your next solo adventure.
        </p>
      </div>

      {wishlistDestinations.length === 0 ? (
        <div 
          className="wishlist-empty-card"
          style={{ 
            textAlign: 'center', 
            padding: '80px 20px', 
            background: 'var(--bg-surface)', 
            borderRadius: 20, 
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div 
            style={{ 
              width: 64, 
              height: 64, 
              borderRadius: '50%', 
              background: 'rgba(244, 63, 94, 0.15)', 
              color: '#f43f5e', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px' 
            }}
          >
            <Heart size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>Your Wishlist is Empty</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
            Tap the heart icon on any destination or trip card to save it here for later.
          </p>
          <Link to="/trips" className="btn btn-primary">
            <Compass size={16} /> Explore Trips
          </Link>
        </div>
      ) : (
        <div className="destinations-grid">
          {wishlistDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}
    </div>
  );
};
