const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/please-login');
  }
};

module.exports = ensureAuthenticated;
