const notesRouter = require('express').Router();

const Note = require('../models/note');

notesRouter.get('/', async (_, res) => {
  const notes = await Note.find({});
  res.json(notes);
});

notesRouter.get('/:id', async (req, res, next) => {
  const note = await Note.findById(req.params.id);
  note ? res.json(note) : res.status(404).end();
});

notesRouter.post('', async (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: 'content missing' });
  }

  const newNote = await new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  }).save();

  res.json(newNote);
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

notesRouter.delete('/:id', async (req, res, next) => {
  await Note.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

module.exports = notesRouter;
