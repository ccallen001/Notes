import { useState, useEffect } from 'react';
import noteService from './services/notes';
import Note from './components/Note';
import Notification from './components/Notification';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const initialNotes = await noteService.getAll();
        setNotes(initialNotes);
      } catch (error) {
        console.error('error getting notes', error);
      }
    })();
  }, []);

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  async function toggleImportanceOf(id) {
    try {
      const noteToToggle = notes.find((n) => n.id === id);
      const toggledState = {
        ...noteToToggle,
        important: !noteToToggle.important
      };

      const toggledNote = await noteService.update(id, toggledState);

      setNotes(notes.map((note) => (note.id !== id ? note : toggledNote)));
    } catch (error) {
      setErrorMessage(
        `Error toggling importance... The note may have already been removed from the server`
      );
      setTimeout(() => setErrorMessage(null), 3000);
      setNotes(notes.filter((note) => note.id !== id));
    }
  }

  async function addNote() {
    const noteObject = {
      content: newNote,
      date: new Date(),
      important: Math.random() < 0.5
    };

    const createdNote = await noteService.create(noteObject);

    setNotes(notes.concat(createdNote));

    setNewNote('');
  }

  async function deleteNote(id) {
    await noteService.deleteNote(id);
    setNotes(notes.filter((note) => note.id !== id));
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
            deleteNote={() => deleteNote(note.id)}
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
