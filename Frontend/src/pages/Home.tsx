import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  ArrowRight, 
  Users, 
  Smile, 
  Camera, 
  MessageSquare,
  ThumbsUp,
  MapPin,
  Map as MapIcon
} from 'lucide-react';
import { SearchWidget } from '../components/SearchWidget';
import { DestinationCard } from '../components/DestinationCard';
import { GoogleMapView } from '../components/GoogleMapView';
import { StoryModal } from '../components/StoryModal';
import { DiscussionModal } from '../components/DiscussionModal';
import type { Destination, Story, Discussion } from '../services/api';
import { 
  fetchDestinations, 
  INITIAL_DESTINATIONS, 
  INITIAL_STORIES, 
  INITIAL_DISCUSSIONS 
} from '../services/api';

export const Home: React.FC = () => {

  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [discussions, setDiscussions] = useState<Discussion[]>(INITIAL_DISCUSSIONS);

  // Modals
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isWriteStoryOpen, setIsWriteStoryOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [isCreateDiscussionOpen, setIsCreateDiscussionOpen] = useState(false);

  useEffect(() => {
    fetchDestinations().then((data) => {
      if (data && data.length > 0) setDestinations(data);
    });
  }, []);

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-background" />
        <div className="hero-overlay" />
        
        <div className="container" style={{ width: '100%' }}>
          <div className="hero-content animate-fade-in">
            <div className="hero-badge">
              <Compass size={16} /> <span>Built for Solo Explorers</span>
            </div>
            
            <h1 className="hero-title">
              Explore the World.<br />
              <span>Discover Yourself.</span>
            </h1>
            
            <p className="hero-subtitle">
              Solo travel tips, curated trips, real stories, and a community that's got your back.
            </p>

            {/* Hero Search Box / Widget */}
            <div className="hero-search-container">
              <SearchWidget />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Destinations Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Popular Destinations</h2>
              <p className="section-subtitle">Trending spots handpicked for solo explorers</p>
            </div>
            <Link to="/destinations" className="view-all-link">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="destinations-grid">
            {destinations.slice(0, 5).map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>

          {/* Interactive Google Map Section */}
          <div style={{ marginTop: 48, background: '#ffffff', borderRadius: 24, padding: '32px 28px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0284c7', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                  <MapIcon size={16} /> Interactive Map Explorer
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Discover Places by Location
                </h3>
              </div>
              <Link 
                to="/destinations" 
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <MapPin size={14} /> Fullscreen Map View <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <GoogleMapView
                destinations={destinations}
                height="420px"
                showControls={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Solo Travel? Section */}
      <section className="section" style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 40px' }}>
            <h2 className="section-title">Why Solo Travel?</h2>
            <p className="section-subtitle">
              It is not just a journey across places; it is a transformative journey within.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1: Freedom */}
            <div className="feature-card">
              <div className="feature-icon-badge sky">
                <Compass size={26} />
              </div>
              <h3 className="feature-title">Freedom</h3>
              <p className="feature-desc">
                Go where you want, when you want. Set your own pace with zero compromises.
              </p>
            </div>

            {/* Feature 2: Self Discovery */}
            <div className="feature-card">
              <div className="feature-icon-badge emerald">
                <Smile size={26} />
              </div>
              <h3 className="feature-title">Self Discovery</h3>
              <p className="feature-desc">
                Learn, grow and discover hidden resilience and confidence within yourself.
              </p>
            </div>

            {/* Feature 3: New Connections */}
            <div className="feature-card">
              <div className="feature-icon-badge indigo">
                <Users size={26} />
              </div>
              <h3 className="feature-title">New Connections</h3>
              <p className="feature-desc">
                Meet kindred solo travelers and locals who turn into lifelong friendships.
              </p>
            </div>

            {/* Feature 4: Unforgettable Memories */}
            <div className="feature-card">
              <div className="feature-icon-badge orange">
                <Camera size={26} />
              </div>
              <h3 className="feature-title">Unforgettable Memories</h3>
              <p className="feature-desc">
                Collect stories and moments that stay with you forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Share Your Journey Banner */}
      <div className="container">
        <div className="share-banner">
          <div className="share-banner-bg" />
          <div className="share-banner-overlay" />
          <div className="share-banner-content">
            <h2 className="share-banner-title">Share Your Journey</h2>
            <p className="share-banner-subtitle">
              Your story can inspire thousands of solo travelers taking their first brave step.
            </p>
            <button 
              className="btn btn-primary"
              style={{ background: '#ffffff', color: '#0f172a', fontWeight: 700 }}
              onClick={() => setIsWriteStoryOpen(true)}
            >
              Write Your Story
            </button>
          </div>
        </div>
      </div>

      {/* 5. Travel Stories Snippet */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Travel Stories</h2>
              <p className="section-subtitle">Real stories and perspectives from solo travelers</p>
            </div>
            <Link to="/stories" className="view-all-link">
              Read All Stories <ArrowRight size={16} />
            </Link>
          </div>

          <div className="stories-grid">
            {stories.slice(0, 3).map((story) => (
              <div 
                key={story.id} 
                className="story-card"
                onClick={() => setSelectedStory(story)}
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
                  <div className="story-card-author">
                    <img src={story.author.avatar} alt={story.author.name} className="story-author-avatar" />
                    <div className="story-author-info">
                      <span className="story-author-name">{story.author.name}</span>
                      <span className="story-date">{story.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Community Section Preview */}
      <section className="section" style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Community</h2>
              <p className="section-subtitle">Connect. Share. Inspire.</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setIsCreateDiscussionOpen(true)}
              >
                Start a Discussion
              </button>
              <Link to="/community" className="btn btn-secondary btn-sm">
                View All
              </Link>
            </div>
          </div>

          <div className="discussions-list">
            {discussions.slice(0, 3).map((disc) => (
              <div 
                key={disc.id} 
                className="discussion-item"
                onClick={() => setSelectedDiscussion(disc)}
              >
                <div className="discussion-left">
                  <div className="discussion-avatar">
                    {disc.author.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="discussion-title">{disc.title}</h4>
                    <div className="discussion-meta">
                      {disc.author.name} · {disc.timeAgo}
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
        </div>
      </section>

      {/* Modals */}
      <StoryModal 
        story={selectedStory}
        isOpen={!!selectedStory}
        onClose={() => setSelectedStory(null)}
      />

      <StoryModal 
        isWriting={true}
        isOpen={isWriteStoryOpen}
        onClose={() => setIsWriteStoryOpen(false)}
        onStoryCreated={(newStory) => {
          setStories((prev) => [newStory, ...prev]);
        }}
      />

      <DiscussionModal
        discussion={selectedDiscussion}
        isOpen={!!selectedDiscussion}
        onClose={() => setSelectedDiscussion(null)}
      />

      <DiscussionModal
        isCreating={true}
        isOpen={isCreateDiscussionOpen}
        onClose={() => setIsCreateDiscussionOpen(false)}
        onDiscussionCreated={(newDisc) => {
          setDiscussions((prev) => [newDisc, ...prev]);
        }}
      />
    </div>
  );
};
