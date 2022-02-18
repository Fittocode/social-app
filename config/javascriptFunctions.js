const User = require('../models/User.models');
const Post = require('../models/Post.models');

const addLike = async (postId, req) => {
  try {
    let post = await Post.findById(postId).populate('likes');
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
    return [post, liked];
  } catch (err) {
    console.log(err.message);
  }
};

const addComment = async (postId, content, req) => {
  await Post.findByIdAndUpdate(postId, {
    $push: {
      comments: {
        author: req.user,
        content: content,
      },
    },
  });
  await addPostNotification(postId, req, 'commented on');
  const post = await Post.findById(postId).populate({
    path: 'comments',
    populate: {
      path: 'author',
      model: 'User',
    },
  });
  return post;
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
          comment.isLoggedUser = true;
        }
      });
    }
  }
  return myComment;
};

const removeComment = async (postId, commentId, req) => {
  await Post.findByIdAndUpdate(postId, {
    $pull: {
      comments: { _id: commentId },
    },
  });
  await removePostNotification(postId, req, 'commented on');
  const post = await Post.findById(postId).populate({
    path: 'comments',
    populate: {
      path: 'author',
      model: 'User',
    },
  });
  return post;
};

const addPostNotification = async (postId, req, action) => {
  let icon = action === 'liked' ? 'like.png' : 'notification.png';
  const post = await Post.findById(postId).populate('author');
  const user = await User.findById(post.author._id).populate({
    path: 'notifications',
    populate: {
      path: 'post',
      model: 'Post',
    },
  });
  if (post.author._id.toString() !== req.user._id.toString()) {
    await User.findByIdAndUpdate(post.author._id, {
      $push: {
        notifications: {
          user: req.user,
          action: action,
          post: post,
          icon: icon,
        },
      },
    });
  }
};

const removePostNotification = async (postId, req, action) => {
  let icon = action === 'liked' ? 'like.png' : 'notification.png';
  const post = await Post.findById(postId).populate('author');
  await User.findByIdAndUpdate(post.author._id, {
    $pull: {
      notifications: {
        user: req.user,
        action: action,
        post: post,
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
        follow: 'follow',
        icon: 'friend-request-icon.png',
      },
    },
  });
};

const findUsersFollowing = async (req) => {
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

const checkIfPostLikedByUser = (usersFollowingPosts, req) => {
  let postLikes = [];
  usersFollowingPosts.forEach((post) => {
    post.likes.some((like) => like.username === req.user.username)
      ? postLikes.push(true)
      : postLikes.push(false);
  });
  return postLikes;
};

const usersNotFollowed = async (usersFollowing, req) => {
  usersFollowing.push(req.user._id.toString());
  const otherUsers = await User.find({
    _id: {
      $nin: [...usersFollowing],
    },
  });
  return otherUsers;
};

const combinePostandLikedByUserArrays = (usersFollowingPosts, postLikes) => {
  return usersFollowingPosts.map(function (item, i) {
    return {
      postSchema: usersFollowingPosts[i],
      loggedUserLiked: postLikes[i],
    };
  });
};

const findUsersFollowedPosts = async (usersFollowingArray, Post) => {
  let usersFollowingPosts = await Post.find({
    author: { $in: usersFollowingArray },
  }).populate('author likes');
  return usersFollowingPosts;
};

const readPostNotifications = async (User, req) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: { 'notifications.$[].read': true },
  });
  return user;
};

const returnUnreadNotifications = (user) => {
  return user.notifications.filter(
    (notification) => notification.read === false
  );
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
        {
          path: 'post',
          model: 'Post',
        },
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

const displayFirstWords = (content) => {
  let words = [];
  console.log(content);
  for (i = 0; i < content.length; i++) {}
  return words;
};

module.exports = {
  addFollowNotification,
  addLike,
  addComment,
  addPostNotification,
  checkIfPostLikedByUser,
  checkIfLoggedUserComment,
  combinePostandLikedByUserArrays,
  displayFirstWords,
  ensureAuthenticated,
  findAndPopulatePost,
  findAndPopulateUser,
  findUsersFollowing,
  findUsersFollowedPosts,
  readPostNotifications,
  removeComment,
  removePostNotification,
  returnUnreadNotifications,
  usersNotFollowed,
};
