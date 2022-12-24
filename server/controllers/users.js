const bcrypt = require('bcrypt');
const express = require('express');
const usersRouter = express.Router();
const User = require('../models/user');

usersRouter.get('/', async (_, res) => {
  const users = await User.find({}).populate('notes', { content: 1, date: 1 });
  res.json(users);
});

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({
      error: 'username must be unique'
    });
  }

  // what's a salt round?
  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    name,
    passwordHash
  });

  const newUser = await user.save();

  res.status(201).json(newUser);
});

module.exports = usersRouter;
