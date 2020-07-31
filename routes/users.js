const express = require('express');
const userRouter = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');

const User = require('../models/users');

userRouter.use(bodyParser.json());

userRouter.post('/signup', (req, res, next) => {
  console.log(req.body);

  if(!req.body.name || !req.body.username || !req.body.email || !req.body.password) 
    return res.json({ success: false, message: 'Please fill all the requried fields' });

  User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      console.log('Server error');
      return res.json({err: err});
    }
    else if(!req.body.name || !req.body.username || !req.body.email || !req.body.password) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      console.log('Fields error');
      return res.json({success: false, message: 'Please fill all the required fields'});
    }
    else {
      user.name = req.body.name;
      user.email = req.body.email;

      console.log('User save se pehle');

      user.save((err, user) => {
        if(err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          console.log('Cannot save user');
          return res.json({err: err});
        }
        passport.authenticate('Local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          console.log('Registration hogyi bhyee');
          return res.json({success: true, message: 'Registration Successfull'});
        })
      })
    }
  });
})

module.exports = userRouter;
