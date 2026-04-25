import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import api from '../utils/api';

const POPULAR_TAGS = ['technology', 'writing', 'life', 'design', 'science', 'productivity', 'travel', 'health'];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [inputValue, setInputValue] = useState('');
  const debounceRef = useRef(null);

  const fetchPosts = useCallback(async (searchTerm, tag, pageNum) => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({ page: pageNum, limit: 9 });
      if (searchTerm) params.set('search', searchTerm);
      if (tag) params.set('tag', tag);
      const { data } = await api.get(`/posts?${params}`);
      setPosts(data.posts);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
      setActiveTag('');
    }, 400);
  };

  const handleTagClick = (tag) => {
    const next = activeTag === tag ? '' : tag;
    setActiveTag(next);
    setSearch('');
    setInputValue('');
    setPage(1);
  };

  const handleClear = () => {
    setSearch('');
    setInputValue('');
    setActiveTag('');
    setPage(1);
  };

  useEffect(() => {
    fetchPosts(search, activeTag, page);
  }, [search, activeTag, page, fetchPosts]);

  const isFiltering = search || activeTag;

  return (
    <>
      <div className="hero">
        <p className="hero-eyebrow">✦ A Place for Ideas</p>
        <h1 className="hero-title">Where words<br /><em>find their home</em></h1>
        <p className="hero-subtitle">
          Inkwell is a thoughtful blogging platform for writers who care about their craft.
        </p>
        <div className="hero-actions">
          {isAuthenticated ? (
            <Link to="/create" className="btn btn-accent">Start Writing</Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">Start Writing</Link>
              <Link to="/login" className="btn btn-outline">Sign In</Link>
            </>
          )}
        </div>
      </div>

      <div className="container">
        <div className="section">

          {/* Search bar */}
          <div className="search-bar-wrap">
            <div className="search-bar">
              <svg className="search-icon" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search stories by title, author, tag…"
                value={inputValue}
                onChange={handleSearchChange}
              />
              {inputValue && (
                <button className="search-clear" onClick={handleClear} aria-label="Clear search">✕</button>
              )}
            </div>
          </div>

          {/* Tag pills */}
          <div className="tag-pills">
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                className={`tag-pill ${activeTag === tag ? 'tag-pill-active' : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Section header */}
          <div className="section-header" style={{ marginTop: '32px' }}>
            <h2 className="section-title">
              {activeTag ? `#${activeTag}` : search ? `Results for "${search}"` : 'Latest Stories'}
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {!loading && `${total} post${total !== 1 ? 's' : ''}`}
            </span>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="page-loading"><div className="spinner spinner-dark" /></div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <h3>{isFiltering ? 'No results found' : 'No stories yet'}</h3>
              <p style={{ marginBottom: '20px' }}>
                {isFiltering
                  ? 'Try a different search term or browse all stories.'
                  : 'Be the first to share something wonderful.'}
              </p>
              {isFiltering ? (
                <button className="btn btn-outline" onClick={handleClear}>Clear Search</button>
              ) : (
                <Link to="/register" className="btn btn-primary">Start Writing</Link>
              )}
            </div>
          ) : (
            <>
              <div className="posts-grid">
                {posts.map((post) => <PostCard key={post._id} post={post} />)}
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '48px', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ← Previous
                  </button>
                  <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="btn btn-outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
