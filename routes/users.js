const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/users/new", middlewares, (req, res) => {
  res.render("users/new");
});

router.post("/users", (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).render("/users/new");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/ranges");
    });
  });
});

router.get("/users", (req, res) => {
  res.render("users/login");
});

router.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/ranges",
    faliureRedirect: "/users/login"
  })
);

router.get("/users/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
