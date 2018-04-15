const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'), 
      mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/strzeltu')

const rangeSchema = new mongoose.Schema({
  name: String,
  image: String
});

const Range = mongoose.model('Range', rangeSchema);

// Range.create({
//     name: 'Strzelnica CEL w Łańcucie',
//     image: 'https://scontent-waw1-1.xx.fbcdn.net/v/t31.0-8/20507437_489561561402070_2222920359021455001_o.jpg?_nc_cat=0&oh=31e244b1527b82025acb37575a11ebe5&oe=5B30106F'
// }, (err, res) => {
//   (err) ? (console.log(err)) : (console.log(res));
// });

app.use(bodyParser.urlencoded({extended: true}));

// prepare server
// app.use('/api', api); // redirect API calls
app.use('/', express.static(__dirname + '/www')); // redirect root
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing')
});

app.get('/ranges', (req, res) => {
  Range.find({}, (err, dbRanges) => {
    (err)?console.log(err):res.render('index', {ranges: dbRanges});
  })
});

app.post('/ranges', (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const newRange = {name: name, image: image}
  Range.create(newRange, (err, dbResponse) => {
    (err)?(console.log(err)):res.redirect('/ranges');
  })
});

app.get('/ranges/new/', (req, res) => {
  res.render('new-range');
});

app.get('/ranges/:id', (req, res) => {
    Range.findById(req.params.id, (err, dbRange) => {
      (err) ? console.log(err) : res.render('show', { range: dbRange });
    });
});

app.listen(8080, 'localhost', () => {
  console.log('Server serving Strzeltu.pl')
});
