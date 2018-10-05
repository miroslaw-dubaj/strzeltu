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

// Range.create({
//     name: 'Strzelnica CEL w Łańcucie',
//     image: 'https://scontent-waw1-1.xx.fbcdn.net/v/t31.0-8/20507437_489561561402070_2222920359021455001_o.jpg?_nc_cat=0&oh=31e244b1527b82025acb37575a11ebe5&oe=5B30106F'
// }, (err, res) => {
//   (err) ? (console.log(err)) : (console.log(res));
// });
