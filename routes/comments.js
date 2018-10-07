const express = require("express");
const router = express.Router();
const Range = require('../models/range');
const Comment = require('../models/comment');

router.get("/ranges/:id/comments/new", isLoggedIn, (req, res) => {
  Range.findById(req.params.id, (err, dbRange) => {
    err ? console.log(err) : res.render("comments/new", { range: dbRange });
  });
});

router.post("/ranges/:id/comments", isLoggedIn, (req, res) => {
  Range.findById(req.params.id, (err, dbRange) => {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, (err, dbResponse) => {
        if (err) {
          console.log(err);
        } else {
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
