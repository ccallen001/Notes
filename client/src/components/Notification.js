const Notification = ({ message }) => {
  if (!`${message}`) return;

  return (
    <>
      <div className="error">{message}</div>
    </>
  );
};

export default Notification;
