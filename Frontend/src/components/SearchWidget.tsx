import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

interface SearchWidgetProps {
  onSearch?: (criteria: { destination: string; bestTime: string; budget: string; tripType: string }) => void;
  className?: string;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({ onSearch, className = '' }) => {
  const [destination, setDestination] = useState('');
  const [bestTime, setBestTime] = useState('');
  const [budget, setBudget] = useState('');
  const [tripType, setTripType] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ destination, bestTime, budget, tripType });
    } else {
      const params = new URLSearchParams();
      if (destination) params.set('q', destination);
      if (bestTime) params.set('time', bestTime);
      if (budget) params.set('budget', budget);
      if (tripType) params.set('type', tripType);
      navigate(`/trips?${params.toString()}`);
    }
  };

  return (
    <div className={`search-widget-container ${className}`}>
      <form onSubmit={handleSearchSubmit} className="search-widget animate-fade-in">
        {/* Field 1: Destination */}
        <div className="search-widget-field">
          <label className="search-widget-label">Where do you want to go?</label>
          <input
            type="text"
            className="search-widget-input"
            placeholder="Search destinations (e.g. Manali, Bali...)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        {/* Field 2: Best Time */}
        <div className="search-widget-field">
          <label className="search-widget-label">Best Time</label>
          <select
            className="search-widget-select"
            value={bestTime}
            onChange={(e) => setBestTime(e.target.value)}
          >
            <option value="">Select time</option>
            <option value="Summer (Mar - Jun)">Summer (Mar - Jun)</option>
            <option value="Monsoon (Jul - Sep)">Monsoon (Jul - Sep)</option>
            <option value="Autumn (Oct - Nov)">Autumn (Oct - Nov)</option>
            <option value="Winter (Dec - Feb)">Winter (Dec - Feb)</option>
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
          <label className="search-widget-label">Trip Type</label>
          <select
            className="search-widget-select"
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
          >
            <option value="">Select type</option>
            <option value="Adventure">Adventure</option>
            <option value="Beach">Beach</option>
            <option value="Mountains">Mountains</option>
            <option value="Culture">Culture</option>
            <option value="Wildlife">Wildlife</option>
            <option value="Wellness">Wellness</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="search-widget-submit" title="Search Trips">
          <Search size={17} />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};
