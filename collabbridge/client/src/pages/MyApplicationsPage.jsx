import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { FileText, Compass, ExternalLink, Calendar, DollarSign, Building2 } from 'lucide-react';

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await api.get('/applications/my');
        if (res.data.success) {
          setApplications(res.data.applications);
        }
      } catch (err) {
        setError('Failed to load your applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)' }}>Retrieving your collaboration applications...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>My Applications & Collaborations</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Track the status of your campaign pitches and monitor active brand partnerships.
          </p>
        </div>
        <Link to="/campaigns" className="btn btn-primary">
          <Compass size={18} />
          Explore Marketplace
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">
          <span>{error}</span>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FileText size={28} />
          </div>
          <h3 className="empty-state-title">No applications submitted yet</h3>
          <p className="empty-state-text">
            When you pitch for open brand campaigns, your proposals and collaboration statuses will be tracked here.
          </p>
          <Link to="/campaigns" className="btn btn-primary btn-sm">
            Browse Open Campaigns
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Campaign Brief</th>
                  <th>Brand Partner</th>
                  <th>Proposed Rate</th>
                  <th>Proposal Pitch</th>
                  <th>Status</th>
                  <th>Submitted Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <Link
                        to={`/campaigns/${app.campaignId?._id}`}
                        style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}
                      >
                        {app.campaignId?.title || 'Campaign'}
                      </Link>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Budget: ${app.campaignId?.budget?.toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <Building2 size={14} color="var(--primary)" />
                        {app.campaignId?.brandId?.name || 'Brand Partner'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {app.campaignId?.brandId?.email}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      ${app.proposedPrice}
                    </td>
                    <td style={{ maxWidth: '280px' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        {app.proposal}
                      </p>
                    </td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(app.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
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
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
