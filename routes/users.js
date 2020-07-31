const express = require('express');
const userRouter = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/users');
const config = require('../config');

userRouter.use(bodyParser.json());

userRouter.get('/', (req, res, next) => {
  User.find()
  .then((users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.json(users);
  }, (err) => next(err))
  .catch((err) => next(err));
})

userRouter.post('/signup', (req, res, next) => {
  console.log(req.body);

  if(!req.body.email || !req.body.password) 
    return res.json({ success: false, message: 'Please fill all the requried fields' });

  User.register(new User({email: req.body.email}), req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      console.log('Server error');
      return res.json({err: err});
    }
    else if(!req.body.email || !req.body.password) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      console.log('Fields error');
      return res.json({success: false, message: 'Please fill all the required fields'});
    }
    else {
      user.name = req.body.name;

      console.log('User save se pehle');

      user.save((err, user) => {
        if(err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          console.log('Cannot save user');
          return res.json({err: err});
        }
        passport.authenticate('local')(req, res, () => {
          console.log('Hello');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          console.log('Registration hogyi bhyee');
          return res.json({success: true, message: 'Registration Successfull'});
        })
      })
    }
  });
});

userRouter.post('/login', (req, res, next) => {
  passport.authenticate('local', function(err, user, info) {
    if(err)
      return next(err);

    else if(!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({success: false, status: 'Login unsuccessful!', err: 'Could not login user'});
    }

    const token = jwt.sign({id: user._id}, config.secret, {expiresIn: 3600});

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.json({success: true, status: 'Login Successful', token: token});
  })(req, res, next);
});

userRouter.get('/logout', (req, res, next) => {
  req.logOut();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  return res.json({success: true, message: 'Logged out successfully'});
})

module.exports = userRouter;
