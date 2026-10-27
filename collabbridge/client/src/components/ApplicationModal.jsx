import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import api from '../services/api';

const ApplicationModal = ({ isOpen, onClose, campaign, onApplicationSuccess }) => {
  if (!isOpen || !campaign) return null;

  const [proposedPrice, setProposedPrice] = useState(campaign.budget || 500);
  const [proposal, setProposal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!proposal.trim() || proposal.trim().length < 10) {
      setError('Please provide a detailed proposal pitch (at least 10 characters).');
      return;
    }

    if (!proposedPrice || Number(proposedPrice) < 0) {
      setError('Please enter a valid proposed collaboration price.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/applications', {
        campaignId: campaign._id,
        proposal: proposal.trim(),
        proposedPrice: Number(proposedPrice)
      });

      if (res.data.success) {
        onApplicationSuccess(res.data.application);
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application. Please try again.';
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Apply for Collaboration</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Campaign: <strong>{campaign.title}</strong>
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
          <div className="form-group">
            <label className="form-label">Campaign Budget (Target)</label>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
              ${campaign.budget?.toLocaleString()}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="proposedPrice">
              Your Proposed Collaboration Fee ($ USD) *
            </label>
            <input
              id="proposedPrice"
              type="number"
              min="1"
              className="form-control"
              value={proposedPrice}
              onChange={(e) => setProposedPrice(e.target.value)}
              required
            />
            <span className="form-hint">
              You can match the brand's budget or propose a customized rate for your deliverables.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="proposal">
              Collaboration Proposal & Strategy Pitch *
            </label>
            <textarea
              id="proposal"
              className="form-control"
              rows="5"
              placeholder="Explain how you will showcase this brand, what content format you will create, and why your audience is the perfect match..."
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              required
            ></textarea>
            <span className="form-hint">Minimum 10 characters. Be concise, authentic, and compelling.</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Send size={16} />
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
