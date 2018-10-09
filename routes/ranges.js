const express = require("express");
const router = express.Router();
const Range = require("../models/range");

router.get("/", (req, res) => {
  Range.find({}, (err, ranges) => {
    err ? console.log(err) : res.render("ranges/index", { ranges });
  });
});

router.post("/", isLoggedIn, (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const author = {
    id: req.user._id,
    username: req.user.username
  }
  const newRange = { name, image, author };
  Range.create(newRange, (err, dbResponse) => {
    err ? console.log(err) : res.redirect("/ranges");
  });
});

router.get("/new", isLoggedIn, (req, res) => {
  res.render("ranges/new");
});

router.get("/:id", (req, res) => {
  Range.findById(req.params.id)
    .populate("comments")
    .exec((err, range) => {
      err ? console.log(err) : res.render("ranges/show", { range });
    });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
