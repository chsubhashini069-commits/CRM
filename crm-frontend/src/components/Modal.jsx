import { useState } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="modal-content glass-card animate-fade-in" style={{
        width: '100%', maxWidth: '500px', padding: '32px', position: 'relative'
      }}>
        <div className="modal-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '1.5rem' }}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
