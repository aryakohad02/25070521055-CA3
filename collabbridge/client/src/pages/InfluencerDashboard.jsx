import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import {
  FileText,
  Clock,
  CheckCircle,
  Award,
  Compass,
  Edit,
  ExternalLink,
  Sparkles,
  TrendingUp,
  UserCheck
} from 'lucide-react';

const InfluencerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInfluencerStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applications/stats/influencer');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      setError('Unable to load creator statistics from the database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfluencerStats();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading your creator workspace...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalApplicationsSubmitted: 0,
    pendingApplications: 0,
    acceptedCollaborations: 0,
    completedCollaborations: 0,
    availableCampaigns: 0,
    profileCompletionPercentage: 50
  };

  const profile = data?.profile;
  const recentApplications = data?.recentApplications || [];

  return (
    <div>
      {/* Welcome Hero Banner */}
      <div className="dashboard-hero" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}>
        <div>
          <h2>Hello, {user?.name || 'Creator'}! 🚀</h2>
          <p>
            Track your campaign proposals, monitor approved collaborations, and discover new brand opportunities.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/campaigns" className="btn btn-secondary" style={{ background: 'white', color: '#7c3aed' }}>
            <Compass size={18} />
            Browse Campaigns ({stats.availableCampaigns})
          </Link>
          <Link to="/settings" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>
            <Edit size={18} />
            Edit Profile
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <span>{error}</span>
        </div>
      )}

      {/* Profile Completion Bar */}
      <div className="card" style={{ marginBottom: '28px', padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--primary)" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Profile Strength & Marketplace Readiness</span>
          </div>
          <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
            {stats.profileCompletionPercentage}%
          </span>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${stats.profileCompletionPercentage}%`,
              height: '100%',
              backgroundColor: 'var(--primary)',
              borderRadius: '9999px',
              transition: 'width 0.4s ease'
            }}
          ></div>
        </div>
        {stats.profileCompletionPercentage < 100 && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Tip: Complete your bio, niche, social media links, and collaboration price to appear higher in brand searches.{' '}
            <Link to="/settings" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Complete profile →
            </Link>
          </p>
        )}
      </div>

      {/* Real Database Statistics Grid */}
      <div className="stats-grid">
        <StatCard
          title="Applications Sent"
          value={stats.totalApplicationsSubmitted}
          icon={FileText}
          color="purple"
        />
        <StatCard
          title="Under Review"
          value={stats.pendingApplications}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Active Collabs"
          value={stats.acceptedCollaborations}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Completed"
          value={stats.completedCollaborations}
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Main Grid: Application Tracking & Quick Overview */}
      <div className="section-grid">
        {/* Left Column: Applications Tracking */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Recent Application Activity</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Status updates for your submitted pitches
              </p>
            </div>
            <Link to="/influencer/applications" className="btn btn-outline btn-sm">
              All Applications
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Compass size={28} />
              </div>
              <h4 className="empty-state-title">No applications submitted yet</h4>
              <p className="empty-state-text">
                Browse open marketing campaigns and submit tailored proposals with your desired rate.
              </p>
              <Link to="/campaigns" className="btn btn-primary btn-sm">
                Explore Open Campaigns
              </Link>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Campaign Brief</th>
                    <th>Brand</th>
                    <th>Proposed Fee</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <span style={{ fontWeight: 600 }}>{app.campaignId?.title || 'Campaign'}</span>
                      </td>
                      <td>{app.campaignId?.brandId?.name || 'Brand'}</td>
                      <td style={{ fontWeight: 700 }}>${app.proposedPrice}</td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                      <td>
                        <Link
                          to={`/campaigns/${app.campaignId?._id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px' }}
                        >
                          Details <ExternalLink size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Profile Summary & Public Link */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">My Profile Snapshot</h3>
              <Link to="/settings" className="btn btn-secondary btn-sm">
                Edit
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              {profile?.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={user?.name}
                  className="avatar avatar-lg"
                />
              ) : (
                <div className="avatar avatar-lg">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
                </div>
              )}
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{user?.name}</h4>
                <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                  <span className="badge badge-niche">{profile?.niche || 'Creator'}</span>
                  {profile?.location && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {profile.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>FOLLOWERS</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{profile?.followerCount?.toLocaleString() || 0}</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>ENGAGEMENT</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{profile?.engagementRate || 0}%</div>
              </div>
            </div>

            {user && (
              <Link
                to={`/influencers/${user._id}`}
                className="btn btn-outline btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <UserCheck size={16} />
                Preview Public Profile
              </Link>
            )}
          </div>

          {/* Quick Opportunity Banner */}
          <div className="card" style={{ background: '#f3e8ff', borderColor: '#e9d5ff' }}>
            <h4 style={{ color: '#6b21a8', fontSize: '1.05rem', marginBottom: '8px' }}>
              Opportunities Waiting!
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#7e22ce', lineHeight: 1.5, marginBottom: '14px' }}>
              There are currently <strong>{stats.availableCampaigns} open campaigns</strong> accepting applications.
            </p>
            <Link to="/campaigns" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>
              Explore Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerDashboard;
