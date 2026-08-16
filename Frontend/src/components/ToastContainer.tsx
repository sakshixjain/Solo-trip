import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useWishlist();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast-card">
          {toast.type === 'success' && <CheckCircle2 size={18} color="#34d399" />}
          {toast.type === 'error' && <AlertCircle size={18} color="#f87171" />}
          {toast.type === 'info' && <Info size={18} color="#38bdf8" />}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button 
            onClick={() => removeToast(toast.id)}
            style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
