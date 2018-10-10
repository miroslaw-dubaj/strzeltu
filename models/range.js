<<<<<<< HEAD
const mongoose = require('mongoose')

const rangeSchema = new mongoose.Schema({
  name: String,
  image: String,
  shortDesc: String,
  date: { type: Date, default: Date.now },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

module.exports = mongoose.model('Range', rangeSchema);
=======
const mongoose = require('mongoose')

const rangeSchema = new mongoose.Schema({
  name: String,
  image: String,
  shortDesc: String,
  date: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

module.exports = mongoose.model('Range', rangeSchema);
>>>>>>> master
