import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  LayoutDashboard,
  Megaphone,
  PlusCircle,
  Users,
  FileText,
  UserCheck,
  Settings,
  LogOut,
  Compass
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isBrand = user?.role === 'brand';

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <Link to="/" className="brand-logo">
          <div className="logo-icon">
            <Sparkles size={18} />
          </div>
          <div>
            Collab<span className="highlight">Bridge</span>
          </div>
        </Link>
      </div>

      <div className="sidebar-content">
        <div className="sidebar-section-title">Navigation</div>

        {isBrand ? (
          <>
            <NavLink
              to="/brand/dashboard"
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </NavLink>

            <NavLink
              to="/brand/campaigns"
              end
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Megaphone size={18} />
              <span>My Campaigns</span>
            </NavLink>

            <NavLink
              to="/brand/campaigns/create"
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <PlusCircle size={18} />
              <span>Create Campaign</span>
            </NavLink>

            <NavLink
              to="/influencers"
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Users size={18} />
              <span>Discover Creators</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/influencer/dashboard"
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </NavLink>

            <NavLink
              to="/campaigns"
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Compass size={18} />
              <span>Campaign Marketplace</span>
            </NavLink>

            <NavLink
              to="/influencer/applications"
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <FileText size={18} />
              <span>My Applications</span>
            </NavLink>

            {user && (
              <NavLink
                to={`/influencers/${user._id}`}
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <UserCheck size={18} />
                <span>My Public Profile</span>
              </NavLink>
            )}
          </>
        )}

        <div className="sidebar-section-title" style={{ marginTop: '16px' }}>Account</div>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <Settings size={18} />
          <span>Profile & Settings</span>
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <div className="user-badge">
          <div className="avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-badge-info">
            <h5>{user?.name || 'User'}</h5>
            <span>{user?.role || 'Member'}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-secondary btn-sm"
          style={{ padding: '8px' }}
          title="Sign Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
