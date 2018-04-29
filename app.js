const express =     require('express'),
      app =         express(),
      bodyParser =  require('body-parser'), 
      mongoose =    require('mongoose'),
      Range =       require('./models/range'),
      Comment =     require('./models/comment');

mongoose.connect('mongodb://localhost/strzeltu');

app.use(bodyParser.urlencoded({extended: true}));

// prepare server
// app.use('/api', api); // redirect API calls
// app.use('/', express.static(__dirname + '/www')); // redirect root
app.use('/static', express.static(__dirname + '/assets'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing')
});

app.get('/ranges', (req, res) => {
  Range.find({}, (err, dbRanges) => {
    (err)?console.log(err):res.render('ranges/index', {ranges: dbRanges});
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
  res.render('ranges/new');
});

app.get('/ranges/:id', (req, res) => {
  Range.findById(req.params.id).populate('comments').exec((err, dbRange) => {
    (err) ? console.log(err) : res.render('ranges/show', { range: dbRange });
  });
});

app.get('/ranges/:id/comments/new', (req, res) => {
  Range.findById(req.params.id, (err, dbRange) => {
    (err) ? console.log(err) : res.render('comments/new', { range: dbRange });
  });
});

app.post('/ranges/:id/comments', (req, res) => {
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
          res.redirect('/ranges/' + dbRange._id);
        } 
      })
    }})
});


app.listen(8080, 'localhost', () => {
  console.log('Server serving Strzeltu.pl')
});
