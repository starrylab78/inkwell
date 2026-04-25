import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const { data } = await api.get('/posts/my-posts');
        setPosts(data.posts);
      } catch (err) {
        setError('Failed to load your posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    setDeletingId(postId);
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">My Stories</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Welcome back, <strong>{user?.username}</strong> — {posts.length} post{posts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/create" className="btn btn-accent">+ New Post</Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="page-loading"><div className="spinner spinner-dark" /></div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <h3>No posts yet</h3>
            <p style={{ marginBottom: '20px' }}>Your stories will appear here once you write them.</p>
            <Link to="/create" className="btn btn-primary">Write Your First Post</Link>
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <div key={post._id} className="dashboard-post-item">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="dashboard-post-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <Link to={`/post/${post._id}`}>{post.title}</Link>
                  </div>
                  <div className="dashboard-post-date">
                    {formatDate(post.createdAt)} · {post.readTime} min read
                    {post.tags?.length > 0 && <span style={{ marginLeft: '8px', color: 'var(--accent)' }}>#{post.tags[0]}</span>}
                  </div>
                </div>
                <div className="dashboard-post-actions">
                  <button className="btn btn-outline" onClick={() => navigate(`/edit/${post._id}`)}>Edit</button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(post._id)}
                    disabled={deletingId === post._id}
                  >
                    {deletingId === post._id ? <span className="spinner" style={{ borderTopColor: 'var(--accent)' }} /> : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
