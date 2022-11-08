require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT;

const Note = require('./models/note');

const unknownInput = (_req, res, _next) =>
  res.status(404).send({ error: 'unknown endpoint' });

const errorHandler = (error, _, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'mal formatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(express.static('build'));
app.use(express.json());
app.use(cors());

app.get('/', (_, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (_, res) => {
  Note.find({})
    .then((notes) => res.json(notes))
    .catch((err) => {
      console.error(`error finding notes: ${err}`);
      mongoose.connection.close();
      process.exit(1);
    });
});

app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => (note ? res.json(note) : res.status(404).end()))
    .catch((err) => next(err));
});

app.post('/api/notes', (req, res, next) => {
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

app.put('/api/notes/:id', (req, res, next) => {
  const { content, important } = req.body;

  Note.findByIdAndUpdate(
    req.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedNote) => res.json(updatedNote))
    .catch((err) => next(err));
});

app.delete('/api/notes/:id', (req, res, next) =>
  Note.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err))
);

app.use(unknownInput);
app.use(errorHandler);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
