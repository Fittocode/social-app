const router = require('express').Router();
const Post = require('../models/Post.models');

router.get('/', async (req, res) => {
  try {
    const allPosts = (await Post.find().populate('author')).reverse();
    res.render('index', { userLogged: req.user, posts: allPosts });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
