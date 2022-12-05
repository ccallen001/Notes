const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const {
  Note,
  initialNotes,
  /*  nonExistingId, */
  notesInDb
} = require('./test-helper');

beforeEach(async () => {
  await Note.deleteMany({});

  for (const initialNote of initialNotes) {
    await new Note(initialNote).save();
  }
});

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all notes are returned', async () => {
  const response = await api.get('/api/notes');

  expect(response.body).toHaveLength(initialNotes.length);
});

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes');

  const contents = response.body.map((note) => note.content);

  expect(contents).toContain(initialNotes[1].content);
});

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true
  };

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/notes');

  const contents = response.body.map((resp) => resp.content);

  expect(response.body).toHaveLength(initialNotes.length + 1);

  expect(contents).toContain(newNote.content);
});

test('note without content is not added', async () => {
  const newNote = {
    important: true
  };

  await api.post('/api/notes').send(newNote).expect(400);

  // const notesAtEnd = await notesInDb();

  // expect(notesAtEnd).toHaveLength(initialNotes.length);
});

test('a specific note can be viewed', async () => {
  const notesAtStart = await notesInDb();

  const noteToView = notesAtStart[0];

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const processedNoteToView = JSON.parse(JSON.stringify(noteToView));

  expect(resultNote.body).toEqual(processedNoteToView);
});

test('a note can be deleted', async () => {
  const notesAtStart = await notesInDb();
  const noteToDelete = notesAtStart[0];

  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

  const notesAtEnd = await notesInDb();

  expect(notesAtEnd).toHaveLength(initialNotes.length - 1);

  const contents = notesAtEnd.map((r) => r.content);

  expect(contents).not.toContain(noteToDelete.content);
});

afterAll(() => mongoose.connection.close());
