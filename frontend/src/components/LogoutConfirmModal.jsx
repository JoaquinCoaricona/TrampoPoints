import React, { useState } from 'react';
import { LogOut, X, AlertTriangle, Bus, ShieldCheck, User, Loader2 } from 'lucide-react';

export default function LogoutConfirmModal({ isOpen, onClose, onConfirm, user }) {
  const [loggingOut, setLoggingOut] = useState(false);

  if (!isOpen) return null;

  const isDriver = user?.role === 'DRIVER' || user?.role === 'CHOFER';
  const isAdmin = user?.role === 'ADMIN';

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleConfirm = async () => {
    setLoggingOut(true);
    try {
      await onConfirm();
    } finally {
      setLoggingOut(false);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container glass-card logout-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Cerrar modal"
          disabled={loggingOut}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="logout-modal-header text-center">
          <div className="logout-icon-wrapper">
            <LogOut size={28} className="text-rose" />
          </div>
          <h2 className="logout-modal-title">¿Cerrar Sesión?</h2>
          <p className="logout-modal-subtitle">
            Estás a punto de salir de tu cuenta en <strong>TrampoPoints</strong>.
          </p>
        </div>

        {/* User preview card */}
        {user && (
          <div className="logout-user-preview-card flex-between align-center">
            <div className="flex-center gap-12">
              <div
                className={`user-avatar ${isAdmin ? 'avatar-admin' : isDriver ? 'avatar-driver' : ''}`}
              >
                {getUserInitials(user.name)}
              </div>
              <div className="flex-column">
                <strong className="preview-user-name">{user.name.replace(/\s*\(Chofer\)/i, '')}</strong>
                <span className="preview-user-email">{user.email}</span>
              </div>
            </div>

            <div>
              {isDriver && (
                <span className="badge-pill driver flex-center gap-4">
                  <Bus size={12} /> CHOFER
                </span>
              )}
              {isAdmin && (
                <span className="badge-pill admin flex-center gap-4">
                  <ShieldCheck size={12} /> ADMIN
                </span>
              )}
              {!isDriver && !isAdmin && (
                <span className="badge-pill user flex-center gap-4">
                  <User size={12} /> PASAJERO
                </span>
              )}
            </div>
          </div>
        )}

        <div className="logout-notice-box">
          <AlertTriangle size={18} className="text-amber flex-shrink-0" />
          <span className="text-muted">
            {isDriver
              ? 'Al salir, dejarás de estar en el módulo de gestión de tu combi y tendrás que volver a iniciar sesión.'
              : 'Podrás volver a ingresar en cualquier momento para consultar tus solicitudes y viajes.'}
          </span>
        </div>

        {/* Actions */}
        <div className="logout-modal-actions">
          <button
            type="button"
            className="btn-secondary flex-1"
            onClick={onClose}
            disabled={loggingOut}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-danger-action flex-1 flex-center gap-6"
            onClick={handleConfirm}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <>
                <Loader2 className="spinner" size={16} /> Saliendo...
              </>
            ) : (
              <>
                <LogOut size={16} /> Sí, Cerrar Sesión
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
