import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CampaignCard from '../components/CampaignCard';
import { Search, Compass, ChevronLeft, ChevronRight, RotateCcw, Filter } from 'lucide-react';
import '../styles/marketplace.css';

const NICHES = [
  'All',
  'Technology',
  'Fashion',
  'Fitness',
  'Travel',
  'Gaming',
  'Beauty',
  'Lifestyle'
];

const CampaignMarketplace = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [niche, setNiche] = useState('All');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page,
        limit: 9,
        status: 'published' // Marketplace only shows published
      };

      if (search.trim()) params.search = search.trim();
      if (niche && niche !== 'All') params.niche = niche;
      if (minBudget) params.minBudget = minBudget;
      if (maxBudget) params.maxBudget = maxBudget;
      if (sort === 'budget_desc') params.sort = 'budget_desc';
      else if (sort === 'budget_asc') params.sort = 'budget_asc';
      else if (sort === 'deadline_asc') params.sort = 'deadline_asc';

      const res = await api.get('/campaigns', { params });
      if (res.data.success) {
        setCampaigns(res.data.campaigns);
        setTotalPages(res.data.pages || 1);
        setTotalCount(res.data.total || 0);
      }
    } catch (err) {
      setError('Unable to load campaigns from the database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [page, niche, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCampaigns();
  };

  const handleClearFilters = () => {
    setSearch('');
    setNiche('All');
    setMinBudget('');
    setMaxBudget('');
    setSort('newest');
    setPage(1);
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>Campaign Marketplace</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Discover paid brand collaboration briefs, review deliverable guidelines, and submit your proposal.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <form onSubmit={handleSearchSubmit} className="search-box">
            <Search className="search-box-icon" size={18} />
            <input
              type="text"
              placeholder="Search campaigns by title or description..."
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
                  {n === 'All' ? 'All Categories' : n}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Quick Filters */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              placeholder="Min $"
              className="form-control"
              style={{ width: '90px' }}
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
            />
            <span style={{ color: 'var(--text-light)' }}>-</span>
            <input
              type="number"
              placeholder="Max $"
              className="form-control"
              style={{ width: '90px' }}
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setPage(1);
                fetchCampaigns();
              }}
            >
              Apply
            </button>
          </div>

          {/* Sorting Dropdown */}
          <div style={{ minWidth: '160px' }}>
            <select
              className="form-control"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              <option value="newest">Newest First</option>
              <option value="budget_desc">Highest Budget</option>
              <option value="budget_asc">Lowest Budget</option>
              <option value="deadline_asc">Closing Soon</option>
            </select>
          </div>

          {/* Clear Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleClearFilters}
            title="Reset filters"
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Showing <strong>{campaigns.length}</strong> of <strong>{totalCount}</strong> active campaign listings
          </span>
        </div>

        {error && (
          <div className="alert alert-danger">
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p style={{ color: 'var(--text-muted)' }}>Querying open brand briefs...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Compass size={28} />
            </div>
            <h3 className="empty-state-title">No campaigns match your search</h3>
            <p className="empty-state-text">
              Try removing category filters or widening your budget parameters to discover more brand listings.
            </p>
            <button className="btn btn-primary btn-sm" onClick={handleClearFilters}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="campaign-grid">
              {campaigns.map((camp) => (
                <CampaignCard key={camp._id} campaign={camp} />
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

export default CampaignMarketplace;
