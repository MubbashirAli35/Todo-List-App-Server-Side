const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const User = mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
    }
});

User.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameUnique: true
});

module.exports = mongoose.model('User', User);