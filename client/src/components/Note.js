import './styles/Note.scss';

const Note = ({ note, toggleImportance, deleteNote }) => {
  const label = note.important ? 'Make not important' : 'Make important';

  return (
    <>
      <li className="Note">
        {note.important && <span className="Note__important-star">★</span>}
        <span className="Note__content">{note.content}</span>
        <button
          className="Note__btn-toggle-important"
          onClick={toggleImportance}
        >
          {label}
        </button>
        <button className="Note__btn-delete" onClick={deleteNote}>
          Delete
        </button>
      </li>
    </>
  );
};

export default Note;
