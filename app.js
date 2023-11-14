var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser')
var mongoose = require("mongoose");
//mongoose.set('strictQuery', false); 
require('dotenv').config()

var indexRouter = require('./routes/index');

var app = express();
// app.use("/pdf", express.static(path.join(__dirname, "pdf")));

// Database connect 
mongoose.connect(process.env.MONGOURL,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Database connected');
  })
  .catch((error) => {
    console.log('Error connecting to database');
  });

// Database connect end 
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.static(path.join(__dirname, 'buildd')));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());

app.use(bodyParser.text({ type: 'application/xml' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// process.env.TZ = "America/Mexico_City";
// console.log(new Date().toString());



const splite = (items, splite_data) => {
  var scanResults = {};
  Object.keys(items).forEach(async function (index) {
    if (splite_data != index) {
      scanResults[index] = items[index];
    }
  });
  return scanResults;
};
app.use((req, res, next) => {
  req.splite = splite;
  next();
})

app.use(function (req, res, next) {
  res.sendFile(path.join(__dirname, "buildd", "index.html"));
  // next(createError(404));
});


module.exports = app;