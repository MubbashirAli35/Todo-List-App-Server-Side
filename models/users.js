const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const User = mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);