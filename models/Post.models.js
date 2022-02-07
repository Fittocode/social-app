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
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likes: {
    type: Number,
    default: 0,
  },
});

const Post = model('Post', postSchema);

module.exports = Post;
