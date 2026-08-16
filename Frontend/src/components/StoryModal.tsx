import { useState } from 'react';
import { X, Heart, Share2, Sparkles } from 'lucide-react';
import type { Story } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

interface StoryModalProps {
  story?: Story | null;
  isOpen: boolean;
  onClose: () => void;
  isWriting?: boolean;
  onStoryCreated?: (newStory: Story) => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({
  story,
  isOpen,
  onClose,
  isWriting = false,
  onStoryCreated
}) => {
  const { user, openAuthModal } = useAuth();
  const { showToast } = useWishlist();

  const [likes, setLikes] = useState<number>(story?.likes || 120);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  // For writing
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Adventure' | 'Solo Life' | 'Tips' | 'Experiences'>('Adventure');
  const [content, setContent] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  if (!isOpen) return null;

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      showToast('Liked this travel story! ❤️', 'success');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Story link copied to clipboard! 📋', 'info');
    }
  };

  const handleWriteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!title || !content) return;

    const newStory: Story = {
      id: Date.now(),
      title,
      category,
      excerpt: content.slice(0, 120) + '...',
      content,
      coverImage: coverUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      author: {
        name: user.name,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        role: 'Solo Adventurer'
      },
      date: 'Just now',
      readTime: '3 min read',
      likes: 1
    };

    if (onStoryCreated) {
      onStoryCreated(newStory);
    }
    showToast('🎉 Your travel story has been published!', 'success');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card animate-scale-up" 
        style={{ maxWidth: isWriting ? 600 : 720, maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {isWriting ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <Sparkles size={20} color="#0284c7" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Write Your Travel Story</h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 20 }}>
              Inspire thousands of solo travelers with your honest thoughts, raw memories, and hidden gems.
            </p>

            <form onSubmit={handleWriteSubmit}>
              <div className="form-group">
                <label className="form-label">Story Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My First 5 Days in Kyoto as a Solo Traveler"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="form-input"
                  >
                    <option value="Adventure">Adventure</option>
                    <option value="Solo Life">Solo Life</option>
                    <option value="Tips">Tips & Safety</option>
                    <option value="Experiences">Reflections & Experiences</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Cover Photo URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your Story (Markdown supported)</label>
                <textarea
                  required
                  rows={8}
                  placeholder="Write from your heart... How did the journey begin? What challenged you? What made it unforgettable?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="form-input form-textarea"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px' }}>
                Publish Story
              </button>
            </form>
          </div>
        ) : story ? (
          <div>
            <div style={{ position: 'relative', height: 260, borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
              <img
                src={story.coverImage}
                alt={story.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: 999,
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}
              >
                {story.category}
              </div>
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12, lineHeight: 1.3 }}>
              {story.title}
            </h2>

            {/* Author info bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 16,
                marginBottom: 20,
                borderBottom: '1px solid #e2e8f0',
                flexWrap: 'wrap',
                gap: 12
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img
                  src={story.author.avatar}
                  alt={story.author.name}
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{story.author.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {story.date} · {story.readTime}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={handleLike}
                  style={{ color: hasLiked ? '#f43f5e' : 'inherit' }}
                >
                  <Heart size={16} fill={hasLiked ? '#f43f5e' : 'none'} />
                  <span>{likes}</span>
                </button>
                <button className="btn btn-outline btn-sm" onClick={handleShare}>
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            <div style={{ fontSize: '1.02rem', lineHeight: 1.8, color: '#334155' }}>
              <p style={{ marginBottom: 16, fontWeight: 500, color: '#0f172a' }}>
                "{story.excerpt}"
              </p>
              <p style={{ whiteSpace: 'pre-line' }}>{story.content}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
