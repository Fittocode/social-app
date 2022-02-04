const router = require('express').Router();
const Post = require('../models/Post.models');
const User = require('../models/User.models');

router.get('/:id/add-post', (req, res) => {
  res.render('posts/add-post', { user: req.user });
});

router.post('/:id/add-post', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const userPost = await Post.create({ title, author: req.user, content });
    await User.findByIdAndUpdate(id, { $push: { posts: userPost } });
    res.redirect('/user-profile');
  } catch (err) {
    console.log(err);
  }
});

router.get('/users/:id/post', (req, res) => {});

module.exports = router;
