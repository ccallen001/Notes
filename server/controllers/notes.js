const notesRouter = require('express').Router();

const Note = require('../models/note');

notesRouter.get('/', async (_, res) => {
  const notes = await Note.find({});
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

notesRouter.post('/', async (request, response) => {
  const body = request.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  });

  const savedNote = await note.save();

  response.status(201).json(savedNote);
});

notesRouter.put('/:id', async (req, res, next) => {
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
