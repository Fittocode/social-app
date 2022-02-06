const router = require('express').Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User.models');

router.get('/user-profile', ensureAuthenticated, async (req, res) => {
  const user = await User.findOne().populate('posts');
  res.render('users/user-profile', { user: user });
});

router.get('/login', (req, res) => {
  res.render('auth/login', { message: req.flash() });
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

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ username, password: passwordHash });
    console.log('user created');
    res.render('auth/login');
  } catch (err) {
    res.status(500).render('auth/signup', {
      error: 'That username is already in use',
    });
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
