const router = require('express').Router();

router.get('/', (req, res) => {
  if (req.user) {
    res.redirect('/newsfeed');
  }
  res.render('index');
});

module.exports = router;
