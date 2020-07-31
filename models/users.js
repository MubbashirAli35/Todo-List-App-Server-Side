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
        unique: true
    },
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);