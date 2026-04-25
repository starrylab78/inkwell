import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function PostForm({ initialData = {}, postId = null }) {
  const navigate = useNavigate();
  const isEditing = !!postId;

  const [form, setForm] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    excerpt: initialData.excerpt || '',
    coverImage: initialData.coverImage || '',
    tags: initialData.tags?.join(', ') || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.content.trim()) {
      return setError('Title and content are required.');
    }
    setLoading(true);
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (isEditing) {
        await api.put(`/posts/${postId}`, payload);
      } else {
        await api.post('/posts', payload);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-page">
      <div className="container-sm">
        <div className="editor-header">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '4px' }}>
            {isEditing ? 'Edit Story' : 'New Story'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {isEditing ? 'Make your changes below' : 'Share something worth reading'}
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            className="editor-title-input"
            placeholder="Your story's title…"
            value={form.title}
            onChange={handleChange}
            required
          />

          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              name="content"
              className="form-control"
              placeholder="Write your story here…"
              value={form.content}
              onChange={handleChange}
              style={{ minHeight: '320px' }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Excerpt <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional — auto-generated if empty)</span></label>
            <textarea
              name="excerpt"
              className="form-control"
              placeholder="A short summary of your post…"
              value={form.excerpt}
              onChange={handleChange}
              style={{ minHeight: '80px' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cover Image URL <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
            <input
              type="url"
              name="coverImage"
              className="form-control"
              placeholder="https://example.com/image.jpg"
              value={form.coverImage}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tags <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
            <input
              type="text"
              name="tags"
              className="form-control"
              placeholder="technology, writing, life"
              value={form.tags}
              onChange={handleChange}
            />
            <p className="tag-input-hint">Separate tags with commas</p>
          </div>

          <hr className="divider" />

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-accent" disabled={loading} style={{ padding: '10px 28px' }}>
              {loading ? <><span className="spinner" /> {isEditing ? 'Saving…' : 'Publishing…'}</> : isEditing ? 'Save Changes' : 'Publish Post'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
