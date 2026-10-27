import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  User,
  Building2,
  Mail,
  Shield,
  Save,
  LogOut,
  CheckCircle,
  AlertCircle,
  Camera,
  Globe,
  Instagram,
  Youtube,
  Twitter
} from 'lucide-react';

const NICHES = [
  'Technology',
  'Fashion',
  'Fitness',
  'Travel',
  'Gaming',
  'Beauty',
  'Lifestyle',
  'Food'
];

const SettingsPage = () => {
  const { user, profile, updateUser, updateProfile, logout } = useAuth();

  // Basic Account Info
  const [name, setName] = useState(user?.name || '');
  const [basicLoading, setBasicLoading] = useState(false);
  const [basicSuccess, setBasicSuccess] = useState('');
  const [basicError, setBasicError] = useState('');

  // Influencer Profile Fields
  const [bio, setBio] = useState(profile?.bio || '');
  const [niche, setNiche] = useState(profile?.niche || 'Technology');
  const [location, setLocation] = useState(profile?.location || '');
  const [followerCount, setFollowerCount] = useState(profile?.followerCount || '');
  const [engagementRate, setEngagementRate] = useState(profile?.engagementRate || '');
  const [collaborationPrice, setCollaborationPrice] = useState(profile?.collaborationPrice || '');
  const [profileImage, setProfileImage] = useState(profile?.profileImage || '');
  const [socialLinks, setSocialLinks] = useState({
    instagram: profile?.socialLinks?.instagram || '',
    youtube: profile?.socialLinks?.youtube || '',
    twitter: profile?.socialLinks?.twitter || '',
    tiktok: profile?.socialLinks?.tiktok || '',
    website: profile?.socialLinks?.website || ''
  });

  const [creatorLoading, setCreatorLoading] = useState(false);
  const [creatorSuccess, setCreatorSuccess] = useState('');
  const [creatorError, setCreatorError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
    if (profile) {
      setBio(profile.bio || '');
      setNiche(profile.niche || 'Technology');
      setLocation(profile.location || '');
      setFollowerCount(profile.followerCount || 0);
      setEngagementRate(profile.engagementRate || 0);
      setCollaborationPrice(profile.collaborationPrice || 0);
      setProfileImage(profile.profileImage || '');
      setSocialLinks({
        instagram: profile.socialLinks?.instagram || '',
        youtube: profile.socialLinks?.youtube || '',
        twitter: profile.socialLinks?.twitter || '',
        tiktok: profile.socialLinks?.tiktok || '',
        website: profile.socialLinks?.website || ''
      });
    }
  }, [user, profile]);

  const handleUpdateBasic = async (e) => {
    e.preventDefault();
    setBasicSuccess('');
    setBasicError('');

    if (!name.trim()) {
      setBasicError('Name cannot be empty.');
      return;
    }

    setBasicLoading(true);
    try {
      const res = await api.put('/auth/updatedetails', { name: name.trim() });
      if (res.data.success) {
        updateUser(res.data.user);
        setBasicSuccess('Account details updated successfully!');
      }
    } catch (err) {
      setBasicError(err.response?.data?.message || 'Failed to update details.');
    } finally {
      setBasicLoading(false);
    }
  };

  const handleUpdateCreatorProfile = async (e) => {
    e.preventDefault();
    setCreatorSuccess('');
    setCreatorError('');

    setCreatorLoading(true);
    try {
      const res = await api.put('/influencers/profile', {
        bio: bio.trim(),
        niche,
        location: location.trim(),
        followerCount: Number(followerCount),
        engagementRate: Number(engagementRate),
        collaborationPrice: Number(collaborationPrice),
        profileImage: profileImage.trim(),
        socialLinks
      });

      if (res.data.success) {
        updateProfile(res.data.profile);
        setCreatorSuccess('Creator profile and marketplace portfolio saved successfully!');
      }
    } catch (err) {
      setCreatorError(err.response?.data?.message || 'Failed to update creator profile.');
    } finally {
      setCreatorLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Account & Profile Settings</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Manage your credentials, role privileges, and creator marketplace card.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Account Information</h3>

        {basicSuccess && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{basicSuccess}</span>
          </div>
        )}

        {basicError && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{basicError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateBasic}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Account Role</label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  textTransform: 'capitalize'
                }}
              >
                {user?.role === 'brand' ? <Building2 size={18} color="var(--primary)" /> : <User size={18} color="var(--secondary)" />}
                <span>{user?.role || 'User'}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-muted)',
                  fontSize: '0.95rem'
                }}
              >
                <Mail size={16} />
                <span>{user?.email}</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="name">
              {user?.role === 'brand' ? 'Brand / Company Name' : 'Full Name'}
            </label>
            <input
              id="name"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button type="submit" className="btn btn-primary btn-sm" disabled={basicLoading}>
              <Save size={16} />
              {basicLoading ? 'Saving...' : 'Update Account'}
            </button>
          </div>
        </form>
      </div>

      {/* Influencer Specific Profile Card */}
      {user?.role === 'influencer' && (
        <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Public Creator Portfolio</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              This information is displayed to brands discovering talent in the Creator Directory.
            </p>
          </div>

          {creatorSuccess && (
            <div className="alert alert-success">
              <CheckCircle size={18} />
              <span>{creatorSuccess}</span>
            </div>
          )}

          {creatorError && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{creatorError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateCreatorProfile}>
            <div className="form-group">
              <label className="form-label" htmlFor="profileImage">
                Profile Image URL
              </label>
              <input
                id="profileImage"
                type="url"
                className="form-control"
                placeholder="https://example.com/avatar.jpg"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
              />
              <span className="form-hint">
                Enter an image URL (e.g. Unsplash or hosted photo). If empty, your initials will be used.
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="niche">
                  Primary Creator Niche *
                </label>
                <select
                  id="niche"
                  className="form-control"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  required
                >
                  {NICHES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="location">
                  Location (City, Country)
                </label>
                <input
                  id="location"
                  type="text"
                  className="form-control"
                  placeholder="e.g. San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="followerCount">
                  Total Followers
                </label>
                <input
                  id="followerCount"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="e.g. 150000"
                  value={followerCount}
                  onChange={(e) => setFollowerCount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="engagementRate">
                  Engagement Rate (%)
                </label>
                <input
                  id="engagementRate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  className="form-control"
                  placeholder="e.g. 5.2"
                  value={engagementRate}
                  onChange={(e) => setEngagementRate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="collaborationPrice">
                  Collab Starting Rate ($)
                </label>
                <input
                  id="collaborationPrice"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="e.g. 850"
                  value={collaborationPrice}
                  onChange={(e) => setCollaborationPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="bio">
                Bio & Creator Pitch
              </label>
              <textarea
                id="bio"
                className="form-control"
                rows="4"
                placeholder="Highlight your content style, audience demographics, past brand achievements..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>

            {/* Social Links */}
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>
                Connected Social Media Links
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Instagram</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://instagram.com/handle"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>YouTube</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://youtube.com/@channel"
                    value={socialLinks.youtube}
                    onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Twitter / X</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://x.com/handle"
                    value={socialLinks.twitter}
                    onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Portfolio / Website</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://mywebsite.com"
                    value={socialLinks.website}
                    onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={creatorLoading}>
                <Save size={16} />
                {creatorLoading ? 'Saving Portfolio...' : 'Save Creator Portfolio'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Logout Security Card */}
      <div className="card" style={{ padding: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>Session & Security</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Log out from this device to end your session.
          </p>
        </div>
        <button onClick={logout} className="btn btn-danger btn-sm">
          <LogOut size={16} />
          Sign Out of CollabBridge
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
