import { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Compass, 
  Sparkles, 
  Plus, 
  ThumbsUp 
} from 'lucide-react';
import type { Discussion } from '../services/api';
import { INITIAL_DISCUSSIONS } from '../services/api';
import { DiscussionModal } from '../components/DiscussionModal';

export const CommunityPage: React.FC = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>(INITIAL_DISCUSSIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeDiscussion, setActiveDiscussion] = useState<Discussion | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const categories = ['All', 'Tips', 'Safety', 'Buddy Finder', 'Itinerary', 'General'];

  const filtered = discussions.filter((disc) => {
    return selectedCategory === 'All' || disc.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 36 }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
            Community
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
            Connect. Share. Inspire. You never walk alone with SoloTrip.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setIsCreating(true)}
        >
          <Plus size={16} /> Start a Discussion
        </button>
      </div>

      {/* 4 Community Pillars (Matching Design Mockup) */}
      <div className="community-pillars-grid">
        <div className="community-pillar-card">
          <div className="community-pillar-icon" style={{ background: '#fee2e2', color: '#ef4444' }}>
            <Users size={24} />
          </div>
          <h3 className="community-pillar-title">Connect</h3>
          <p className="community-pillar-desc">
            Meet solo travelers like you heading to the same destinations.
          </p>
        </div>

        <div className="community-pillar-card">
          <div className="community-pillar-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <MessageSquare size={24} />
          </div>
          <h3 className="community-pillar-title">Ask & Share</h3>
          <p className="community-pillar-desc">
            Get practical on-ground tips and share your authentic experiences.
          </p>
        </div>

        <div className="community-pillar-card">
          <div className="community-pillar-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <Compass size={24} />
          </div>
          <h3 className="community-pillar-title">Travel Together</h3>
          <p className="community-pillar-desc">
            Find travel buddies for shared cabs, road trips, and trekking trails.
          </p>
        </div>

        <div className="community-pillar-card">
          <div className="community-pillar-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Sparkles size={24} />
          </div>
          <h3 className="community-pillar-title">Inspire</h3>
          <p className="community-pillar-desc">
            Inspire first-timers and get inspired by seasoned backpackers.
          </p>
        </div>
      </div>

      {/* Category Pills for Discussions */}
      <div className="filter-pills" style={{ marginBottom: 28 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Discussions List */}
      <div className="discussions-list">
        {filtered.map((disc) => (
          <div 
            key={disc.id} 
            className="discussion-item"
            onClick={() => setActiveDiscussion(disc)}
          >
            <div className="discussion-left">
              <div className="discussion-avatar">
                {disc.author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="discussion-title">{disc.title}</h3>
                <div className="discussion-meta">
                  {disc.author.name} · {disc.timeAgo} · <span style={{ color: '#0284c7', fontWeight: 600 }}>{disc.category}</span>
                </div>
              </div>
            </div>

            <div className="discussion-stats">
              <div className="discussion-stat-item">
                <MessageSquare size={16} />
                <span>{disc.repliesCount}</span>
              </div>
              <div className="discussion-stat-item">
                <ThumbsUp size={16} />
                <span>{disc.likesCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Discussion Reader / Reply Modal */}
      <DiscussionModal
        discussion={activeDiscussion}
        isOpen={!!activeDiscussion}
        onClose={() => setActiveDiscussion(null)}
      />

      {/* Create Discussion Modal */}
      <DiscussionModal
        isCreating={true}
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onDiscussionCreated={(newDisc) => {
          setDiscussions((prev) => [newDisc, ...prev]);
        }}
      />
    </div>
  );
};
