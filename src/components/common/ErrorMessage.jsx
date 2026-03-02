const errorStyles = {
  container: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '16px 20px',
    margin: '16px 0',
    color: '#dc2626',
    fontSize: '14px',
    lineHeight: '1.5',
  },
};

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div style={errorStyles.container}>
      {message}
    </div>
  );
};

export default ErrorMessage;
