const router = require('express').Router();
const User = require('../models/User.models');

router.get('/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const profile = await User.findById(userId).populate('posts');
    const posts = profile.posts.reverse();
    res.render('users/publicUserProfile', {
      userLogged: req.user,
      profile: profile,
      posts: posts,
    });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
