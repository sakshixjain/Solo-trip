import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { DestinationCard } from '../components/DestinationCard';
import type { Destination } from '../services/api';
import { fetchDestinations, INITIAL_DESTINATIONS } from '../services/api';

export const DestinationsPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    fetchDestinations().then((data) => {
      if (data && data.length > 0) setDestinations(data);
    });
  }, []);

  const tags = ['All', 'Mountains', 'Beach', 'Culture', 'Adventure', 'Nature', 'Wellness'];

  const filtered = destinations.filter((dest) => {
    const tagMatch = selectedTag === 'All' || dest.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
    const searchMatch = search === '' || dest.name.toLowerCase().includes(search.toLowerCase()) || dest.location.toLowerCase().includes(search.toLowerCase());
    return tagMatch && searchMatch;
  });

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
          Popular Destinations
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
          Discover iconic towns, tranquil beaches, and Himalayan getaways curated for solo travelers.
        </p>
      </div>

      {/* Filter and Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 36 }}>
        <div className="filter-pills">
          {tags.map((tag) => (
            <button
              key={tag}
              className={`filter-pill ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', padding: '8px 16px', borderRadius: 999, border: '1px solid #e2e8f0', minWidth: 260 }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="destinations-grid">
        {filtered.map((dest) => (
          <DestinationCard key={dest.id} destination={dest} />
        ))}
      </div>
    </div>
  );
};
