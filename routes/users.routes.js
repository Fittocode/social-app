const router = require('express').Router();
const User = require('../models/User.models');

router.get('/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const profile = await User.findById(userId).populate('posts');
    res.render('users/publicUserProfile', { profile: profile });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
