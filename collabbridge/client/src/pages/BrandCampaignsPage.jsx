import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  Megaphone,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const BrandCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        brandOnly: 'true'
      };
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const res = await api.get('/campaigns', { params });
      if (res.data.success) {
        setCampaigns(res.data.campaigns);
      }
    } catch (err) {
      setError('Unable to fetch your campaigns. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter]);

  const handleDelete = async (campaignId, title) => {
    if (window.confirm(`Are you sure you want to delete campaign "${title}"? All submitted applications will also be deleted.`)) {
      try {
        const res = await api.delete(`/campaigns/${campaignId}`);
        if (res.data.success) {
          setSuccessMsg('Campaign deleted successfully.');
          fetchCampaigns();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete campaign.');
      }
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>My Marketing Campaigns</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Manage active briefs, review creator applications, and track collaboration progress.
          </p>
        </div>
        <Link to="/brand/campaigns/create" className="btn btn-primary">
          <PlusCircle size={18} />
          Create Campaign
        </Link>
      </div>

      {successMsg && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        {['all', 'published', 'draft', 'completed'].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`btn btn-sm ${statusFilter === tab ? 'btn-primary' : 'btn-secondary'}`}
            style={{ textTransform: 'capitalize' }}
            onClick={() => setStatusFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Megaphone size={28} />
          </div>
          <h3 className="empty-state-title">No campaigns found</h3>
          <p className="empty-state-text">
            {statusFilter === 'all'
              ? 'You have not created any marketing campaigns yet.'
              : `No campaigns currently marked as '${statusFilter}'.`}
          </p>
          <Link to="/brand/campaigns/create" className="btn btn-primary btn-sm">
            Launch Your First Campaign
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Campaign Title</th>
                  <th>Niche</th>
                  <th>Budget</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Applications</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((camp) => (
                  <tr key={camp._id}>
                    <td>
                      <Link
                        to={`/campaigns/${camp._id}`}
                        style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}
                      >
                        {camp.title}
                      </Link>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Created on {new Date(camp.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-niche">{camp.niche}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>${camp.budget?.toLocaleString()}</td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {new Date(camp.deadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td>
                      <StatusBadge status={camp.status} />
                    </td>
                    <td>
                      <Link
                        to={`/campaigns/${camp._id}`}
                        className="badge badge-accepted"
                        style={{ cursor: 'pointer', gap: '6px' }}
                      >
                        <Users size={12} />
                        {camp.applicationCount || 0} applied
                      </Link>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          to={`/campaigns/${camp._id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px' }}
                          title="View Campaign & Applications"
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <Link
                          to={`/brand/campaigns/edit/${camp._id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px' }}
                          title="Edit Campaign"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          style={{ padding: '4px 8px' }}
                          title="Delete Campaign"
                          onClick={() => handleDelete(camp._id, camp.title)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandCampaignsPage;
