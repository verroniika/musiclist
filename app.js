//Modeller som används
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session')({
  secret: 'random stings here are good',
  resave: false,
  saveUninitialized: false,
});
const User = require('./models/user');


//Vad som ska köras om användaren requestar en sida
const index = require('./routes/index');
const api = require('./routes/api/index');
const users = require('./routes/api/users');

//Skapar express och declains variabeln app
const app = express();

//Connect to Mongoose
mongoose.connect('mongodb://localhost/musiclist');

// view engine setup, var programmet ska leta efter views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//Configuration for web server
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//Vilken route file som ska användas och vilken url som ska visas
//GET
app.use('/', index);
app.use('/api', api);
app.use('/api/users', users);

// Configure Passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// catch 404 and forward to error handler
//Ska vara efter routes om routen inte hittas eller om något blir fel
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler, skriver ut erroret 
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//
module.exports = app;
