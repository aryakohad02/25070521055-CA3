import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, AlertCircle, LogIn } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide your email and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedInUser = await login(email.trim(), password);
      // Redirect to correct dashboard according to role
      const redirectPath =
        loggedInUser.role === 'brand' ? '/brand/dashboard' : '/influencer/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (!err.response
          ? 'Unable to connect to server. Please ensure the backend is running on port 5001.'
          : 'Invalid email or password. Please try again.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for demo testing
  const handleQuickFill = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="brand-logo" style={{ justifyContent: 'center', marginBottom: '12px' }}>
            <div className="logo-icon">
              <Sparkles size={20} />
            </div>
            <div>
              Collab<span className="highlight">Bridge</span>
            </div>
          </div>
          <h2 style={{ fontSize: '1.45rem', marginBottom: '6px' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to access your brand or creator dashboard.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px' }}
            disabled={loading}
          >
            <LogIn size={18} />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Fast Fill Pill Buttons */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px' }}>
            One-Click Demo Fill
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickFill('brand@auraaudio.com', 'brand')}
              style={{ fontSize: '0.78rem' }}
            >
              Demo Brand (Aura Audio)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickFill('marcus@techcreator.io', 'influencer')}
              style={{ fontSize: '0.78rem' }}
            >
              Demo Creator (Marcus)
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
