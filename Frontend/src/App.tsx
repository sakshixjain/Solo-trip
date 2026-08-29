import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';

// Pages
import { Home } from './pages/Home';
import { TripsPage } from './pages/TripsPage';
import { TripDetailPage } from './pages/TripDetailPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { StoriesPage } from './pages/StoriesPage';
import { CommunityPage } from './pages/CommunityPage';
import { GalleryPage } from './pages/GalleryPage';
import { AdminPage } from './pages/AdminPage';
import { WishlistPage } from './pages/WishlistPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { AboutPage } from './pages/AboutPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={`app-container ${isAdminRoute ? 'admin-mode' : ''}`}>
      {!isAdminRoute && <Navbar />}
      <main className={`main-content ${isAdminRoute ? 'admin-main-content' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/trips/:id" element={<TripDetailPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/login" element={<AdminPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      <AuthModal />
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
