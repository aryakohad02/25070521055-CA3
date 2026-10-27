import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Link to="/" className="brand-logo" style={{ marginBottom: '14px', display: 'inline-flex' }}>
              <div className="logo-icon">
                <Sparkles size={18} />
              </div>
              <div>
                Collab<span className="highlight">Bridge</span>
              </div>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '320px', lineHeight: '1.6' }}>
              The modern influencer marketing platform connecting leading brands and high-performing digital creators for verified, impactful collaborations.
            </p>
          </div>

          <div className="footer-col">
            <h4>For Brands</h4>
            <ul className="footer-links">
              <li><Link to="/influencers">Discover Creators</Link></li>
              <li><Link to="/register">Post a Campaign</Link></li>
              <li><Link to="/brand/dashboard">Brand Dashboard</Link></li>
              <li><Link to="/influencers?niche=Technology">Tech Creators</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>For Creators</h4>
            <ul className="footer-links">
              <li><Link to="/campaigns">Browse Campaigns</Link></li>
              <li><Link to="/register">Create Profile</Link></li>
              <li><Link to="/influencer/dashboard">Creator Dashboard</Link></li>
              <li><Link to="/campaigns?niche=Fashion">Fashion Collaborations</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <ul className="footer-links">
              <li><Link to="/">How It Works</Link></li>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><a href="#features">Key Features</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CollabBridge Inc. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Built for modern influencer partnerships <Heart size={14} color="#ef4444" fill="#ef4444" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
