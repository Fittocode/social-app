const router = require('express').Router();
const Post = require('../models/Post.models');
const User = require('../models/User.models');
const checkIsFriend = require('../config/javascript');

router.get('/newsfeed', ensureAuthenticated, async (req, res) => {
  try {
    const otherUsers = await User.find();

    const user = await User.findOne(req.user)
      .populate('posts friends notifications')
      .populate({
        path: 'notifications',
        populate: [
          { path: 'user', model: 'User' },
          { path: 'post', model: 'Post' },
        ],
      });

    let friendsArray = await checkIsFriend(user);
    friendPosts = await Post.find({
      author: { $in: friendsArray },
    }).populate('author');

    res.render('posts/newsfeed', {
      otherUsers: otherUsers,
      userLogged: user,
      notifications: user.notifications.reverse(),
      posts: friendPosts.reverse(),
      currentPage: req.url,
    });
  } catch (err) {
    res.redirect('/please-login');
    console.log(err.message);
  }
});

// get req add post page
router.get('/:userId/add-post', (req, res) => {
  res.render('posts/addPost', { userLogged: req.user });
});

// post req add post
router.post('/:userId/add-post', async (req, res) => {
  const { userId } = req.params;
  const { title, content } = req.body;

  try {
    const userPost = await Post.create({
      title,
      author: req.user,
      content,
    });
    await User.findByIdAndUpdate(userId, {
      $push: { posts: userPost },
    });
    res.redirect('/user-profile');
  } catch (err) {
    console.log(err.message);
  }
});

// get req update post page
router.get(`/update/:postId/`, async (req, res) => {
  const { postId } = req.params;
  try {
    const postDB = await Post.findById(postId);
    res.render('posts/updatePost', { user: req.user, post: postDB });
  } catch (err) {
    console.log(err.message);
  }
});

// post req update post
router.post('/update/:postId', async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  try {
    await Post.findByIdAndUpdate(postId, { title, content });
    res.redirect('/user-profile');
  } catch (err) {
    console.log(err.message);
  }
});

// post req delete post
router.post('/delete/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    await Post.findByIdAndDelete(postId);
    res.redirect('/user-profile');
  } catch (err) {
    console.log(err);
  }
});

// get req post details, comments, etc
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const user = await User.findOne(req.user)
      .populate('posts friends notifications')
      .populate({
        path: 'notifications',
        populate: [
          { path: 'user', model: 'User' },
          { path: 'post', model: 'Post' },
        ],
      });

    const post = await Post.findById(postId)
      .populate('author likes comments')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          model: 'User',
        },
      });

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

    let liked = post.likes.find((o) => o.username === req.user.username)
      ? true
      : false;
    res.render('posts/viewPost', {
      userLogged: user,
      notifications: user.notifications.reverse(),
      post: post,
      status: liked,
      myComment: myComment,
    });
  } catch (err) {
    console.log(err.message);
  }
});

// add like from newsfeed
router.post('/newsfeed/:postId', ensureAuthenticated, async (req, res) => {
  const { postId } = req.params;
  const path = `/newsfeed`;
  await addLike(postId, req, res, path);
});

// post req add like from viewPost
router.post('/:postId/like', ensureAuthenticated, async (req, res) => {
  const { postId } = req.params;
  const path = `/${postId}`;
  await addLike(postId, req, res, path);
});

async function addLike(postId, req, res, path) {
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
}

async function addNotification(postId, req, action) {
  let icon = action === 'liked' ? 'like.png' : 'notification.png';
  const post = await Post.findById(postId).populate('author');
  const userNotifications = await User.findByIdAndUpdate(post.author._id, {
    $push: {
      notifications: { user: req.user, action: action, post: post, icon: icon },
    },
  });
}

async function removeNotification(postId, req, action) {
  let icon = action === 'liked' ? 'like.png' : 'notification.png';
  const post = await Post.findById(postId).populate('author');
  const userNotifications = await User.findByIdAndUpdate(post.author._id, {
    $pull: {
      notifications: { user: req.user, action: action, post: post, icon: icon },
    },
  });
}

// post req add comment
router.post('/:postId/comment', ensureAuthenticated, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  try {
    await Post.findByIdAndUpdate(postId, {
      $push: {
        comments: {
          author: req.user,
          content: content,
        },
      },
    });
    addNotification(postId, req, 'commented on');
    res.redirect(`/${postId}`);
  } catch (err) {
    console.log(err.message);
  }
});

// post req delete comment
router.post('/:postId/:commentId', async (req, res) => {
  const { postId, commentId } = req.params;
  try {
    const post = await Post.findById(postId);
    await Post.findByIdAndUpdate(postId, {
      $pull: {
        comments: { _id: commentId },
      },
    });
    removeNotification(postId, req, 'commented on');
    res.redirect(`/${postId}`);
  } catch (err) {
    console.log(err);
  }
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/please-login');
  }
}

module.exports = router;
