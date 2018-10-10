const express = require("express");
const router = express.Router({ mergeParams: true });
const Range = require("../models/range");
const Comment = require("../models/comment");

const middleware = require("../middlewares");

router.get("/new", middleware.isLoggedIn, (req, res) => {
  Range.findById(req.params.id, (err, dbRange) => {
    err ? console.log(err) : res.render("comments/new", { range: dbRange });
  });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
  Range.findById(req.params.id, (err, dbRange) => {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, (err, dbResponse) => {
        if (err) {
          console.log(err);
        } else {
          dbResponse.author.id = req.user._id;
          dbResponse.author.username = req.user.username;
          dbResponse.save();
          dbRange.comments.push(dbResponse);
          dbRange.save();
          res.redirect("/ranges/" + dbRange._id);
        }
      });
    }
  });
});

router.get("/:comment_id/edit", middleware.checkRangeOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    err
      ? res.redirect("back")
      : res.render("comments/edit", {
          range_id: req.params.id,
          comment: foundComment
        });
  });
});

router.put("/:comment_id", middleware.checkRangeOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      err ? res.redirect("back") : res.redirect(`/ranges/${req.params.id}`);
    }
  );
});

router.delete("/:comment_id", middleware.checkRangeOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    err ? res.redirect("back") : res.redirect(`/ranges/${req.params.id}`);
  });
});

module.exports = router;
