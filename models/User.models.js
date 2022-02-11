const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema, model } = mongoose;
const slugify = require('slugify');

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'A username is required'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'An email is required'],
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'A password is required'],
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    notifications: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        action: { type: String },
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
        icon: { type: String },
      },
    ],
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('validate', function (next) {
  if (this.username) {
    this.slug = slugify(this.username, { lower: true, strict: true });
  }
  next();
});

userSchema.plugin(uniqueValidator);

const User = model('User', userSchema);

module.exports = User;
