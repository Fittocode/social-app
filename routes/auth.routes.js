const router = require('express').Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User.models');
const secureGravUrl = require('../config/gravatar');
const mongoose = require('mongoose');

// js functions
const {
  findAndPopulateUser,
  ensureAuthenticated,
  returnUnreadNotifications,
} = require('../config/javascriptFunctions');

router.get('/user-profile', ensureAuthenticated, async (req, res) => {
  const user = await findAndPopulateUser(User, req);
  const unreadNotifications = returnUnreadNotifications(user);
  const posts = await user.posts.reverse();
  res.render('users/userProfile', {
    userLogged: user,
    notifications: unreadNotifications.length,
    gravatar: user.gravatar,
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
    successRedirect: '/newsfeed',
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
    const user = await User.create({ username, password: passwordHash, email });
    console.log('user created');
    await User.findByIdAndUpdate(user._id, {
      $push: {
        usersFollowed: '620ac1f114ca1a39507c2e0b',
      },
      gravatar: secureGravUrl(user, '200'),
    });
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

module.exports = router;
