import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardRoute = () => {
    if (!user) return '/login';
    return user.role === 'brand' ? '/brand/dashboard' : '/influencer/dashboard';
  };

  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="brand-logo">
          <div className="logo-icon">
            <Sparkles size={20} />
          </div>
          <div>
            Collab<span className="highlight">Bridge</span>
          </div>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/influencers"
                className={`nav-link ${location.pathname.startsWith('/influencers') ? 'active' : ''}`}
              >
                Explore Influencers
              </Link>
            </li>
            <li>
              <Link
                to="/campaigns"
                className={`nav-link ${location.pathname.startsWith('/campaigns') ? 'active' : ''}`}
              >
                Campaigns
              </Link>
            </li>
          </ul>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to={getDashboardRoute()} className="btn btn-primary btn-sm">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
