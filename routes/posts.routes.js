const router = require('express').Router();
const Post = require('../models/Post.models');
const User = require('../models/User.models');

router.get('/:userId/add-post', (req, res) => {
  res.render('posts/add-post', { user: req.user });
});

router.post('/:userId/add-post', async (req, res) => {
  const { userId } = req.params;
  const { title, content } = req.body;
  try {
    const userPost = await Post.create({ title, author: req.user, content });
    await User.findByIdAndUpdate(userId, { $push: { posts: userPost } });
    res.redirect('/user-profile');
  } catch (err) {
    console.log(err);
  }
});

router.get(`/:postId/update`, async (req, res) => {
  const { postId } = req.params;
  try {
    const postDB = await Post.findById(postId);
    console.log(postDB);
    console.log(postDB.content);
    res.render('posts/update-post', { user: req.user, post: postDB });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
