const router = require('express').Router();
const User = require('../models/User.models');
const {
  ensureAuthenticated,
  readPostNotifications,
} = require('../config/serverJSFunctions');

router.post('/inbox/:userId', ensureAuthenticated, async (req, res) => {
  try {
    const user = await readPostNotifications(User, req);
    res.send(user);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
