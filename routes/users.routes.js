const router = require('express').Router();
const User = require('../models/User.models');
const secureGravUrl = require('../config/gravatar');
const checkIsFriend = require('../config/javascript');

router.get('/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne(req.user)
      .populate('posts friends notifications')
      .populate({
        path: 'notifications',
        populate: [
          { path: 'user', model: 'User' },
          { path: 'post', model: 'Post' },
        ],
      });
    // check if friend
    const loggedUser = req.user;
    const friends = await checkIsFriend(loggedUser);
    const friendId = await User.findById(userId);
    let friendStatus;
    if (friends.includes(friendId._id.toString())) {
      friendStatus = true;
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
      friendStatus: friendStatus,
    });
  } catch (err) {
    console.log(err.message);
  }
});

// post req add friend
router.post('/profile/:userId/add-friend', async (req, res) => {
  const { userId } = req.params;
  try {
    await User.findByIdAndUpdate(req.user._id, { $push: { friends: userId } });
    res.redirect('/user-profile');
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
