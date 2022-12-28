const jwt = require('jsonwebtoken');

const notesRouter = require('express').Router();

const Note = require('../models/note');
const User = require('../models/user');

function getTokenFrom(req) {
  const auth = req.get('authorization');

  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.substring(7);
  }
}

notesRouter.get('/', async (_, res) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 });
  res.json(notes);
});

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

notesRouter.post('/', async (req, res) => {
  const { userId, content, important } = req.body;

  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(userId);

  const note = new Note({
    content,
    important: important || false,
    date: new Date(),
    user: user?._id
  });

  const savedNote = await note.save();

  if (user) {
    user.notes = user.notes.concat(savedNote._id);
    await user.save();
  }

  res.status(201).json(savedNote);
});

notesRouter.put('/:id', async (req, res) => {
  const { content, important } = req.body;

  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  );

  res.json(updatedNote);
});

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

module.exports = notesRouter;
