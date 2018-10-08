const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/', (req, res) => {
  res.render('landing')
});

// Authorization Routes

router.get("/register", (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/ranges');
    });
  });
});

router.get("/login", (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/ranges',
    faliureRedirect: '/login'
  }), (req, res) => {
    console.log('login callback')
  });

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/ranges');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;