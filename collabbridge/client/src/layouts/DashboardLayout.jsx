import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Menu, X, ExternalLink } from 'lucide-react';
import '../styles/dashboard.css';

const DashboardLayout = ({ allowedRole }) => {
  const { user, loading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check if specific role is mandated
  if (allowedRole && user.role !== allowedRole) {
    const redirectUrl = user.role === 'brand' ? '/brand/dashboard' : '/influencer/dashboard';
    return <Navigate to={redirectUrl} replace />;
  }

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/brand/dashboard')) return 'Brand Performance Overview';
    if (path.includes('/brand/campaigns/create')) return 'Create New Campaign';
    if (path.includes('/brand/campaigns')) return 'Manage Your Campaigns';
    if (path.includes('/influencer/dashboard')) return 'Creator Workspace';
    if (path.includes('/influencer/applications')) return 'My Collaboration Applications';
    if (path.includes('/settings')) return 'Account & Profile Settings';
    return 'Dashboard';
  };

  return (
    <div className="dashboard-container">
      <div className={`dashboard-sidebar-wrapper ${mobileSidebarOpen ? 'open' : ''}`}>
        <Sidebar />
      </div>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ display: 'none' }} // Visible on mobile via CSS
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              {mobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h1 className="topbar-title">{getPageTitle()}</h1>
          </div>

          <div className="topbar-actions">
            <span
              className={`badge ${user.role === 'brand' ? 'badge-published' : 'badge-accepted'}`}
              style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}
            >
              {user.role} Portal
            </span>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              title="Open public marketplace in new tab"
            >
              <ExternalLink size={14} />
              Marketplace
            </a>
          </div>
        </header>

        <main className="dashboard-view">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
