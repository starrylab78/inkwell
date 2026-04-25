const Post = require('../models/Post');

exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim();
    const tag = req.query.tag?.trim();

    let filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }
    if (tag) {
      filter.tags = { $regex: tag, $options: 'i' };
    }

    // For author search we need to lookup first
    let posts;
    let total;
    if (search) {
      // Fetch all matching posts (including author name match) then paginate
      const allPosts = await Post.find(filter)
        .populate('author', 'username email')
        .sort({ createdAt: -1 });

      // Also check author username matches
      const authorMatched = await Post.find()
        .populate('author', 'username email')
        .sort({ createdAt: -1 })
        .then(p => p.filter(post =>
          post.author?.username?.toLowerCase().includes(search.toLowerCase())
        ));

      // Merge and deduplicate
      const merged = [...allPosts];
      authorMatched.forEach(ap => {
        if (!merged.find(p => p._id.toString() === ap._id.toString())) merged.push(ap);
      });
      merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      total = merged.length;
      posts = merged.slice(skip, skip + limit);
    } else {
      total = await Post.countDocuments(filter);
      posts = await Post.find(filter)
        .populate('author', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    res.json({ posts, total, page, pages: Math.ceil(total / limit) || 1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username email');
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    res.json({ post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, tags } = req.body;
    if (!title || !content)
      return res.status(400).json({ message: 'Title and content are required.' });
    const post = await Post.create({ title, content, excerpt, coverImage, tags, author: req.user._id });
    await post.populate('author', 'username email');
    res.status(201).json({ post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized to edit this post.' });

    const { title, content, excerpt, coverImage, tags } = req.body;
    Object.assign(post, { title, content, excerpt, coverImage, tags });
    await post.save();
    await post.populate('author', 'username email');
    res.json({ post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized to delete this post.' });
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
