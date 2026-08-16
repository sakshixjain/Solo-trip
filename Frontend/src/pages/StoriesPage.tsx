import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Story } from '../services/api';
import { INITIAL_STORIES } from '../services/api';
import { StoryModal } from '../components/StoryModal';

export const StoriesPage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isWriting, setIsWriting] = useState<boolean>(false);

  const categories = ['All', 'Adventure', 'Solo Life', 'Tips', 'Experiences'];

  const filtered = stories.filter((story) => {
    return selectedCategory === 'All' || story.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
            Travel Stories
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
            Real experiences, revelations, and lessons from solo wanderers worldwide.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setIsWriting(true)}
        >
          <Plus size={16} /> Write Your Story
        </button>
      </div>

      {/* Category Pills */}
      <div className="filter-pills" style={{ marginBottom: 36 }}>
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

      {/* Stories Grid */}
      <div className="stories-grid">
        {filtered.map((story) => (
          <div 
            key={story.id} 
            className="story-card"
            onClick={() => setActiveStory(story)}
          >
            <div className="story-card-img-wrap">
              <img src={story.coverImage} alt={story.title} className="story-card-img" loading="lazy" />
              <div 
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  background: 'rgba(15, 23, 42, 0.75)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 999
                }}
              >
                {story.category}
              </div>
            </div>
            <div className="story-card-body">
              <h3 className="story-card-title">{story.title}</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: 16, lineHeight: 1.5 }}>
                {story.excerpt}
              </p>
              <div className="story-card-author">
                <img src={story.author.avatar} alt={story.author.name} className="story-author-avatar" />
                <div className="story-author-info">
                  <span className="story-author-name">{story.author.name}</span>
                  <span className="story-date">{story.date} · {story.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Story Reader Modal */}
      <StoryModal
        story={activeStory}
        isOpen={!!activeStory}
        onClose={() => setActiveStory(null)}
      />

      {/* Write Story Modal */}
      <StoryModal
        isWriting={true}
        isOpen={isWriting}
        onClose={() => setIsWriting(false)}
        onStoryCreated={(newStory) => {
          setStories((prev) => [newStory, ...prev]);
        }}
      />
    </div>
  );
};
