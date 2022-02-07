const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commentSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    required: 'true',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;
