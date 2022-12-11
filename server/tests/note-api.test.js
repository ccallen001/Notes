const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const {
  Note,
  initialNotes,
  nonExistingId,
  notesInDb
} = require('./test-helper');

const api = supertest(app);

beforeEach(async () => {
  await Note.deleteMany({});
  await Note.insertMany(initialNotes);
});

describe('when notes are initially there', () => {
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
});

describe('viewing a specific note', () => {
  test('succeeds with a valid id', async () => {
    const notesAtStart = await notesInDb();
    const noteToView = notesAtStart[0];

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const processedNoteToView = JSON.parse(JSON.stringify(noteToView));

    expect(resultNote.body).toEqual(processedNoteToView);
  });

  test('fails with statuscode 404 if note not found', async () => {
    const validNonExistingId = await nonExistingId();
    const result = await api
      .get(`/api/notes/${validNonExistingId}`)
      .expect(404);
  });

  test('fails with statuscode 400 if id is invalid', async () => {
    await api.get('/api/notes/5a3d5da59070081a82a3445').expect(400);
  });
});

describe('addition of new note', () => {
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

    const notesAtEnd = await notesInDb();

    expect(notesAtEnd).toHaveLength(initialNotes.length);
  });
});

describe('deleting a note', () => {
  test('a note can be deleted', async () => {
    const notesAtStart = await notesInDb();
    const noteToDelete = notesAtStart[0];

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

    const notesAtEnd = await notesInDb();

    expect(notesAtEnd).toHaveLength(initialNotes.length - 1);

    const contents = notesAtEnd.map((r) => r.content);

    expect(contents).not.toContain(noteToDelete.content);
  });
});

afterAll(() => mongoose.connection.close());
