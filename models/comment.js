<<<<<<< HEAD
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: String,
  author: String,
  date: { type: Date, default: Date.now },
  img: { type: String, default: "../static/person.png"}
});

module.exports = mongoose.model("Comment", commentSchema);
=======
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId
    },
    username: String
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
>>>>>>> master
