const router = require('express').Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User.models');
const secureGravUrl = require('../config/gravatar');
const mongoose = require('mongoose');

router.get('/user-profile', ensureAuthenticated, async (req, res) => {
  const user = await User.findOne(req.user)
    .populate('posts friends notifications')
    .populate({
      path: 'notifications',
      populate: [
        { path: 'user', model: 'User' },
        { path: 'post', model: 'Post' },
      ],
    });

  const posts = await user.posts.reverse();
  res.render('users/userProfile', {
    userLogged: user,
    gravatar: secureGravUrl(user, '200'),
    notifications: user.notifications.reverse(),
    posts: posts,
  });
});

router.get('/login', (req, res) => {
  res.render('auth/login', { message: req.flash() });
});

router.get('/please-login', (req, res) => {
  res.render('auth/loginRedirect', { message: req.flash() });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/user-profile',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res, next) => {
  const { username, password, email } = req.body;

  if (!username || !email || !password) {
    res.render('auth/signup', {
      error:
        'All fields are mandatory. Please provide your username, email and password',
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render('auth/signup', {
      error:
        'Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.',
    });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ username, password: passwordHash, email });
    console.log('user created');
    res.render('auth/login', { username: username });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('auth/signup', {
        error:
          'Username and email need to be unique. Either username or email is already being used.',
      });
    } else {
      next();
    }
  }
});

router.get('/logout', ensureAuthenticated, (req, res) => {
  req.logOut();
  res.redirect('/login');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

module.exports = router;
