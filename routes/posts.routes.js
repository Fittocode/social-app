const router = require('express').Router();
const Post = require('../models/Post.models');
const Comment = require('../models/Comment.models');
const User = require('../models/User.models');
require('../routes/auth.routes');

router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId)
      .populate('author comments')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          model: 'User',
        },
      });
    res.render('posts/viewPost', { userLogged: req.user, post: post });
  } catch (err) {
    console.log(err.message);
  }
});

router.post('/:postId', ensureAuthenticated, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  try {
    const comment = await Comment.create({
      author: req.user,
      content,
    });
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment },
    });
    console.log(comment);
    res.redirect(`/${postId}`);
  } catch (err) {
    console.log(err.message);
  }
});

router.get('/:userId/add-post', (req, res) => {
  res.render('posts/addPost', { user: req.user });
});

router.post('/:userId/add-post', async (req, res) => {
  const { userId } = req.params;
  const { title, content } = req.body;
  try {
    const userPost = await Post.create({ title, author: req.user, content });
    await User.findByIdAndUpdate(userId, { $push: { posts: userPost } });
    console.log(userPost);
    res.redirect('/user-profile');
  } catch (err) {
    console.log(err);
  }
});

router.get(`/update/:postId/`, async (req, res) => {
  const { postId } = req.params;
  try {
    const postDB = await Post.findById(postId);
    res.render('posts/updatePost', { user: req.user, post: postDB });
  } catch (err) {
    console.log(err.message);
  }
});

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

router.post('/delete/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    await Post.findByIdAndDelete(postId);
    res.redirect('/user-profile');
  } catch (err) {
    console.log(err);
  }
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

module.exports = router;
