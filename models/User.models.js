const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const slugify = require('slugify');

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'A username is required'],
  },
  password: {
    type: String,
    required: [true, 'A password is required'],
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  favoritePosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  slug: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.pre('validate', function (next) {
  if (this.username) {
    this.slug = slugify(this.username, { lower: true, strict: true });
  }

  next();
});

const User = model('User', userSchema);

module.exports = User;
