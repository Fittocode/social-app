const router = require('express').Router();
const User = require('../models/User.models');
const checkIsFriend = require('../config/javascript');

router.get('/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // check if friend
    const loggedUser = req.user;
    const friends = await checkIsFriend(loggedUser);
    const friendId = await User.findById(userId);
    let friendStatus;
    console.log(friends[0]);
    console.log(friendId._id);
    console.log(friends[0] == friendId);
    if (friends.includes(friendId.username)) {
      friendStatus = true;
    } else {
      friendStatus = false;
    }

    const profile = await User.findById(userId).populate('posts');
    const posts = profile.posts.reverse();
    res.render('users/publicUserProfile', {
      userLogged: req.user,
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
