import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import ApplicationModal from '../components/ApplicationModal';
import ReviewModal from '../components/ReviewModal';
import {
  Building2,
  Calendar,
  DollarSign,
  Tag,
  Clock,
  ArrowLeft,
  CheckCircle,
  FileText,
  Send,
  AlertCircle,
  Edit,
  Trash2,
  Star,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import '../styles/marketplace.css';

const CampaignDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Modals state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [reviewModalData, setReviewModalData] = useState(null);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/campaigns/${id}`);
      if (res.data.success) {
        setCampaign(res.data.campaign);
      }
    } catch (err) {
      setError('Campaign not found or no longer available.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const isBrandOwner =
    user &&
    user.role === 'brand' &&
    campaign &&
    campaign.brandId &&
    campaign.brandId._id === user._id;

  const isInfluencer = user && user.role === 'influencer';

  // Handle application status updates (Brand owner only)
  const handleUpdateStatus = async (applicationId, status) => {
    setActionSuccess('');
    try {
      const res = await api.patch(`/applications/${applicationId}/status`, { status });
      if (res.data.success) {
        setActionSuccess(`Collaboration status updated to '${status}'.`);
        fetchCampaign();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update application status.');
    }
  };

  const handleDeleteCampaign = async () => {
    if (window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      try {
        const res = await api.delete(`/campaigns/${campaign._id}`);
        if (res.data.success) {
          navigate('/brand/campaigns');
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete campaign.');
      }
    }
  };

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading campaign details...</p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '12px' }}>Campaign Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          {error || 'This campaign does not exist or was removed.'}
        </p>
        <Link to="/campaigns" className="btn btn-primary">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  const isDeadlinePassed = new Date(campaign.deadline) < new Date();
  const canApply =
    isInfluencer &&
    campaign.status === 'published' &&
    !isDeadlinePassed &&
    !campaign.myApplication;

  const deadlineStr = new Date(campaign.deadline).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const publishedStr = new Date(campaign.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link
            to={isBrandOwner ? '/brand/campaigns' : '/campaigns'}
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
            {isBrandOwner ? 'Back to My Campaigns' : 'Back to Marketplace'}
          </Link>

          {isBrandOwner && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to={`/brand/campaigns/edit/${campaign._id}`} className="btn btn-secondary btn-sm">
                <Edit size={14} /> Edit Campaign
              </Link>
              <button onClick={handleDeleteCampaign} className="btn btn-danger btn-sm">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>

        {actionSuccess && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Main Campaign Hero Card */}
        <div className="card" style={{ padding: '36px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-niche">{campaign.niche}</span>
                <StatusBadge status={campaign.status} />
              </div>
              <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>{campaign.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 600 }}>
                  <Building2 size={16} />
                  {campaign.brandId?.name || 'Verified Brand'}
                </span>
                <span>•</span>
                <span>Posted on {publishedStr}</span>
              </div>
            </div>

            {/* Application CTA for Influencers */}
            {canApply && (
              <button className="btn btn-primary btn-lg" onClick={() => setIsApplyModalOpen(true)}>
                <Send size={18} />
                Apply for Campaign
              </button>
            )}

            {!user && (
              <Link to="/login" className="btn btn-primary btn-lg">
                Log In to Apply
              </Link>
            )}
          </div>

          {/* Key Metrics Banner */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              background: 'var(--bg-subtle)',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              margin: '24px 0'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Campaign Budget
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                ${campaign.budget?.toLocaleString()}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Application Deadline
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: isDeadlinePassed ? 'var(--danger)' : 'var(--text-main)' }}>
                {deadlineStr}
                {isDeadlinePassed && <span style={{ fontSize: '0.8rem', marginLeft: '6px' }}>(Expired)</span>}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Applications Received
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {campaign.applicationCount || 0}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Campaign Overview</h3>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.7', fontSize: '1rem', whiteSpace: 'pre-line' }}>
              {campaign.description}
            </p>
          </div>

          {/* Requirements & Deliverables */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Deliverable Requirements</h3>
            <div
              style={{
                backgroundColor: 'var(--bg-page)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                lineHeight: '1.6',
                whiteSpace: 'pre-line',
                color: 'var(--text-main)'
              }}
            >
              {campaign.requirements}
            </div>
          </div>

          {/* Application Status Banner for logged-in Influencer who applied */}
          {campaign.myApplication && (
            <div
              style={{
                marginTop: '28px',
                padding: '20px 24px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                border: '1px solid #c7d2fe'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={20} color="var(--primary)" />
                  <h4 style={{ color: 'var(--primary-dark)', fontSize: '1.1rem' }}>Your Application Status</h4>
                </div>
                <StatusBadge status={campaign.myApplication.status} />
              </div>
              <p style={{ fontSize: '0.92rem', color: '#4338ca', marginBottom: '8px' }}>
                Your Proposed Fee: <strong>${campaign.myApplication.proposedPrice}</strong>
              </p>
              <p style={{ fontSize: '0.9rem', color: '#4338ca', fontStyle: 'italic' }}>
                "{campaign.myApplication.proposal}"
              </p>
            </div>
          )}
        </div>

        {/* Brand Owner Applications Management Table */}
        {isBrandOwner && (
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Applications Received for this Campaign ({campaign.applications?.length || 0})</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Review creator pitches, accept applicants, and track deliverable completion.
                </p>
              </div>
            </div>

            {(!campaign.applications || campaign.applications.length === 0) ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FileText size={28} />
                </div>
                <h4 className="empty-state-title">No applications submitted yet</h4>
                <p className="empty-state-text">
                  When creators discover this campaign listing, their applications will appear here.
                </p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Creator</th>
                      <th>Proposal Pitch</th>
                      <th>Proposed Rate</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaign.applications.map((app) => (
                      <tr key={app._id}>
                        <td>
                          <Link
                            to={`/influencers/${app.influencerId?._id}`}
                            style={{ fontWeight: 600, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            {app.influencerId?.name}
                            <ExternalLink size={12} />
                          </Link>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {app.influencerId?.email}
                          </div>
                        </td>
                        <td style={{ maxWidth: '300px' }}>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                            {app.proposal}
                          </p>
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
                                  onClick={() => handleUpdateStatus(app._id, 'accepted')}
                                >
                                  <Check size={14} /> Accept
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  style={{ padding: '4px 8px' }}
                                  onClick={() => handleUpdateStatus(app._id, 'rejected')}
                                >
                                  <X size={14} /> Reject
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
                                    campaignId: campaign._id,
                                    campaignTitle: campaign.title,
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
        )}

        {/* Influencer Application Modal */}
        <ApplicationModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          campaign={campaign}
          onApplicationSuccess={(newApplication) => {
            setActionSuccess('Your application has been submitted successfully to the brand!');
            fetchCampaign();
          }}
        />

        {/* Brand Review Modal */}
        {reviewModalData && (
          <ReviewModal
            isOpen={!!reviewModalData}
            onClose={() => setReviewModalData(null)}
            campaignId={reviewModalData.campaignId}
            campaignTitle={reviewModalData.campaignTitle}
            influencerId={reviewModalData.influencerId}
            influencerName={reviewModalData.influencerName}
            onReviewSuccess={() => {
              setActionSuccess('Review submitted successfully! It is now visible on the creator profile.');
              fetchCampaign();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CampaignDetail;
