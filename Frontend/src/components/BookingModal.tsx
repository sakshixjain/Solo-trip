import { useState } from 'react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { Destination } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

interface BookingModalProps {
  destination: Destination;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ destination, isOpen, onClose }) => {
  const { user } = useAuth();
  const { addBooking } = useWishlist();

  const [date, setDate] = useState<string>(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  });
  const [travelers, setTravelers] = useState<number>(1);
  const [name, setName] = useState<string>(user?.name || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [phone, setPhone] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalPrice = destination.price * travelers;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addBooking({
      destinationId: destination.id,
      destinationName: destination.name,
      destinationImage: destination.image,
      date,
      travelers,
      totalPrice,
      userName: name,
      userEmail: email,
    });

    setIsSuccess(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }} className="animate-fade-in">
            <div 
              style={{ 
                width: 64, 
                height: 64, 
                borderRadius: '50%', 
                background: '#ecfdf5', 
                color: '#10b981', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 16px' 
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>
              Booking Confirmed!
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: 20, lineHeight: 1.5 }}>
              Your solo journey to <strong>{destination.name}</strong> is reserved for <strong>{date}</strong>. We have sent the itinerary & guide details to <strong>{email}</strong>.
            </p>
            <div 
              style={{ 
                background: 'var(--bg-subtle)', 
                borderRadius: 12, 
                padding: 16, 
                marginBottom: 24, 
                textAlign: 'left',
                border: '1px solid var(--border-light)' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Trip Duration:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{destination.duration}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Travelers:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{travelers} Person</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 700 }}>
                <span style={{ color: 'var(--text-primary)' }}>Total Amount:</span>
                <span style={{ color: 'var(--primary)' }}>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={onClose}
            >
              Done & Explore More
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 20 }}>
              <img 
                src={destination.image} 
                alt={destination.name}
                style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{destination.name}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{destination.duration}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>Departure Date</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>Number of Solo Travelers</label>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="form-input"
                >
                  <option value={1}>1 Traveler (Solo Spot)</option>
                  <option value={2}>2 Travelers (Bring a friend)</option>
                  <option value={3}>3 Travelers</option>
                  <option value={4}>4 Travelers</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>Email Address (for ticket & group link)</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>Phone Number / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Price Calculation */}
              <div 
                style={{ 
                  background: 'var(--bg-subtle)', 
                  borderRadius: 12, 
                  padding: '14px 18px', 
                  margin: '20px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Total Payable</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ShieldCheck size={16} /> Free Cancellation up to 48h
                </span>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px' }}>
                Confirm Booking
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
