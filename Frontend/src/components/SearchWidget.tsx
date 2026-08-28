import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Users, MapPin } from 'lucide-react';

interface SearchWidgetProps {
  onSearch?: (criteria: { 
    destination: string; 
    bestTime: string; 
    budget: string; 
    tripType: string;
    travelStyle: string;
    originCity: string;
  }) => void;
  className?: string;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({ onSearch, className = '' }) => {
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [tripType, setTripType] = useState('');
  const [travelStyle, setTravelStyle] = useState('All'); // 'All' | 'Solo' | 'Group'
  const [originCity, setOriginCity] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ destination, bestTime: '', budget, tripType, travelStyle, originCity });
    } else {
      const params = new URLSearchParams();
      if (destination) params.set('q', destination);
      if (budget) params.set('budget', budget);
      if (tripType) params.set('type', tripType);
      if (travelStyle && travelStyle !== 'All') params.set('style', travelStyle);
      if (originCity) params.set('origin', originCity);
      navigate(`/trips?${params.toString()}`);
    }
  };

  return (
    <div className={`search-widget-container ${className}`}>
      {/* Travel Style Selector Tabs */}
      <div className="search-tab-bar">
        <button
          type="button"
          className={`search-tab-btn ${travelStyle === 'All' ? 'active' : ''}`}
          onClick={() => setTravelStyle('All')}
        >
          All Adventures
        </button>
        <button
          type="button"
          className={`search-tab-btn ${travelStyle === 'Solo' ? 'active' : ''}`}
          onClick={() => setTravelStyle('Solo')}
        >
          <User size={14} /> Solo Trips
        </button>
        <button
          type="button"
          className={`search-tab-btn ${travelStyle === 'Group' ? 'active' : ''}`}
          onClick={() => setTravelStyle('Group')}
        >
          <Users size={14} /> Group Tours
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} className="search-widget animate-fade-in">
        {/* Field 1: Destination */}
        <div className="search-widget-field">
          <label className="search-widget-label">Destination</label>
          <input
            type="text"
            className="search-widget-input"
            placeholder="Where do you want to go? (Manali, Spiti, Bali...)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        {/* Field 2: Group Origin / Departure City */}
        <div className="search-widget-field">
          <label className="search-widget-label">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} /> Group Departure
            </span>
          </label>
          <select
            className="search-widget-select"
            value={originCity}
            onChange={(e) => setOriginCity(e.target.value)}
          >
            <option value="">Any Departure / Self</option>
            <option value="Delhi">From Delhi</option>
            <option value="Mumbai">From Mumbai</option>
            <option value="Bangalore">From Bangalore</option>
            <option value="Chandigarh">From Chandigarh</option>
            <option value="All-India">All-India (Base Camp / Airport)</option>
          </select>
        </div>

        {/* Field 3: Budget */}
        <div className="search-widget-field">
          <label className="search-widget-label">Budget</label>
          <select
            className="search-widget-select"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <option value="">Select budget</option>
            <option value="under-10k">Under ₹10,000</option>
            <option value="10k-25k">₹10,000 - ₹25,000</option>
            <option value="25k-50k">₹25,000 - ₹50,000</option>
            <option value="above-50k">₹50,000+</option>
          </select>
        </div>

        {/* Field 4: Trip Type */}
        <div className="search-widget-field">
          <label className="search-widget-label">Experience</label>
          <select
            className="search-widget-select"
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Adventure">Adventure & Trek</option>
            <option value="Beach">Beach & Social</option>
            <option value="Mountains">Himalayan Mountains</option>
            <option value="Culture">Culture & Heritage</option>
            <option value="Wellness">Wellness & Retreat</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="search-widget-submit" title="Search Trips">
          <Search size={16} />
          <span>Find Trips</span>
        </button>
      </form>
    </div>
  );
};
