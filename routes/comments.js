const express = require("express");
const router = express.Router({mergeParams: true});
const Range = require('../models/range');
const Comment = require('../models/comment');

router.get("/new", isLoggedIn, (req, res) => {
  Range.findById(req.params.id, (err, dbRange) => {
    err ? console.log(err) : res.render("comments/new", { range: dbRange });
  });
});

router.post("/", isLoggedIn, (req, res) => {
  Range.findById(req.params.id, (err, dbRange) => {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, (err, dbResponse) => {
        if (err) {
          console.log(err);
        } else {
          dbResponse.author.id = req.user._id;
          dbResponse.author.username = req.user.username
          dbResponse.save();
          dbRange.comments.push(dbResponse);
          dbRange.save();
          res.redirect("/ranges/" + dbRange._id);
        }
      });
    }
  });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
