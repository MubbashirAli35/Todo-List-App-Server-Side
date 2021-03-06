const express = require('express');
const todosRouter = express.Router();
const bodyParser = require('body-parser');

const Todo = require('../models/todos');
const authenticate = require('../authenticate');

todosRouter.use(bodyParser.json());

todosRouter.get('/', authenticate.verifyUser, (req, res, next) => {
    Todo.find({user: req.user._id})
    .then((todos) => {
        if(todos == null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({message: 'No todos'});
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.json(todos);        
    }, (err) => next(err))
    .catch((err) => next(err));
});

todosRouter.post('/new', authenticate.verifyUser, (req, res, next) => {
    Todo.create({
        user: req.user._id,
        description: req.body.description,
        title: req.body.title
    })
    .then((todo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.json(todo);
    }, (err) => next(err))
    .catch((err) => next(err));
});

todosRouter.post('/delete', authenticate.verifyUser, (req, res, next) => {
    Todo.findByIdAndDelete(req.body.todoId)
    .then(() => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.json({message: 'Todo deleted successfully'});
    }, err => next(err))
    .catch(err => next(err));
});

todosRouter.post('/edit', authenticate.verifyUser, (req, res, next) => {
    Todo.findByIdAndUpdate(req.body.todoId, {
        title: req.body.title,
        description: req.body.description,
        isCompleted: req.body.isCompleted
    })
    .then(() => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.json({
            message: 'Todo updated Successfully',
        });
    }, err => next(err));
});

module.exports = todosRouter;