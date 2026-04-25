import React from 'react';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="card post-card">
      <div className="post-card-body">
        {post.tags?.length > 0 && (
          <span className="post-card-tag">{post.tags[0]}</span>
        )}
        <h2 className="post-card-title">
          <Link to={`/post/${post._id}`}>{post.title}</Link>
        </h2>
        <p className="post-card-excerpt">{post.excerpt}</p>
      </div>
      <div className="post-card-footer">
        <span>By <strong>{post.author?.username || 'Unknown'}</strong></span>
        <span style={{ display: 'flex', gap: '12px' }}>
          <span>{post.readTime} min read</span>
          <span>{date}</span>
        </span>
      </div>
    </div>
  );
}
