const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { Mongoose } = require('mongoose');
const passport = require('passport');
const User = require('../models/User.models');

router.get('/login', (req, res) => {
  res.render('auth/login');
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

module.exports = router;
