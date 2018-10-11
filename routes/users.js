const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");


router.get("/new", (req, res) => {
  res.render("users/new");
});

router.post("/", (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
      return res.status(403).render("/users/new");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", `Hi ${user.username}! Great to have you on board!`);
      res.redirect("/ranges");
    });
  });
});

router.get("/", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/ranges",
    faliureRedirect: "/users/login"
  }), (req, res) => {
    console.log('Succesfull login');
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "User logged out");
  res.redirect("/");
});

module.exports = router;
