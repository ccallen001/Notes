import './styles/SaveNoteForm.scss';

const SaveNoteForm = ({ newNote, handleNoteChange, addNote }) => {
  return (
    <form
      className="SaveNoteForm"
      onSubmit={(ev) => {
        ev.preventDefault();
        addNote();
      }}
    >
      <input
        placeholder="New note content"
        value={newNote}
        onChange={handleNoteChange}
      />
      <button type="submit" style={{ backgroundColor: '#00e773' }}>
        Save New Note
      </button>
    </form>
  );
};

export default SaveNoteForm;
