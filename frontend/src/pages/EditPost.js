import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostForm from '../components/PostForm';
import api from '../utils/api';

export default function EditPost() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        if (data.post.author._id !== user._id) {
          navigate('/dashboard');
          return;
        }
        setPost(data.post);
      } catch (err) {
        setError('Post not found or you are not authorized to edit it.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, user, navigate]);

  if (loading) return <div className="page-loading"><div className="spinner spinner-dark" /></div>;
  if (error) return (
    <div className="container" style={{ paddingTop: '60px' }}>
      <div className="alert alert-error">{error}</div>
    </div>
  );

  return <PostForm initialData={post} postId={id} />;
}
