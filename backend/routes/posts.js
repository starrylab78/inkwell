const express = require('express');
const router = express.Router();
const { getAllPosts, getPost, createPost, updatePost, deletePost, getMyPosts } = require('../controllers/postController');
const { protect } = require('../middleware/auth');

router.get('/', getAllPosts);
router.get('/my-posts', protect, getMyPosts);
router.get('/:id', getPost);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
