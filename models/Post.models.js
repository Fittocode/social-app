const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: [true, 'A username is required'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    required: 'true',
  },
  comments: [
    {
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: { type: String, required: true },
      isLoggedUser: { type: Boolean, default: 'false' },
      createdAt: { type: Date, default: Date.now() },
    },
  ],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Post = model('Post', postSchema);

module.exports = Post;
