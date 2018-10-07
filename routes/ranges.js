const express = require('express');
const router = express.Router();

router.get('/ranges', (req, res) => {
    Range.find({}, (err, dbRanges) => {
      (err)?console.log(err):res.render('ranges/index', {ranges: dbRanges});
    })
  });
  
router.post('/ranges', (req, res) => {
const name = req.body.name;
const image = req.body.image;
const newRange = {name: name, image: image}
Range.create(newRange, (err, dbResponse) => {
    (err)?(console.log(err)):res.redirect('/ranges');
})
});

router.get('/ranges/new/', (req, res) => {
res.render('ranges/new');
});

router.get('/ranges/:id', (req, res) => {
Range.findById(req.params.id).populate('comments').exec((err, dbRange) => {
    (err) ? console.log(err) : res.render('ranges/show', { range: dbRange });
});
});
  
module.exports = router;