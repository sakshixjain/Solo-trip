import { Link } from 'react-router-dom';
import { CalendarCheck, Calendar, Users, X, Compass } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export const MyBookingsPage: React.FC = () => {
  const { bookings, cancelBooking } = useWishlist();
  const { isAuthenticated, openAuthModal } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ paddingTop: 60, paddingBottom: 80, textAlign: 'center' }}>
        <div style={{ maxWidth: 460, margin: '0 auto', background: 'var(--bg-surface)', padding: 40, borderRadius: 20, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <CalendarCheck size={48} color="#0284c7" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>Sign In to View Bookings</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 24 }}>
            Please sign in with your SoloTrip account to track active trips, download tickets, and manage reservations.
          </p>
          <button className="btn btn-primary" onClick={() => openAuthModal('login')}>
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
          My Booked Trips
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Manage your confirmed solo adventures and upcoming travel dates.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div 
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
              background: 'rgba(2, 132, 199, 0.15)', 
              color: '#0284c7', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px' 
            }}
          >
            <CalendarCheck size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>No Active Bookings Yet</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
            Ready to embark on your next solo experience? Discover our handpicked curated trips.
          </p>
          <Link to="/trips" className="btn btn-primary">
            <Compass size={16} /> Browse Trips
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {bookings.map((b) => (
            <div 
              key={b.id} 
              style={{ 
                background: 'var(--bg-surface)', 
                borderRadius: 18, 
                padding: 24, 
                border: '1px solid var(--border-light)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 20,
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                <img 
                  src={b.destinationImage} 
                  alt={b.destinationName} 
                  style={{ width: 100, height: 80, borderRadius: 12, objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span 
                      style={{ 
                        background: 'rgba(5, 150, 105, 0.15)', 
                        color: '#10b981', 
                        padding: '3px 10px', 
                        borderRadius: 999, 
                        fontSize: '0.75rem', 
                        fontWeight: 700 
                      }}
                    >
                      {b.status}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ID: {b.id}</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {b.destinationName}
                  </h3>
                  <div style={{ display: 'flex', gap: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={14} /> {b.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Users size={14} /> {b.travelers} Traveler(s)
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>Total Paid</span>
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{b.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <button 
                  className="btn btn-outline btn-sm"
                  style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                  onClick={() => cancelBooking(b.id)}
                >
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
