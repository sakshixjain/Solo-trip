import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Booking, Destination } from '../services/api';
import { INITIAL_DESTINATIONS } from '../services/api';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface WishlistContextType {
  wishlistIds: (string | number)[];
  wishlistDestinations: Destination[];
  toggleWishlist: (destination: Destination) => void;
  isInWishlist: (id: string | number) => boolean;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'bookedAt'>) => void;
  cancelBooking: (bookingId: string) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<(string | number)[]>(() => {
    const saved = localStorage.getItem('solo_trip_wishlist');
    return saved ? JSON.parse(saved) : [1, 3]; // default pre-populate 2 favorites
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('solo_trip_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem('solo_trip_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem('solo_trip_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const isInWishlist = (id: string | number) => {
    return wishlistIds.some((wid) => String(wid) === String(id));
  };

  const toggleWishlist = (destination: Destination) => {
    const exists = isInWishlist(destination.id);
    if (exists) {
      setWishlistIds((prev) => prev.filter((id) => String(id) !== String(destination.id)));
      showToast(`Removed "${destination.name}" from your Wishlist`, 'info');
    } else {
      setWishlistIds((prev) => [...prev, destination.id]);
      showToast(`Added "${destination.name}" to your Wishlist ❤️`, 'success');
    }
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'status' | 'bookedAt'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: 'BK-' + Math.floor(100000 + Math.random() * 900000),
      status: 'Confirmed',
      bookedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setBookings((prev) => [newBooking, ...prev]);
    showToast(`🎉 Booking Confirmed for ${bookingData.destinationName}!`, 'success');
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    showToast('Booking cancelled successfully', 'info');
  };

  const wishlistDestinations = INITIAL_DESTINATIONS.filter((d) => isInWishlist(d.id));

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistDestinations,
        toggleWishlist,
        isInWishlist,
        bookings,
        addBooking,
        cancelBooking,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
