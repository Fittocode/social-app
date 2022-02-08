const router = require('express').Router();
const Post = require('../models/Post.models');
const User = require('../models/User.models');

router.get('/', async (req, res) => {
  try {
    const otherUsers = await User.find();
    const user = await User.findById(req.user._id).populate({
      path: 'friends',
      populate: {
        path: 'posts',
        model: 'Post',
      },
    });
    let friendsArray = [];
    user.friends.forEach((friend) => {
      friendsArray.push(friend._id);
    });
    const friendPosts = await Post.find({
      author: { $in: friendsArray },
    }).populate('author');

    res.render('index', {
      otherUsers: otherUsers,
      userLogged: req.user,
      posts: friendPosts,
    });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
