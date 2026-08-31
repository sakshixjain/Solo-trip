import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MapPin, 
  Upload, 
  User, 
  Users, 
  X, 
  Camera
} from 'lucide-react';
import { 
  fetchGalleryPhotos, 
  saveGalleryPhoto, 
  likeGalleryPhoto, 
  type GalleryPhoto 
} from '../services/api';
import { useWishlist } from '../context/WishlistContext';

export const GalleryPage: React.FC = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<'All' | 'Solo' | 'Group'>('All');
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<GalleryPhoto | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // Upload Form State
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [newCaption, setNewCaption] = useState<string>('');
  const [newTravelerName, setNewTravelerName] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('');
  const [newCategory, setNewCategory] = useState<GalleryPhoto['category']>('Mountains');
  const [newTripMode, setNewTripMode] = useState<'Solo' | 'Group'>('Solo');

  const { showToast } = useWishlist();

  useEffect(() => {
    fetchGalleryPhotos().then((data) => {
      setPhotos(data);
    });
  }, []);

  const categories = ['All', 'Mountains', 'Beach', 'Culture', 'Adventure', 'Group Fun'];

  const filteredPhotos = photos.filter((photo) => {
    const categoryMatches = selectedCategory === 'All' || photo.category.toLowerCase() === selectedCategory.toLowerCase();
    const modeMatches = selectedMode === 'All' || photo.tripMode === selectedMode;
    return categoryMatches && modeMatches;
  });

  const handleLike = async (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    const updated = await likeGalleryPhoto(id);
    setPhotos(updated);
    if (activeLightboxPhoto && activeLightboxPhoto.id === id) {
      const found = updated.find((p) => p.id === id);
      if (found) setActiveLightboxPhoto(found);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl || !newCaption || !newTravelerName || !newLocation) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    const newPhoto: GalleryPhoto = {
      id: Date.now(),
      imageUrl: newImageUrl,
      caption: newCaption,
      travelerName: newTravelerName,
      travelerAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newTravelerName)}`,
      location: newLocation,
      category: newCategory,
      tripMode: newTripMode,
      date: 'Just now',
      likesCount: 1,
      isLiked: true
    };

    const updated = await saveGalleryPhoto(newPhoto);
    setPhotos(updated);
    setIsUploadOpen(false);
    setNewImageUrl('');
    setNewCaption('');
    setNewTravelerName('');
    setNewLocation('');
    showToast('🎉 Photo added to Traveler Gallery!', 'success');
  };

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 80 }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#0284c7', fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            <Camera size={15} /> Community Gallery
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
            Travelers Photo Gallery
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}>
            Real memories, scenic milestones, and group laughter posted by our solo and group travelers.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsUploadOpen(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <Upload size={16} /> Post Your Photo
        </button>
      </div>

      {/* Filter Tabs & Style Selectors */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 28 }}>
        {/* Category Pills */}
        <div className="filter-pills">
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

        {/* Solo vs Group Mode Switch */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className={`filter-pill ${selectedMode === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedMode('All')}
          >
            All Photos ({photos.length})
          </button>
          <button
            className={`filter-pill ${selectedMode === 'Solo' ? 'active' : ''}`}
            onClick={() => setSelectedMode('Solo')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
          >
            <User size={13} /> Solo Moments
          </button>
          <button
            className={`filter-pill ${selectedMode === 'Group' ? 'active' : ''}`}
            onClick={() => setSelectedMode('Group')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
          >
            <Users size={13} /> Group Batches
          </button>
        </div>
      </div>

      {/* Photo Grid */}
      {filteredPhotos.length === 0 ? (
        <div 
          style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            background: '#ffffff', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-light)' 
          }}
        >
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>No photos found in this category</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 18 }}>
            Be the first traveler to post a photo from this experience!
          </p>
          <button className="btn btn-primary btn-sm" onClick={() => setIsUploadOpen(true)}>
            <Upload size={14} /> Upload First Photo
          </button>
        </div>
      ) : (
        <div className="gallery-grid animate-fade-in">
          {filteredPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className="gallery-card"
              onClick={() => setActiveLightboxPhoto(photo)}
            >
              <img 
                src={photo.imageUrl} 
                alt={photo.caption} 
                className="gallery-card-img" 
                loading="lazy" 
              />
              <div className="gallery-card-overlay" />

              {/* Tag & Mode Badges */}
              <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6, zIndex: 3 }}>
                <span className="gallery-tag">
                  {photo.category}
                </span>
                <span 
                  className="gallery-tag" 
                  style={{ 
                    background: photo.tripMode === 'Group' ? 'rgba(2, 132, 199, 0.85)' : 'rgba(15, 23, 42, 0.85)',
                    color: '#ffffff'
                  }}
                >
                  {photo.tripMode === 'Group' ? '👥 Group Batch' : '👤 Solo Traveler'}
                </span>
              </div>

              {/* Like Button */}
              <button 
                className={`gallery-like-btn ${photo.isLiked ? 'liked' : ''}`}
                onClick={(e) => handleLike(e, photo.id)}
                title={photo.isLiked ? 'Liked' : 'Like photo'}
              >
                <Heart size={14} fill={photo.isLiked ? '#f43f5e' : 'none'} stroke={photo.isLiked ? '#f43f5e' : '#ffffff'} />
                <span>{photo.likesCount}</span>
              </button>

              {/* Card Footer Info */}
              <div className="gallery-card-info">
                <p className="gallery-card-caption">{photo.caption}</p>
                <div className="gallery-card-author-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <img 
                      src={photo.travelerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(photo.travelerName)}`} 
                      alt={photo.travelerName} 
                      className="gallery-author-avatar" 
                    />
                    <span className="gallery-author-name">{photo.travelerName}</span>
                  </div>
                  <span className="gallery-location-tag">
                    <MapPin size={11} /> {photo.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeLightboxPhoto && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setActiveLightboxPhoto(null)}>
          <div 
            className="modal-container glass-panel animate-scale-up" 
            style={{ maxWidth: 840, padding: 0, overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: 'relative' }}>
              <img 
                src={activeLightboxPhoto.imageUrl} 
                alt={activeLightboxPhoto.caption} 
                style={{ width: '100%', maxHeight: '520px', objectFit: 'cover' }} 
              />
              <button 
                className="modal-close" 
                style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(0,0,0,0.6)', color: 'white' }}
                onClick={() => setActiveLightboxPhoto(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span className="gallery-tag" style={{ position: 'static' }}>
                      {activeLightboxPhoto.category}
                    </span>
                    <span className="gallery-location-tag" style={{ color: '#0284c7', fontWeight: 600 }}>
                      <MapPin size={13} /> {activeLightboxPhoto.location}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>• {activeLightboxPhoto.date}</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {activeLightboxPhoto.caption}
                  </h3>
                </div>

                <button 
                  className={`btn btn-outline btn-sm ${activeLightboxPhoto.isLiked ? 'liked' : ''}`}
                  onClick={(e) => handleLike(e, activeLightboxPhoto.id)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: activeLightboxPhoto.isLiked ? '#f43f5e' : 'inherit' }}
                >
                  <Heart size={16} fill={activeLightboxPhoto.isLiked ? '#f43f5e' : 'none'} stroke={activeLightboxPhoto.isLiked ? '#f43f5e' : 'currentColor'} />
                  <span>{activeLightboxPhoto.likesCount} Likes</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                <img 
                  src={activeLightboxPhoto.travelerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeLightboxPhoto.travelerName)}`} 
                  alt={activeLightboxPhoto.travelerName} 
                  style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)' }} 
                />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                    {activeLightboxPhoto.travelerName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Verified {activeLightboxPhoto.tripMode === 'Group' ? 'Group Tour' : 'Solo'} Explorer
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Photo Modal */}
      {isUploadOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setIsUploadOpen(false)}>
          <div 
            className="modal-container glass-panel animate-scale-up"
            style={{ maxWidth: 540, padding: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Camera size={20} color="#0284c7" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Post Traveler Photo</h3>
              </div>
              <button className="modal-close" onClick={() => setIsUploadOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="form-label">Photo Image URL *</label>
                <input 
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="form-input"
                  required
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Paste direct image link from Unsplash, Imgur, or cloud storage.
                </span>
              </div>

              {newImageUrl && (
                <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', height: 140, border: '1px solid var(--border-light)' }}>
                  <img src={newImageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <div>
                <label className="form-label">Traveler Name / Crew *</label>
                <input 
                  type="text"
                  placeholder="e.g. Pooja Sharma, Delhi Batch Crew..."
                  value={newTravelerName}
                  onChange={(e) => setNewTravelerName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Trip Destination / Location *</label>
                <input 
                  type="text"
                  placeholder="e.g. Spiti Valley, Manali Solang, Goa Anjuna..."
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Photo Caption / Memory *</label>
                <textarea 
                  placeholder="Tell fellow travelers what made this moment special..."
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="form-input"
                  rows={3}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">Category</label>
                  <select 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="form-input"
                  >
                    <option value="Mountains">Mountains</option>
                    <option value="Beach">Beach</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Culture">Culture</option>
                    <option value="Group Fun">Group Fun</option>
                    <option value="Solo Moments">Solo Moments</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Trip Type</label>
                  <select 
                    value={newTripMode} 
                    onChange={(e) => setNewTripMode(e.target.value as any)}
                    className="form-input"
                  >
                    <option value="Solo">Solo Traveler</option>
                    <option value="Group">Group Batch</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Post to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
