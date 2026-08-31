import { useState } from 'react';
import { X, MessageSquare, ThumbsUp, Send, Sparkles } from 'lucide-react';
import type { Discussion } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

interface DiscussionModalProps {
  discussion?: Discussion | null;
  isOpen: boolean;
  onClose: () => void;
  isCreating?: boolean;
  onDiscussionCreated?: (newDiscussion: Discussion) => void;
}

export const DiscussionModal: React.FC<DiscussionModalProps> = ({
  discussion,
  isOpen,
  onClose,
  isCreating = false,
  onDiscussionCreated
}) => {
  const { user, openAuthModal } = useAuth();
  const { showToast } = useWishlist();

  // For thread viewing & replying
  const [likes, setLikes] = useState<number>(discussion?.likesCount || 0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [replies, setReplies] = useState(discussion?.replies || []);
  const [newReply, setNewReply] = useState('');

  // For creating thread
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'General' | 'Safety' | 'Buddy Finder' | 'Tips' | 'Itinerary'>('Tips');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      showToast('Upvoted discussion!', 'success');
    }
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!newReply.trim()) return;

    const replyObj = {
      id: Date.now(),
      author: user.name,
      timeAgo: 'Just now',
      content: newReply
    };

    setReplies((prev) => [...prev, replyObj]);
    setNewReply('');
    showToast('Reply posted!', 'success');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!title || !content) return;

    const created: Discussion = {
      id: Date.now(),
      title,
      content,
      category,
      author: { name: user.name },
      timeAgo: 'Just now',
      repliesCount: 0,
      likesCount: 1,
      replies: []
    };

    if (onDiscussionCreated) {
      onDiscussionCreated(created);
    }
    showToast('Discussion thread started!', 'success');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card animate-scale-up" 
        style={{ maxWidth: 680, maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {isCreating ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Sparkles size={20} color="#0284c7" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Start a Community Discussion</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
              Ask safety questions, find travel buddies for upcoming trips, or share itinerary advice.
            </p>

            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>Discussion Title / Question</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Is Spiti road trip safe for solo beginners in July?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>Category</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="form-input"
                >
                  <option value="Tips">Travel Tips & Recommendations</option>
                  <option value="Safety">Safety & Preparedness</option>
                  <option value="Buddy Finder">Find a Travel Buddy</option>
                  <option value="Itinerary">Itinerary Feedback</option>
                  <option value="General">General Chill & Chats</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>Details / Context</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Provide more background, dates, destinations, or specific questions so travelers can help..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="form-input form-textarea"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px' }}>
                Post Discussion
              </button>
            </form>
          </div>
        ) : discussion ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div className="discussion-avatar">
                {discussion.author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{discussion.author.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Posted {discussion.timeAgo} · Category: <span style={{ color: '#38bdf8', fontWeight: 600 }}>{discussion.category}</span>
                </div>
              </div>
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: 12, lineHeight: 1.3, color: 'var(--text-primary)' }}>
              {discussion.title}
            </h2>

            <p style={{ fontSize: '0.98rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 20 }}>
              {discussion.content}
            </p>

            {/* Action Bar */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                paddingBottom: 16, 
                borderBottom: '1px solid var(--border-light)', 
                marginBottom: 20 
              }}
            >
              <button
                className="btn btn-outline btn-sm"
                onClick={handleLike}
                style={{ color: hasLiked ? '#38bdf8' : 'inherit' }}
              >
                <ThumbsUp size={15} /> Upvote ({likes})
              </button>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <MessageSquare size={16} /> {replies.length} Replies
              </span>
            </div>

            {/* Replies List */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 14, color: 'var(--text-primary)' }}>
                Community Replies
              </h4>

              {replies.length === 0 ? (
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No replies yet. Be the first to share your thoughts!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {replies.map((r: any) => (
                    <div 
                      key={r.id} 
                      style={{ 
                        background: 'var(--bg-subtle)', 
                        borderRadius: 12, 
                        padding: 14, 
                        border: '1px solid var(--border-light)' 
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{r.author}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.timeAgo}</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {r.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleAddReply} style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                placeholder={user ? "Write a helpful reply..." : "Sign in to join the discussion"}
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                className="form-input"
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                <Send size={15} /> Reply
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};
