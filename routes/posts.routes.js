const router = require('express').Router();
const Post = require('../models/Post.models');
const Comment = require('../models/Comment.models');
const User = require('../models/User.models');

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

// add comment
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
    res.redirect(`/${postId}`);
  } catch (err) {
    console.log(err.message);
  }
});

router.post('/:postId/:commentId', async (req, res) => {
  const { postId, commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId).populate('author');
    if (comment.author.username === req.user.username) {
      await Comment.findByIdAndDelete(commentId);
      await Post.findByIdAndUpdate(postId, {
        $pullAll: {
          comments: [{ _id: commentId }],
        },
      });
      res.redirect(`/${postId}`);
    }
  } catch (err) {
    console.log(err);
  }
});

router.get('/:userId/add-post', (req, res) => {
  res.render('posts/addPost', { userLogged: req.user });
});

router.post('/:userId/add-post', async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  const { title, content } = req.body;
  try {
    const userPost = await Post.create({
      title,
      author: req.user,
      content,
    });
    console.log(userPost);
    await User.findByIdAndUpdate(userId, {
      $push: { posts: userPost },
    });
    console.log(req.user);
    res.redirect('/user-profile');
  } catch (err) {
    console.log(err.message);
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
