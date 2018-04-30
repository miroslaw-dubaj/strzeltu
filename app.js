const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const User = require('./models/user');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
const Range = require('./models/range');
const Comment = require('./models/comment');
const { isLoggedIn, currentUser } = require('./middlewares/users');
const app = express();

mongoose.connect('mongodb://localhost/strzeltu');

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: 'CZ sucks Glock rulez',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// prepare server
// app.use('/api', api); // redirect API calls
app.use('/', express.static(__dirname + '/www')); // redirect root
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.set('view engine', 'ejs');

app.use(currentUser);

app.get('/', (req, res) => {
  res.render('landing')
});

app.get('/users/new', (req, res) => {
  res.render('users/new');
});

app.post('/users', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).render('/users/new');
    }
    passport.authenticate('local')(req, res, () => {
    res.redirect('/ranges');
    });
  });
});

app.get('/users', (req, res) => {
  res.render('users/login');
})

app.post('/users/login', passport.authenticate('local', {
  successRedirect: '/ranges',
  faliureRedirect: '/users/login'
  }),
);

app.get('/users/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

app.get('/ranges', (req, res) => {
  Range.find({}, (err, dbRanges) => {
    (err)?console.log(err):res.render('ranges/index', {ranges: dbRanges});
  });
});

app.post('/ranges', isLoggedIn, (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const shortDesc = req.body.shortDesc
  const newRange = {name: name, image: image, shortDesc: shortDesc}
  Range.create(newRange, (err, dbResponse) => {
    (err)?(console.log(err)):res.redirect('/ranges');
  })
});

app.get('/ranges/new/', isLoggedIn, (req, res) => {
  res.render('ranges/new');
});

app.get('/ranges/:id', (req, res) => {
  Range.findById(req.params.id).populate('comments').exec((err, dbRange) => {
    (err) ? console.log(err) : res.render('ranges/show', { range: dbRange });
  });
});

app.get('/ranges/:id/comments/new', isLoggedIn, (req, res) => {
  Range.findById(req.params.id, (err, dbRange) => {
    (err) ? console.log(err) : res.render('comments/new', { range: dbRange });
  });
});

app.post('/ranges/:id/comments', isLoggedIn, (req, res) => {
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
