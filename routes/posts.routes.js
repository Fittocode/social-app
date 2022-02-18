const router = require('express').Router();
const Post = require('../models/Post.models');
const User = require('../models/User.models');

// js functions
const {
  addLike,
  addComment,
  checkIfPostLikedByUser,
  checkIfLoggedUserComment,
  combinePostandLikedByUserArrays,
  displayFirstWords,
  ensureAuthenticated,
  findAndPopulateUser,
  findAndPopulatePost,
  findUsersFollowing,
  findUsersFollowedPosts,
  removePostNotification,
  removeComment,
  returnUnreadNotifications,
  usersNotFollowed,
} = require('../config/serverJSFunctions');

// req get newsfeed
router.get('/newsfeed', ensureAuthenticated, async (req, res) => {
  try {
    const user = await findAndPopulateUser(User, req);
    const unreadNotifications = returnUnreadNotifications(user);
    const usersFollowing = await findUsersFollowing(req);
    const otherUsers = await usersNotFollowed(usersFollowing, req);
    const usersFollowingPosts = await findUsersFollowedPosts(
      usersFollowing,
      Post
    );
    const postLikes = checkIfPostLikedByUser(usersFollowingPosts, req);
    const postArray = combinePostandLikedByUserArrays(
      usersFollowingPosts,
      postLikes
    );

    res.render('posts/newsfeed', {
      otherUsers: otherUsers,
      userLogged: user,
      postArray: postArray,
      notifications: unreadNotifications.length,
      currentPage: req.url,
    });
  } catch (err) {
    res.redirect('/please-login');
    console.log(err.message);
  }
});

// get req add post page
router.get('/add-post/:userId', (req, res) => {
  res.render('posts/addPost', { userLogged: req.user });
});

// post req add post
router.post('/add-post/:userId', async (req, res) => {
  const { userId } = req.params;
  const { content } = req.body;

  try {
    const userPost = await Post.create({
      author: req.user,
      content,
    });
    await User.findByIdAndUpdate(userId, {
      $push: { posts: userPost },
    });
    res.redirect('/newsfeed');
  } catch (err) {
    console.log(err.message);
  }
});

// get req update post page
router.get(`/update/:postId/`, ensureAuthenticated, async (req, res) => {
  const { postId } = req.params;
  try {
    const postDB = await Post.findById(postId);
    res.render('posts/updatePost', { userLogged: req.user, post: postDB });
  } catch (err) {
    console.log(err.message);
  }
});

// post req update post
router.post('/update/:postId', async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  try {
    await Post.findByIdAndUpdate(postId, { content });
    res.redirect('/user-profile');
  } catch (err) {
    console.log(err.message);
  }
});

// post req delete post
router.post('/delete/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    await removePostNotification(postId, req, 'commented on');
    await removePostNotification(postId, req, 'liked');
    await Post.findByIdAndDelete(postId);
    res.redirect('/newsfeed');
  } catch (err) {
    console.log(err);
  }
});

// get req post details, comments, etc
router.get('/view-post/:postId', ensureAuthenticated, async (req, res) => {
  const { postId } = req.params;
  try {
    const user = await findAndPopulateUser(User, req);
    const unreadNotifications = returnUnreadNotifications(user);
    const post = await findAndPopulatePost(Post, postId);

    let liked = post.likes.find((o) => o.username === req.user.username)
      ? true
      : false;

    // displayFirstWords(post.content);
    checkIfLoggedUserComment(post, req);

    res.render('posts/viewPost', {
      userLogged: user,
      notifications: unreadNotifications.length,
      post: post,
      status: liked,
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
router.post('/like/:postId', ensureAuthenticated, async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await addLike(postId, req, res);
    res.send(post);
  } catch (err) {
    console.log(err.message);
  }
});

// post req add comment
router.post('/comment/:postId', ensureAuthenticated, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  try {
    const post = await addComment(postId, content, req);
    res.status(201).json(post);
  } catch (err) {
    console.log(err.message);
  }
});

// post req delete comment
router.post('/delete/:postId/:commentId/', async (req, res) => {
  const { postId, commentId } = req.params;
  try {
    const post = await removeComment(postId, commentId, req);
    res.send(post);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
