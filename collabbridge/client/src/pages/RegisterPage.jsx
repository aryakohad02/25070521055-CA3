import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, AlertCircle, UserPlus, Building2, User } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('brand'); // default 'brand'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your full name or company name.');
      return;
    }

    if (!email.trim()) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter carefully.');
      return;
    }

    setLoading(true);
    try {
      const createdUser = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role
      });

      const redirectPath =
        createdUser.role === 'brand' ? '/brand/dashboard' : '/influencer/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (!err.response
          ? 'Unable to connect to server. Please ensure the backend is running on port 5001.'
          : 'Registration failed. Please check your information.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="brand-logo" style={{ justifyContent: 'center', marginBottom: '12px' }}>
            <div className="logo-icon">
              <Sparkles size={20} />
            </div>
            <div>
              Collab<span className="highlight">Bridge</span>
            </div>
          </div>
          <h2 style={{ fontSize: '1.45rem', marginBottom: '6px' }}>Join CollabBridge</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Choose your account type and start collaborating.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Account Role Selector */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">I want to join as a:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => setRole('brand')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${role === 'brand' ? 'var(--primary)' : 'var(--border-color)'}`,
                  background: role === 'brand' ? 'var(--primary-light)' : 'var(--bg-card)',
                  color: role === 'brand' ? 'var(--primary-dark)' : 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                <Building2 size={22} color={role === 'brand' ? 'var(--primary)' : 'var(--text-muted)'} />
                <span>Brand / Agency</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('influencer')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${role === 'influencer' ? 'var(--secondary)' : 'var(--border-color)'}`,
                  background: role === 'influencer' ? '#f3e8ff' : 'var(--bg-card)',
                  color: role === 'influencer' ? '#6b21a8' : 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                <User size={22} color={role === 'influencer' ? 'var(--secondary)' : 'var(--text-muted)'} />
                <span>Creator / Influencer</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="name">
              {role === 'brand' ? 'Brand or Company Name *' : 'Your Full Name *'}
            </label>
            <input
              id="name"
              type="text"
              className="form-control"
              placeholder={role === 'brand' ? 'e.g. Apex Sportswear' : 'e.g. Jordan Smith'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Work / Contact Email *
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password *
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="form-control"
              placeholder="Re-type password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '14px' }}
            disabled={loading}
          >
            <UserPlus size={18} />
            {loading ? 'Creating Account...' : 'Create CollabBridge Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
