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
  };
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

router.get("/:id/edit", checkRangeOwnership, (req, res) => {
  Range.findById(req.params.id, (err, foundRange) => {
    err
      ? res.redirect("back")
      : res.render("ranges/edit", { range: foundRange });
  });
});

router.put("/:id", checkRangeOwnership, (req, res) => {
  let editedRange = req.body.range;
  editedRange.date = Date.now();
  Range.findByIdAndUpdate(req.params.id, editedRange, (err, updatedRange) => {
    err ? res.redirect("/ranges") : res.redirect(`/ranges/${req.params.id}`);
  });
});

router.delete("/:id", checkRangeOwnership, (req, res) => {
  Range.findByIdAndRemove(req.params.id, err => {
    err ? res.redirect("/ranges") : res.redirect("/ranges");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkRangeOwnership(req, res, next) {
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
}

module.exports = router;
