const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const cors = require('cors');

const config = require('./config');
const User = require('./models/users');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const todosRouter = require('./routes/todos');

mongoose.connect(config.url, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
  console.log('Connected to database ' + config.url)
});

mongoose.connection.on('error', (err) => {
  console.log('Cannot connect to MongoDB database! Error: ' + err)
});

let opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secret;

const app = express();

app.use(bodyParser.json());
app.use(passport.initialize());
/* app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new JWTStrategy(opts, (jwt_payload, done) => {
  User.findOne({_id: jwt_payload._id}, (err, user) => {
    if(err)
      return done(err, false);
    
    else if(user)
      return done(null, user);

    else 
      return done(null, false);
  });
})) */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', cors(), usersRouter);
app.use('/todos', cors(), todosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
