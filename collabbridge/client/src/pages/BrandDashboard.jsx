import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import ReviewModal from '../components/ReviewModal';
import {
  Megaphone,
  CheckCircle,
  FileText,
  Clock,
  PlusCircle,
  Users,
  Building2,
  ExternalLink,
  Star,
  Check,
  X
} from 'lucide-react';

const BrandDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Review modal state
  const [reviewModalData, setReviewModalData] = useState(null);

  const fetchBrandStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/campaigns/stats/brand');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      setError('Unable to load brand statistics from the database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandStats();
  }, []);

  const handleUpdateStatus = async (applicationId, status) => {
    setActionSuccess('');
    try {
      const res = await api.patch(`/applications/${applicationId}/status`, { status });
      if (res.data.success) {
        setActionSuccess(`Application marked as ${status}!`);
        fetchBrandStats();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update application status.');
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)' }}>Calculating real-time brand analytics...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalApplicationsReceived: 0,
    acceptedCollaborations: 0
  };

  const recentApplications = data?.recentApplications || [];
  const recentCampaigns = data?.recentCampaigns || [];

  return (
    <div>
      {/* Welcome Hero Banner */}
      <div className="dashboard-hero">
        <div>
          <h2>Welcome back, {user?.name || 'Brand Partner'}! 👋</h2>
          <p>
            Monitor real-time campaign performance, discover creators, and manage influencer proposals.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/brand/campaigns/create" className="btn btn-secondary" style={{ background: 'white', color: 'var(--primary)' }}>
            <PlusCircle size={18} />
            New Campaign
          </Link>
          <Link to="/influencers" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>
            <Users size={18} />
            Find Creators
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <span>{error}</span>
        </div>
      )}

      {/* Real Database Statistics Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Campaigns"
          value={stats.totalCampaigns}
          icon={Megaphone}
          color="purple"
        />
        <StatCard
          title="Active Campaigns"
          value={stats.activeCampaigns}
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Total Applications"
          value={stats.totalApplicationsReceived}
          icon={FileText}
          color="amber"
        />
        <StatCard
          title="Accepted Collabs"
          value={stats.acceptedCollaborations}
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Two Column Layout: Applications & Campaigns */}
      <div className="section-grid">
        {/* Left Column: Recent Applications */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Recent Inbound Applications</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Creators pitching for your active campaigns
              </p>
            </div>
            <Link to="/brand/campaigns" className="btn btn-outline btn-sm">
              View All Campaigns
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FileText size={28} />
              </div>
              <h4 className="empty-state-title">No applications received yet</h4>
              <p className="empty-state-text">
                When creators discover your published campaigns, their pitches and proposed rates will appear here.
              </p>
              <Link to="/brand/campaigns/create" className="btn btn-primary btn-sm">
                Publish a Campaign
              </Link>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Influencer</th>
                    <th>Campaign</th>
                    <th>Proposed Rate</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <Link
                          to={`/influencers/${app.influencerId?._id}`}
                          style={{ fontWeight: 600, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          {app.influencerId?.name || 'Creator'}
                          <ExternalLink size={12} />
                        </Link>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {app.influencerId?.email}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 500 }}>
                          {app.campaignId?.title || 'Campaign'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>${app.proposedPrice}</td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {app.status === 'pending' && (
                            <>
                              <button
                                className="btn btn-success btn-sm"
                                style={{ padding: '4px 8px' }}
                                title="Accept Application"
                                onClick={() => handleUpdateStatus(app._id, 'accepted')}
                              >
                                <Check size={14} /> Accept
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                style={{ padding: '4px 8px' }}
                                title="Reject Application"
                                onClick={() => handleUpdateStatus(app._id, 'rejected')}
                              >
                                <X size={14} />
                              </button>
                            </>
                          )}

                          {app.status === 'accepted' && (
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ padding: '4px 8px' }}
                              onClick={() => handleUpdateStatus(app._id, 'completed')}
                            >
                              <CheckCircle size={14} /> Complete
                            </button>
                          )}

                          {app.status === 'completed' && (
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', color: '#d97706' }}
                              onClick={() =>
                                setReviewModalData({
                                  campaignId: app.campaignId?._id,
                                  campaignTitle: app.campaignId?.title,
                                  influencerId: app.influencerId?._id,
                                  influencerName: app.influencerId?.name
                                })
                              }
                            >
                              <Star size={14} /> Review
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Recent Campaigns & Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Campaigns</h3>
              <Link to="/brand/campaigns" className="btn btn-secondary btn-sm">
                Manage
              </Link>
            </div>

            {recentCampaigns.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '14px' }}>No campaigns created yet.</p>
                <Link to="/brand/campaigns/create" className="btn btn-primary btn-sm">
                  Create First Campaign
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {recentCampaigns.map((c) => (
                  <div
                    key={c._id}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-page)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <Link
                        to={`/campaigns/${c._id}`}
                        style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}
                      >
                        {c.title}
                      </Link>
                      <StatusBadge status={c.status} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span>Budget: <strong>${c.budget}</strong></span>
                      <span>Category: <strong>{c.niche}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Card */}
          <div className="card" style={{ background: 'var(--primary-light)', borderColor: '#c7d2fe' }}>
            <h4 style={{ color: 'var(--primary-dark)', fontSize: '1.05rem', marginBottom: '8px' }}>
              Influencer Marketing Tips
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#4338ca', lineHeight: 1.5, marginBottom: '16px' }}>
              Setting concise deliverable requirements and competitive budgets increases high-quality creator proposals by over 3x.
            </p>
            <Link to="/influencers" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>
              Discover Top Creators
            </Link>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalData && (
        <ReviewModal
          isOpen={!!reviewModalData}
          onClose={() => setReviewModalData(null)}
          campaignId={reviewModalData.campaignId}
          campaignTitle={reviewModalData.campaignTitle}
          influencerId={reviewModalData.influencerId}
          influencerName={reviewModalData.influencerName}
          onReviewSuccess={() => {
            setActionSuccess('Review submitted successfully and posted to creator profile!');
            fetchBrandStats();
          }}
        />
      )}
    </div>
  );
};

export default BrandDashboard;
