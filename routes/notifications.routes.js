const router = require('express').Router();
const User = require('../models/User.models');
const {
  readPostNotifications,
  ensureAuthenticated,
} = require('../config/javascriptFunctions');

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/inbox/:userId', async (req, res) => {
  try {
    const user = await readPostNotifications(User, req);
    res.send(user);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
