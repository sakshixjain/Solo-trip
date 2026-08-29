import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, X } from 'lucide-react';

interface SearchWidgetProps {
  onSearch?: (query: string, category: string) => void;
  className?: string;
}

const POPULAR_SUGGESTIONS = [
  'Manali, Himachal Pradesh',
  'Goa Beach & Heritage',
  'Jaipur, Rajasthan',
  'Udaipur, Rajasthan',
  'Kasol, Parvati Valley',
  'Spiti Valley, Himachal',
  'Leh Ladakh, Ladakh',
  'Rishikesh, Uttarakhand',
  'Gokarna, Karnataka'
];

export const SearchWidget: React.FC<SearchWidgetProps> = ({ onSearch, className = '' }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(query, category);
    } else {
      const params = new URLSearchParams();
      if (query.trim()) params.set('search', query.trim());
      if (category !== 'All Categories') params.set('category', category);
      navigate(`/destinations?${params.toString()}`);
    }
  };

  const filteredSuggestions = POPULAR_SUGGESTIONS.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={`solotrip-search-container ${className}`} ref={widgetRef}>
      <form onSubmit={handleSearch} className="solotrip-search-card">
        {/* Search Input Box */}
        <div className="solotrip-search-input-col">
          <Search size={18} className="solotrip-search-icon" />
          <input
            type="text"
            placeholder="Where do you want to go?"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="solotrip-search-input"
          />
          {query && (
            <button
              type="button"
              className="solotrip-clear-btn"
              onClick={() => {
                setQuery('');
                setShowSuggestions(false);
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="solotrip-search-divider" />

        {/* Category Select Dropdown */}
        <div className="solotrip-search-category-col">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="solotrip-category-select"
          >
            <option value="All Categories">All Categories</option>
            <option value="Adventure">Adventure</option>
            <option value="Beach">Beach</option>
            <option value="Heritage">Heritage</option>
            <option value="Nature">Nature</option>
            <option value="Spiritual">Spiritual</option>
            <option value="Offbeat">Offbeat</option>
            <option value="Mountains">Mountains</option>
          </select>
          <ChevronDown size={15} className="solotrip-select-arrow" />
        </div>

        {/* Search Submit Button */}
        <button type="submit" className="solotrip-search-btn">
          Search
        </button>
      </form>

      {/* Autocomplete Dropdown Popover */}
      {showSuggestions && query.trim() !== '' && filteredSuggestions.length > 0 && (
        <div className="solotrip-suggestions-popover animate-fade-in">
          {filteredSuggestions.map((item, index) => (
            <div
              key={index}
              className="solotrip-suggestion-item"
              onClick={() => {
                setQuery(item.split(',')[0]);
                setShowSuggestions(false);
              }}
            >
              <Search size={14} color="#64748b" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
