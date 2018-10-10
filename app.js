const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user"),
  session = require("express-session");

const middleware = require("./middlewares");

const commentRoutes = require("./routes/comments"),
  rangeRoutes = require("./routes/ranges"),
  indexRoutes = require("./routes/index");

mongoose.connect(
  `mongodb://${process.env.ME_CONFIG_MONGODB_ADMINUSERNAME}:${
    process.env.ME_CONFIG_MONGODB_ADMINPASSWORD
  }@mongo:27017`
);

app.use(bodyParser.urlencoded({ extended: true }));

// prepare server
// app.use('/api', api); // redirect API calls
app.use("/", express.static(__dirname + "/www")); // redirect root
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js")); // redirect bootstrap JS
app.use("/js", express.static(__dirname + "/node_modules/jquery/dist")); // redirect JS jQuery
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css")); // redirect CSS bootstrap

app.set("view engine", "ejs");

app.use(middleware.currentUser);

// passport config
app.use(
  session({
    secret: "CZ sucks Glock rulez",
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(indexRoutes);
app.use("/ranges/:id/comments", commentRoutes);
app.use("/ranges", rangeRoutes);

module.exports = app;
