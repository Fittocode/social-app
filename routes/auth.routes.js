const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.models');

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const passwordHash = await bcrypt.hashSync(password, 10);
    await User.create({ username, password: passwordHash });
    console.log('user created');
    res.render('auth/login');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
