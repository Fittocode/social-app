const router = require('express').Router();
const Post = require('../models/Post.models');
const Comment = require('../models/Comment.models');
const User = require('../models/User.models');

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
    console.log(req.user);
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
    const post = await Post.findById(postId)
      .populate('author likes comments')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          model: 'User',
        },
      });
    let liked = post.likes.find((o) => o.username === req.user.username)
      ? true
      : false;
    res.render('posts/viewPost', {
      userLogged: req.user,
      post: post,
      status: liked,
    });
  } catch (err) {
    console.log(err.message);
  }
});

// add like
router.post('/:postId/like', ensureAuthenticated, async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId).populate('likes');
    if (post.likes.find((o) => o.username === req.user.username)) {
      await Post.findByIdAndUpdate(postId, {
        $pullAll: {
          likes: [{ _id: req.user._id }],
        },
      });
      liked = false;
    } else {
      await Post.findByIdAndUpdate(postId, {
        $push: { likes: req.user },
      });
      liked = true;
    }
    res.redirect(`/${postId}`);
  } catch (err) {
    console.log(err.message);
  }
});

// post req add comment
router.post('/:postId/comment', ensureAuthenticated, async (req, res) => {
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

// post req delete comment
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

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/please-login');
  }
}

module.exports = router;
