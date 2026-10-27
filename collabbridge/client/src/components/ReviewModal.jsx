import React, { useState } from 'react';
import { X, Star, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';

const ReviewModal = ({
  isOpen,
  onClose,
  campaignId,
  influencerId,
  influencerName,
  campaignTitle,
  onReviewSuccess
}) => {
  if (!isOpen) return null;

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!rating || rating < 1 || rating > 5) {
      setError('Please select a star rating between 1 and 5.');
      return;
    }

    if (!comment.trim() || comment.trim().length < 5) {
      setError('Please provide feedback of at least 5 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/reviews', {
        campaignId,
        influencerId,
        rating,
        comment: comment.trim()
      });

      if (res.data.success) {
        onReviewSuccess(res.data.review);
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Review Creator Collaboration</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Creator: <strong>{influencerName}</strong> • Campaign: <em>{campaignTitle}</em>
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ alignItems: 'center', textAlign: 'center', margin: '20px 0' }}>
            <label className="form-label" style={{ marginBottom: '8px' }}>
              Overall Experience Rating *
            </label>
            <div style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      size={32}
                      color="#d97706"
                      fill={filled ? '#d97706' : 'transparent'}
                      style={{ transition: 'transform 0.1s ease' }}
                    />
                  </button>
                );
              })}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#d97706', marginTop: '4px' }}>
              {rating} of 5 Stars
            </span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="comment">
              Written Performance Feedback *
            </label>
            <textarea
              id="comment"
              className="form-control"
              rows="4"
              placeholder="Share how the influencer performed, communication clarity, punctuality, content quality, and impact..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
            <span className="form-hint">
              This review will appear on the creator's public profile to help other brands discover top talent.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <CheckCircle size={16} />
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
