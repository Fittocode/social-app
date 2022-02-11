const router = require('express').Router();
const Post = require('../models/Post.models');
const User = require('../models/User.models');
// javascript functions
const {
  ensureAuthenticated,
  checkIfFriend,
  findAndPopulateUser,
  addNotification,
  removeNotification,
  addLike,
  checkIfLoggedUserComment,
} = require('../config/javascriptFunctions');

router.get('/newsfeed', ensureAuthenticated, async (req, res) => {
  try {
    const otherUsers = await User.find();
    const user = await findAndPopulateUser(User, req);

    let friendsArray = await checkIfFriend(user);
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
    const user = await findAndPopulateUser(User, req);
    const post = await Post.findById(postId)
      .populate('author likes comments')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          model: 'User',
        },
      });

    const myComment = checkIfLoggedUserComment(post, req);

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

module.exports = router;
