const Range = require("../models/range");

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users");
};

const currentUser = (req, res, next) => {
  res.locals.currentUser = req.user;
  next();
};

const checkRangeOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Range.findById(req.params.id, (err, foundRange) => {
      if (err) {
        res.redirect("/ranges");
      } else {
        foundRange.author.id.equals(req.user._id)
          ? next()
          : res.redirect("back");
      }
    });
  } else {
    res.redirect("back");
  }
};

module.exports = { isLoggedIn, currentUser, checkRangeOwnership };
