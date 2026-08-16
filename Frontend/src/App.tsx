import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { WishlistPage } from './pages/WishlistPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { AboutPage } from './pages/AboutPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <BrowserRouter>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/trips" element={<TripsPage />} />
                <Route path="/trips/:id" element={<TripDetailPage />} />
                <Route path="/destinations" element={<DestinationsPage />} />
                <Route path="/destinations/:id" element={<TripDetailPage />} />
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
            <Footer />
            <AuthModal />
            <ToastContainer />
          </div>
        </BrowserRouter>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
