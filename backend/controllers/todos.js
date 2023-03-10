const Joi = require('joi');
const todos = require('../models/todos');

const getTodos = async (req, res) => {
  try {
    const response = await todos.findAll();
    if (response) {
      res.send(response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong');
  }
};

const getTodoById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const response = await todos.findTodoById(id);
    if (response.length === 1) {
      res.send(response[0]);
    }
  } catch (err) {
    res.status(500).send('Something went wrong');
  }
};

const createTodo = async (req, res) => {
  const schema = Joi.object({
    task: Joi.string().min(4).required(),
    tag: Joi.string().min(4).required(),
    done: Joi.boolean(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const todo = {
    task: req.body.task,
    tag: req.body.tag,
    done: req.body.done || false,
  };

  try {
    const result = await todos.findByTask(todo);
    if (result.length > 0) {
      res.status(400).send('Todo already exists');
      return;
    }
    const response = await todos.create(todo);
    if (response) {
      todo.id = response.insertId;
      res.status(201).send(todo);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong');
  }
};

const updateTodo = async (req, res) => {
  const schema = Joi.object({
    task: Joi.string().min(4).required(),
    tag: Joi.string().min(4).required(),
    done: Joi.boolean(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const id = parseInt(req.params.id);

  const todo = {
    task: req.body.task,
    tag: req.body.tag,
    done: req.body.done || false,
  };

  try {
    const result = await todos.findTodoById(id);
    if (result.length === 0) {
      res.status(404).send('Todo not found');
      return;
    }
    const response = await todos.updateById(id, todo);
    if (response) {
      todo.id = id;
      res.status(200).send(todo);
    }
  } catch (err) {
    res.status(500).send('Something went wrong');
  }
};

const deleteTodo = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const response = await todos.deleteById(id);
    if (response) {
      res.status(200).send('Todo deleted');
    }
  } catch (err) {
    res.status(500).send('Something went wrong');
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
