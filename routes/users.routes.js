const router = require('express').Router();
const User = require('../models/User.models');
const secureGravUrl = require('../config/gravatar');

// js functions
const {
  addFollowNotification,
  checkIfFollowing,
  findAndPopulateUser,
} = require('../config/javascriptFunctions');

router.get('/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await findAndPopulateUser(User, req);
    // check if following
    const usersFollowing = await checkIfFollowing(req);
    const userFollowedId = await User.findById(userId);
    let followingStatus;
    if (usersFollowing.includes(userFollowedId._id.toString())) {
      followingStatus = true;
    }
    // if loggedUser public profile, redirect to loggedUser profile
    if (userId === req.user._id.toString()) {
      res.redirect('/user-profile');
    }
    const profile = await User.findById(userId).populate('posts');
    const posts = profile.posts.reverse();

    res.render('users/publicUserProfile', {
      userLogged: req.user,
      gravatar: secureGravUrl(profile, '200'),
      notifications: user.notifications.reverse(),
      profile: profile,
      posts: posts,
      followingStatus: followingStatus,
    });
  } catch (err) {
    console.log(err.message);
  }
});

// post req follow user
router.post('/profile/:userId/follow', async (req, res) => {
  const { userId } = req.params;
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $push: { usersFollowed: userId },
    });
    await addFollowNotification(userId, req);
    res.redirect('/newsfeed');
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
