const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users');
};

const currentUser = (req, res, next) => {
  res.locals.currentUser = req.user;
  next();
};

module.exports = { isLoggedIn, currentUser };
