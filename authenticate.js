const passport = require('passport')
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const User = require('./models/users');
const config = require('./config');

let opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secret;

exports.local = passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new JWTStrategy(opts, (jwt_payload, done) => {
    //console.log(JSON.stringify(jwt_payload));
    User.findOne({_id: jwt_payload.id}, (err, user) => {
        if(err)
            return done(err, false);

        else if(!user)
            return done(null, false);

        else 
            return done(null, user);
    });
}));

exports.verifyUser = passport.authenticate('jwt', { session: false });