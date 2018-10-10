let middleware = {};

middleware.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users");
};

middleware.currentUser = (req, res, next) => {
  res.locals.currentUser = req.user;
  next();
};

module.exports = middleware;
