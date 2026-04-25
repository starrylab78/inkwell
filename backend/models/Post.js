const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true },
    excerpt: { type: String, maxlength: 300 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coverImage: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    readTime: { type: Number, default: 1 },
  },
  { timestamps: true }
);

postSchema.pre('save', function (next) {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  this.readTime = Math.ceil(wordCount / wordsPerMinute);
  if (!this.excerpt) {
    this.excerpt = this.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
