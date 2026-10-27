import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Megaphone, AlertCircle, ArrowLeft, Save, Send } from 'lucide-react';

const NICHES = [
  'Technology',
  'Fashion',
  'Fitness',
  'Travel',
  'Gaming',
  'Beauty',
  'Lifestyle',
  'Food'
];

const CreateCampaignPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [niche, setNiche] = useState('Technology');
  const [budget, setBudget] = useState('');
  const [requirements, setRequirements] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('published'); // default published
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Tomorrow's date string as minimum deadline
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !requirements.trim()) {
      setError('Please fill in title, description, and deliverable requirements.');
      return;
    }

    if (!budget || Number(budget) <= 0) {
      setError('Please specify a positive budget amount.');
      return;
    }

    if (!deadline) {
      setError('Please choose a valid future deadline date.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/campaigns', {
        title: title.trim(),
        description: description.trim(),
        niche,
        budget: Number(budget),
        requirements: requirements.trim(),
        deadline: new Date(deadline),
        status
      });

      if (res.data.success) {
        navigate(`/campaigns/${res.data.campaign._id}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create campaign. Please check your inputs.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link
          to="/brand/campaigns"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} />
          Back to My Campaigns
        </Link>
      </div>

      <div className="card" style={{ padding: '36px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>Create New Marketing Campaign</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Publish a campaign brief to receive applications from targeted creators, or save as a draft.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Campaign Title *
            </label>
            <input
              id="title"
              type="text"
              className="form-control"
              placeholder="e.g. Summer Sustainable Streetwear Capsule Showcase"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}
          >
            <div className="form-group">
              <label className="form-label" htmlFor="niche">
                Campaign Category / Niche *
              </label>
              <select
                id="niche"
                className="form-control"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                required
              >
                {NICHES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="budget">
                Allocated Budget ($ USD) *
              </label>
              <input
                id="budget"
                type="number"
                min="1"
                className="form-control"
                placeholder="e.g. 2500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="deadline">
              Application Deadline *
            </label>
            <input
              id="deadline"
              type="date"
              min={minDate}
              className="form-control"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
            <span className="form-hint">Creators will not be able to submit pitches after this date.</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Campaign Overview & Story *
            </label>
            <textarea
              id="description"
              className="form-control"
              rows="4"
              placeholder="Detail your product value proposition, target customer persona, and key brand talking points..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="requirements">
              Deliverables & Requirements *
            </label>
            <textarea
              id="requirements"
              className="form-control"
              rows="4"
              placeholder="e.g. 1x YouTube long-form integration (60-90s), 2x Instagram Reels with product tag #brand, and usage rights for 3 months."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-label">Publication Status</label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                />
                <strong>Publish Immediately</strong> (Visible in marketplace)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                />
                <strong>Save as Draft</strong> (Only visible to your brand)
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
            <Link to="/brand/campaigns" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              <Send size={18} />
              {loading ? 'Creating...' : status === 'published' ? 'Publish Campaign' : 'Save as Draft'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignPage;
