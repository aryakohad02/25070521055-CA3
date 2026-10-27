import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Calendar, DollarSign, Users, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

const CampaignCard = ({ campaign, isBrandOwner = false }) => {
  const brand = campaign.brandId || {};
  const deadlineStr = new Date(campaign.deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="campaign-card">
      <div className="campaign-card-header">
        <span className="badge badge-niche">{campaign.niche}</span>
        {isBrandOwner ? (
          <StatusBadge status={campaign.status} />
        ) : (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {campaign.applicationCount || 0} applied
          </span>
        )}
      </div>

      <h3 className="campaign-card-title">{campaign.title}</h3>

      <div className="campaign-brand-name">
        <Building2 size={15} />
        {brand.name || 'Verified Brand'}
      </div>

      <p className="campaign-description">{campaign.description}</p>

      <div className="campaign-info-box">
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Budget
          </div>
          <div className="campaign-budget-val">${campaign.budget.toLocaleString()}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Deadline
          </div>
          <div className="campaign-deadline-val">{deadlineStr}</div>
        </div>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
        <Link
          to={`/campaigns/${campaign._id}`}
          className="btn btn-primary btn-sm"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          View Details
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
