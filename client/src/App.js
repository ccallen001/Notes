import { useState, useEffect } from 'react';

import noteService from './services/notes';

import Note from './components/Note';

import Notification from './components/Notification';

console.clear();

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    noteService.getAll().then((initialNotes) => setNotes(initialNotes));
  }, []);

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  function toggleImportanceOf(id) {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((updatedNote) =>
        setNotes(notes.map((note) => (note.id !== id ? note : updatedNote)))
      )
      .catch(() => {
        setErrorMessage(`Note ${note.content} was already removed from server`);
        setTimeout(() => setErrorMessage(null), 3000);
        setNotes(notes.filter((note) => note.id !== id));
      });
  }

  function addNote() {
    const noteObject = {
      content: newNote,
      date: new Date(),
      important: Math.random() < 0.5
    };

    noteService
      .create(noteObject)
      .then((createdNote) => setNotes(notes.concat(createdNote)));

    setNewNote('');
  }

  function handleNoteChange({ target }) {
    setNewNote(target.value);
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <button onClick={() => setShowAll(!showAll)}>
        Show {showAll ? 'Important' : 'All'}
      </button>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          addNote();
        }}
      >
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default App;
