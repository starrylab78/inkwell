import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function ViewPost() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data.post);
      } catch (err) {
        setError('Post not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${id}`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
      setDeleting(false);
    }
  };

  const isAuthor = isAuthenticated && user?._id === post?.author?._id;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return <div className="page-loading"><div className="spinner spinner-dark" /></div>;

  if (error) return (
    <div className="container" style={{ paddingTop: '60px' }}>
      <div className="alert alert-error">{error}</div>
      <Link to="/" className="btn btn-outline" style={{ marginTop: '16px' }}>← Back to Home</Link>
    </div>
  );

  return (
    <div className="post-page">
      <div className="container-sm">
        <Link to="/" className="btn btn-ghost" style={{ marginBottom: '32px', paddingLeft: 0 }}>
          ← All Stories
        </Link>

        <article>
          <header className="post-header">
            {post.tags?.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                {post.tags.map((tag) => (
                  <span key={tag} style={{
                    display: 'inline-block', marginRight: '8px', fontSize: '0.75rem',
                    fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)'
                  }}>{tag}</span>
                ))}
              </div>
            )}

            <h1 className="post-title">{post.title}</h1>

            <div className="post-meta">
              <span>By <strong>{post.author?.username}</strong></span>
              <span className="post-meta-dot" />
              <span>{formatDate(post.createdAt)}</span>
              <span className="post-meta-dot" />
              <span>{post.readTime} min read</span>
            </div>

            {isAuthor && (
              <div className="post-actions">
                <Link to={`/edit/${post._id}`} className="btn btn-outline">Edit</Link>
                <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                  {deleting ? <><span className="spinner" style={{ borderTopColor: 'var(--accent)' }} /> Deleting…</> : 'Delete'}
                </button>
              </div>
            )}
          </header>

          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '4px', marginBottom: '40px' }}
            />
          )}

          <hr className="divider" />

          <div className="post-content">
            {post.content.split('\n').map((para, i) =>
              para.trim() ? <p key={i}>{para}</p> : <br key={i} />
            )}
          </div>
        </article>

        <hr className="divider" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <Link to="/" className="btn btn-outline">← More Stories</Link>
          {isAuthenticated && !isAuthor && (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Enjoying Inkwell? <Link to="/create" style={{ color: 'var(--accent)', fontWeight: 500 }}>Write your own →</Link>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
