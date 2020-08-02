const mongoose = require('mongoose');

const Todo = mongoose.Schema({
    title: {
        type: String,
        default: 'Untitled Todo'
    },
    description: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Todo', Todo);