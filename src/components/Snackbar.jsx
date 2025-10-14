import React, { useEffect } from 'react';
import '../styles/Snackbar.css';

const Snackbar = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto-dismiss after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  const isLoading = type === 'loading';

  return (
    <div className={`snackbar show ${type}`}>
      {isLoading && <div className="loader"></div>}
      <span>{message}</span>
      <button onClick={onClose} className="close-btn">
        &times;
      </button>
    </div>
  );
};

export default Snackbar;
