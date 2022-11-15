const notesRouter = require('express').Router();

const Note = require('../models/note');

notesRouter.get('/', (_, res) => {
  Note.find({})
    .then((notes) => res.json(notes))
    .catch((err) => {
      console.error(`error finding notes: ${err}`);
      process.exit(1);
    });
});

notesRouter.get('/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => (note ? res.json(note) : res.status(404).end()))
    .catch((err) => next(err));
});

notesRouter.post('', (req, res, next) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: 'content missing' });
  }

  new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })
    .save()
    .then((savedNote) => res.json(savedNote))
    .catch((err) => next(err));
});

notesRouter.put('/:id', (req, res, next) => {
  const { content, important } = req.body;

  Note.findByIdAndUpdate(
    req.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedNote) => res.json(updatedNote))
    .catch((err) => next(err));
});

notesRouter.delete('/:id', (req, res, next) =>
  Note.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err))
);

module.exports = notesRouter;
