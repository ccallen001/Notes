const SaveNoteForm = ({ newNote, handleNoteChange, addNote }) => {
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        addNote();
      }}
    >
      <input value={newNote} onChange={handleNoteChange} />
      <button type="submit" style={{ backgroundColor: '#00e773' }}>
        Save New Note
      </button>
    </form>
  );
};

export default SaveNoteForm;
