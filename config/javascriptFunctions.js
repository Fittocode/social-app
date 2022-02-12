const User = require('../models/User.models');
const Post = require('../models/Post.models');

const addLike = async (postId, req, res, path) => {
  try {
    const post = await Post.findById(postId).populate('likes');
    if (post.likes.find((o) => o.username === req.user.username)) {
      await Post.findByIdAndUpdate(postId, {
        $pullAll: {
          likes: [{ _id: req.user._id }],
        },
      });
      await removePostNotification(postId, req, 'liked');
      liked = false;
    } else {
      await Post.findByIdAndUpdate(postId, {
        $push: { likes: req.user },
      });
      await addPostNotification(postId, req, 'liked');
      liked = true;
    }
    res.send(post);
  } catch (err) {
    console.log(err.message);
  }
};

const addPostNotification = async (postId, req, action) => {
  let icon = action === 'liked' ? 'like.png' : 'notification.png';
  const post = await Post.findById(postId).populate('author');
  await User.findByIdAndUpdate(post.author._id, {
    $push: {
      notifications: {
        user: req.user,
        action: action,
        form: { post: post },
        icon: icon,
      },
    },
  });
};

const removePostNotification = async (postId, req, action) => {
  let icon = action === 'liked' ? 'like.png' : 'notification.png';
  const post = await Post.findById(postId).populate('author');
  await User.findByIdAndUpdate(post.author._id, {
    $pull: {
      notifications: {
        user: req.user,
        action: action,
        form: { post: post },
        icon: icon,
      },
    },
  });
};

const addFollowNotification = async (userId, req) => {
  await User.findByIdAndUpdate(userId, {
    $push: {
      notifications: {
        user: req.user,
        action: 'followed',
        form: { follow: 'follow' },
        icon: 'friend-request-icon.png',
      },
    },
  });
};

const checkIfFollowing = async (req) => {
  let usersFollowingArray = [];
  const user = await User.findById(req.user._id).populate({
    path: 'usersFollowed',
    populate: {
      path: 'posts',
      model: 'Post',
    },
  });
  user.usersFollowed.forEach((user) => {
    usersFollowingArray.push(user._id.toString());
  });

  return usersFollowingArray;
};

const checkIfLoggedUserComment = (post, req) => {
  let myComment;
  let userComments = post.comments.filter(
    (comment) => comment.author.username === req.user.username
  );

  if (post.comments.length > 0) {
    if (userComments) {
      userComments.forEach((comment) => {
        if (comment.author._id.toString() === req.user._id.toString()) {
          comment.isLoggedUser = 'true';
        }
      });
    }
  }
  return myComment;
};

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/please-login');
  }
};

const findAndPopulateUser = async (User, req) => {
  const user = await User.findOne(req.user)
    .populate('posts usersFollowed notifications')
    .populate({
      path: 'notifications',
      populate: [
        { path: 'user', model: 'User' },
        { path: 'post', model: 'Post' },
      ],
    });
  return user;
};

const findAndPopulatePost = async (Post, postId) => {
  const post = await Post.findById(postId)
    .populate('author likes comments')
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
        model: 'User',
      },
    });
  return post;
};

module.exports = {
  ensureAuthenticated,
  checkIfFollowing,
  findAndPopulateUser,
  addPostNotification,
  addFollowNotification,
  removePostNotification,
  addLike,
  checkIfLoggedUserComment,
  findAndPopulatePost,
};
