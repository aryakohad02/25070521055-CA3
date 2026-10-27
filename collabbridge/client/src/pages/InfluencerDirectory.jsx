import React, { useState, useEffect } from 'react';
import api from '../services/api';
import InfluencerCard from '../components/InfluencerCard';
import { Search, Filter, RotateCcw, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import '../styles/marketplace.css';

const NICHES = [
  'All',
  'Technology',
  'Fashion',
  'Fitness',
  'Travel',
  'Gaming',
  'Beauty',
  'Lifestyle',
  'Food'
];

const InfluencerDirectory = () => {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [search, setSearch] = useState('');
  const [niche, setNiche] = useState('All');
  const [location, setLocation] = useState('');
  const [minFollowers, setMinFollowers] = useState('');
  const [maxFollowers, setMaxFollowers] = useState('');
  const [minEngagement, setMinEngagement] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('followers_desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Advanced filters accordion toggle
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fetchInfluencers = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page,
        limit: 9,
        sort
      };

      if (search.trim()) params.search = search.trim();
      if (niche && niche !== 'All') params.niche = niche;
      if (location.trim()) params.location = location.trim();
      if (minFollowers) params.minFollowers = minFollowers;
      if (maxFollowers) params.maxFollowers = maxFollowers;
      if (minEngagement) params.minEngagement = minEngagement;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get('/influencers', { params });
      if (res.data.success) {
        setInfluencers(res.data.influencers);
        setTotalPages(res.data.pages || 1);
        setTotalCount(res.data.total || 0);
      }
    } catch (err) {
      setError('Failed to fetch creators from database. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when page, niche, sort change
  useEffect(() => {
    fetchInfluencers();
  }, [page, niche, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchInfluencers();
  };

  const handleClearFilters = () => {
    setSearch('');
    setNiche('All');
    setLocation('');
    setMinFollowers('');
    setMaxFollowers('');
    setMinEngagement('');
    setMaxPrice('');
    setSort('followers_desc');
    setPage(1);
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>Creator Discovery Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Find, evaluate, and collaborate with verified influencers across high-performing marketing categories.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <form onSubmit={handleSearchSubmit} className="search-box">
            <Search className="search-box-icon" size={18} />
            <input
              type="text"
              placeholder="Search creators by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {/* Niche Dropdown */}
          <div style={{ minWidth: '150px' }}>
            <select
              className="form-control"
              value={niche}
              onChange={(e) => {
                setNiche(e.target.value);
                setPage(1);
              }}
            >
              {NICHES.map((n) => (
                <option key={n} value={n}>
                  {n === 'All' ? 'All Niches' : n}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div style={{ minWidth: '180px' }}>
            <select
              className="form-control"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              <option value="followers_desc">Most Followers</option>
              <option value="followers_asc">Least Followers</option>
              <option value="engagement_desc">Highest Engagement</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
            </select>
          </div>

          {/* Toggle Advanced Filters Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Filter size={16} />
            {showAdvanced ? 'Hide Filters' : 'More Filters'}
          </button>

          {/* Clear Filters Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleClearFilters}
            title="Reset all filters"
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>

        {/* Advanced Filters Expandable Drawer */}
        {showAdvanced && (
          <div
            className="card"
            style={{
              marginBottom: '28px',
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-color)',
              padding: '20px 24px'
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                alignItems: 'flex-end'
              }}
            >
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Location (City / State)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. San Francisco"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Min Followers</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 50000"
                  value={minFollowers}
                  onChange={(e) => setMinFollowers(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Max Followers</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 500000"
                  value={maxFollowers}
                  onChange={(e) => setMaxFollowers(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Min Engagement (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 4.0"
                  value={minEngagement}
                  onChange={(e) => setMinEngagement(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Max Collab Fee ($)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 1500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setPage(1);
                  fetchInfluencers();
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Showing <strong>{influencers.length}</strong> of <strong>{totalCount}</strong> creator profiles
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger">
            <span>{error}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p style={{ color: 'var(--text-muted)' }}>Querying creator database...</p>
          </div>
        ) : influencers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Users size={28} />
            </div>
            <h3 className="empty-state-title">No creators matched your filters</h3>
            <p className="empty-state-text">
              Try adjusting your search criteria, widening the follower range, or clearing filters.
            </p>
            <button className="btn btn-primary btn-sm" onClick={handleClearFilters}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="influencer-grid">
              {influencers.map((inf) => (
                <InfluencerCard key={inf._id} influencer={inf} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button
                  className="page-btn"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`page-btn ${p === page ? 'active' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="page-btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InfluencerDirectory;
