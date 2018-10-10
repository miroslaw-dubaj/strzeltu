const express = require("express");
const router = express.Router();
const Range = require("../models/range");

const middleware = require("../middlewares");

router.get("/", (req, res) => {
  Range.find({}, (err, ranges) => {
    err ? console.log(err) : res.render("ranges/index", { ranges });
  });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  const newRange = { name, image, author };
  Range.create(newRange, (err, dbResponse) => {
    err ? console.log(err) : res.redirect("/ranges");
  });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("ranges/new");
});

router.get("/:id", (req, res) => {
  Range.findById(req.params.id)
    .populate("comments")
    .exec((err, range) => {
      err ? console.log(err) : res.render("ranges/show", { range });
    });
});

router.get("/:id/edit", middleware.checkRangeOwnership, (req, res) => {
  Range.findById(req.params.id, (err, foundRange) => {
    err
      ? res.redirect("back")
      : res.render("ranges/edit", { range: foundRange });
  });
});

router.put("/:id", middleware.checkRangeOwnership, (req, res) => {
  let editedRange = req.body.range;
  editedRange.date = Date.now();
  Range.findByIdAndUpdate(req.params.id, editedRange, (err, updatedRange) => {
    err ? res.redirect("/ranges") : res.redirect(`/ranges/${req.params.id}`);
  });
});

router.delete("/:id", middleware.checkRangeOwnership, (req, res) => {
  Range.findByIdAndRemove(req.params.id, err => {
    err ? res.redirect("/ranges") : res.redirect("/ranges");
  });
});

module.exports = router;
