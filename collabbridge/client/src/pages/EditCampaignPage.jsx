import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Megaphone, AlertCircle, ArrowLeft, Save } from 'lucide-react';

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

const EditCampaignPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [niche, setNiche] = useState('Technology');
  const [budget, setBudget] = useState('');
  const [requirements, setRequirements] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('published');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/campaigns/${id}`);
        if (res.data.success) {
          const c = res.data.campaign;
          setTitle(c.title || '');
          setDescription(c.description || '');
          setNiche(c.niche || 'Technology');
          setBudget(c.budget || '');
          setRequirements(c.requirements || '');
          if (c.deadline) {
            setDeadline(new Date(c.deadline).toISOString().split('T')[0]);
          }
          setStatus(c.status || 'published');
        }
      } catch (err) {
        setError('Failed to load campaign for editing.');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !requirements.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!budget || Number(budget) <= 0) {
      setError('Please enter a valid budget amount.');
      return;
    }

    setSaving(true);
    try {
      const res = await api.put(`/campaigns/${id}`, {
        title: title.trim(),
        description: description.trim(),
        niche,
        budget: Number(budget),
        requirements: requirements.trim(),
        deadline: new Date(deadline),
        status
      });

      if (res.data.success) {
        navigate(`/campaigns/${id}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update campaign.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading campaign details...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link
          to={`/campaigns/${id}`}
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
          Cancel & Return to Campaign
        </Link>
      </div>

      <div className="card" style={{ padding: '36px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>Edit Campaign Brief</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Modify deliverable requirements, adjust budget, or change campaign status.
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="niche">
                Category / Niche *
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
                Budget ($ USD) *
              </label>
              <input
                id="budget"
                type="number"
                min="1"
                className="form-control"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="deadline">
                Application Deadline *
              </label>
              <input
                id="deadline"
                type="date"
                className="form-control"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="status">
                Campaign Status *
              </label>
              <select
                id="status"
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="draft">Draft (Hidden from Marketplace)</option>
                <option value="published">Published (Accepting Applications)</option>
                <option value="completed">Completed (Closed)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Campaign Description *
            </label>
            <textarea
              id="description"
              className="form-control"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="requirements">
              Requirements & Deliverables *
            </label>
            <textarea
              id="requirements"
              className="form-control"
              rows="4"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
            <Link to={`/campaigns/${id}`} className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCampaignPage;
