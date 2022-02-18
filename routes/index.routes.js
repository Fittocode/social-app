const router = require('express').Router();

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/newsfeed');
  } else {
    res.render('index');
  }
});

module.exports = router;
