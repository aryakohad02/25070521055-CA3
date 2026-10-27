import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight } from 'lucide-react';

const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toString();
};

const InfluencerCard = ({ influencer }) => {
  const user = influencer.userId || {};
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'IN';

  return (
    <div className="influencer-card">
      <div className="influencer-card-top">
        {influencer.profileImage ? (
          <img
            src={influencer.profileImage}
            alt={user.name || 'Influencer'}
            className="avatar avatar-lg"
          />
        ) : (
          <div className="avatar avatar-lg">{initials}</div>
        )}
        <div className="influencer-meta">
          <h3>{user.name || 'Influencer'}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-niche">{influencer.niche || 'Creator'}</span>
            {influencer.location && (
              <span className="influencer-location">
                <MapPin size={13} />
                {influencer.location}
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="influencer-bio-snippet">
        {influencer.bio || 'Digital content creator passionate about authentic brand storytelling and high-impact audience engagement.'}
      </p>

      <div className="influencer-metrics-row">
        <div className="metric-item">
          <div className="metric-label">Followers</div>
          <div className="metric-val">{formatNumber(influencer.followerCount)}</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">Engagement</div>
          <div className="metric-val">{influencer.engagementRate || 0}%</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">Collab Rate</div>
          <div className="metric-val">${influencer.collaborationPrice || 0}</div>
        </div>
      </div>

      <div className="influencer-card-footer">
        <div className="rating-badge">
          <Star size={15} fill={influencer.averageRating ? '#d97706' : 'none'} color="#d97706" />
          <span>
            {influencer.averageRating ? influencer.averageRating.toFixed(1) : 'New'}
            {influencer.reviewCount > 0 && ` (${influencer.reviewCount})`}
          </span>
        </div>

        <Link
          to={`/influencers/${user._id || influencer._id}`}
          className="btn btn-primary btn-sm"
        >
          View Profile
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default InfluencerCard;
