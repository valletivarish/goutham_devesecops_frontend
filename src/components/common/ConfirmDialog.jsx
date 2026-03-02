const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const dialogStyles = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '28px',
  maxWidth: '420px',
  width: '90%',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
};

const titleStyles = {
  margin: '0 0 12px 0',
  fontSize: '18px',
  fontWeight: '600',
  color: '#1e293b',
};

const messageStyles = {
  margin: '0 0 24px 0',
  fontSize: '14px',
  color: '#64748b',
  lineHeight: '1.5',
};

const buttonContainerStyles = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
};

const cancelBtnStyles = {
  padding: '8px 20px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  backgroundColor: '#fff',
  color: '#374151',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
};

const confirmBtnStyles = {
  padding: '8px 20px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#dc2626',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
};

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div style={overlayStyles} onClick={onCancel}>
      <div style={dialogStyles} onClick={(e) => e.stopPropagation()}>
        <h3 style={titleStyles}>{title || 'Confirm Action'}</h3>
        <p style={messageStyles}>{message || 'Are you sure you want to proceed?'}</p>
        <div style={buttonContainerStyles}>
          <button style={cancelBtnStyles} onClick={onCancel}>
            Cancel
          </button>
          <button style={confirmBtnStyles} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
