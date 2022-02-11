const addLike = async (postId, req, res, path) => {
  try {
    const post = await Post.findById(postId).populate('likes');
    if (post.likes.find((o) => o.username === req.user.username)) {
      await Post.findByIdAndUpdate(postId, {
        $pullAll: {
          likes: [{ _id: req.user._id }],
        },
      });
      await removeNotification(postId, req, 'liked');
      liked = false;
    } else {
      await Post.findByIdAndUpdate(postId, {
        $push: { likes: req.user },
      });
      await addNotification(postId, req, 'liked');
      liked = true;
    }
    res.redirect(path);
  } catch (err) {
    console.log(err.message);
  }
};

const addNotification = async (postId, req, action) => {
  let icon = action === 'liked' ? 'like.png' : 'notification.png';
  const post = await Post.findById(postId).populate('author');
  await User.findByIdAndUpdate(post.author._id, {
    $push: {
      notifications: { user: req.user, action: action, post: post, icon: icon },
    },
  });
};

const removeNotification = async (postId, req, action) => {
  let icon = action === 'liked' ? 'like.png' : 'notification.png';
  const post = await Post.findById(postId).populate('author');
  await User.findByIdAndUpdate(post.author._id, {
    $pull: {
      notifications: { user: req.user, action: action, post: post, icon: icon },
    },
  });
};

const User = require('../models/User.models');

const checkIfFriend = async (loggedUser) => {
  let friendsArray = [];
  const user = await User.findById(loggedUser._id).populate({
    path: 'friends',
    populate: {
      path: 'posts',
      model: 'Post',
    },
  });
  user.friends.forEach((friend) => {
    friendsArray.push(friend._id.toString());
  });

  return friendsArray;
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
    .populate('posts friends notifications')
    .populate({
      path: 'notifications',
      populate: [
        { path: 'user', model: 'User' },
        { path: 'post', model: 'Post' },
      ],
    });
  return user;
};

module.exports = {
  ensureAuthenticated,
  checkIfFriend,
  findAndPopulateUser,
  addNotification,
  removeNotification,
  addLike,
  checkIfLoggedUserComment,
};
