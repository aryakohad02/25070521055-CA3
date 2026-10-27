import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  MapPin,
  Star,
  Users,
  TrendingUp,
  DollarSign,
  ExternalLink,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  Share2,
  Calendar,
  Building2,
  ArrowLeft
} from 'lucide-react';
import '../styles/marketplace.css';

const InfluencerProfileDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/influencers/${id}`);
        if (res.data.success) {
          setInfluencer(res.data.influencer);
        }
      } catch (err) {
        setError('Creator profile not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading creator profile...</p>
      </div>
    );
  }

  if (error || !influencer) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '12px' }}>Profile Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          {error || "The creator profile you are trying to view doesn't exist."}
        </p>
        <Link to="/influencers" className="btn btn-primary">
          Back to Directory
        </Link>
      </div>
    );
  }

  const profileUser = influencer.userId || {};
  const initials = profileUser.name
    ? profileUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'IN';

  const reviews = influencer.reviews || [];
  const socialLinks = influencer.socialLinks || {};

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: '20px' }}>
          <Link
            to="/influencers"
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
            Back to All Creators
          </Link>
        </div>

        {/* Profile Detail Header Card */}
        <div className="profile-detail-header">
          <div className="profile-header-main">
            {influencer.profileImage ? (
              <img
                src={influencer.profileImage}
                alt={profileUser.name}
                className="avatar avatar-xl"
              />
            ) : (
              <div className="avatar avatar-xl">{initials}</div>
            )}

            <div className="profile-header-info" style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <h1>{profileUser.name}</h1>
                <span className="badge badge-niche" style={{ fontSize: '0.85rem' }}>
                  {influencer.niche}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '14px' }}>
                {influencer.location && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={15} color="var(--primary)" />
                    {influencer.location}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={15} color="#d97706" fill="#d97706" />
                  <strong>{influencer.averageRating ? influencer.averageRating.toFixed(1) : 'New'}</strong>
                  {influencer.reviewCount > 0 && ` (${influencer.reviewCount} brand reviews)`}
                </span>
              </div>

              <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.6', maxWidth: '720px' }}>
                {influencer.bio || 'Verified content creator ready for authentic brand partnerships and campaigns.'}
              </p>

              {/* Social Channels Links */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram.startsWith('http') ? socialLinks.instagram : `https://${socialLinks.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <Instagram size={15} /> Instagram
                  </a>
                )}
                {socialLinks.youtube && (
                  <a
                    href={socialLinks.youtube.startsWith('http') ? socialLinks.youtube : `https://${socialLinks.youtube}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <Youtube size={15} /> YouTube
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter.startsWith('http') ? socialLinks.twitter : `https://${socialLinks.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <Twitter size={15} /> X / Twitter
                  </a>
                )}
                {socialLinks.website && (
                  <a
                    href={socialLinks.website.startsWith('http') ? socialLinks.website : `https://${socialLinks.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <Globe size={15} /> Website
                  </a>
                )}
              </div>
            </div>

            {/* Brand Action CTA */}
            {user?.role === 'brand' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/brand/campaigns/create" className="btn btn-primary">
                  Post Campaign for Creator
                </Link>
                <Link to="/brand/campaigns" className="btn btn-secondary btn-sm">
                  View Your Active Briefs
                </Link>
              </div>
            )}
          </div>

          {/* Quantitative Metrics Banner */}
          <div className="profile-metrics-banner">
            <div className="profile-banner-item">
              <div className="val">{influencer.followerCount?.toLocaleString() || 0}</div>
              <div className="lbl">Audience Reach</div>
            </div>
            <div className="profile-banner-item">
              <div className="val">{influencer.engagementRate || 0}%</div>
              <div className="lbl">Engagement Rate</div>
            </div>
            <div className="profile-banner-item">
              <div className="val">${influencer.collaborationPrice || 0}</div>
              <div className="lbl">Collab Starting Rate</div>
            </div>
            <div className="profile-banner-item">
              <div className="val">
                {influencer.averageRating ? `${influencer.averageRating.toFixed(1)} / 5` : 'N/A'}
              </div>
              <div className="lbl">Average Brand Rating</div>
            </div>
          </div>
        </div>

        {/* Verified Brand Reviews Section */}
        <div className="reviews-section">
          <div className="card-header" style={{ marginBottom: '14px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem' }}>Verified Brand Reviews ({influencer.reviewCount || 0})</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Reviews submitted exclusively by brands following completed campaigns
              </p>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.95rem', marginBottom: '8px' }}>
                No completed collaboration reviews yet.
              </p>
              <span style={{ fontSize: '0.82rem' }}>
                Reviews appear automatically when a brand marks a collaboration as completed.
              </span>
            </div>
          ) : (
            <div>
              {reviews.map((rev) => (
                <div key={rev._id} className="review-item">
                  <div className="review-header">
                    <div>
                      <div className="reviewer-name">{rev.reviewerId?.name || 'Verified Brand Partner'}</div>
                      {rev.campaignId && (
                        <div className="review-campaign">
                          Campaign: {rev.campaignId.title}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d97706', fontWeight: 700 }}>
                      <Star size={16} fill="#d97706" color="#d97706" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>
                  <p className="review-comment">"{rev.comment}"</p>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '8px' }}>
                    Reviewed on {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfileDetail;
