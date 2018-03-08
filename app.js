//Modeller som används
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

//Vad som ska köras om användaren requestar en sida
const index = require('./routes/index');
const api = require('./routes/api/index');

//Skapar express och declains variabeln app
const app = express();

// view engine setup, var programmet ska leta efter views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//Configuration for web server
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Vilken route file som ska användas och vilken url som ska visas
//GET
app.use('/', index);
app.use('/api', api);

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
