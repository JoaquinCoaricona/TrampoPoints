import React, { useState } from 'react';
import {
  LogOut,
  X,
  AlertTriangle,
  Bus,
  ShieldCheck,
  User,
  Loader2
} from 'lucide-react';

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

  const getRoleLabel = () => {
    if (isDriver) return 'Chofer';
    if (isAdmin) return 'Administrador';
    return 'Pasajero';
  };

  const getRoleIcon = () => {
    if (isDriver) return <Bus size={14} />;
    if (isAdmin) return <ShieldCheck size={14} />;
    return <User size={14} />;
  };

  return (
    <div className="logout-overlay" onClick={onClose}>
      <style>{`
        .logout-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(0, 0, 0, 0.68);
          backdrop-filter: blur(7px);
          -webkit-backdrop-filter: blur(7px);
        }

        .logout-modal {
          position: relative;
          width: 100%;
          max-width: 460px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 16px;
          background: #101012;
          box-shadow:
            0 24px 70px rgba(0, 0, 0, 0.45),
            0 4px 18px rgba(0, 0, 0, 0.2);
          color: #e4e4e7;
        }

        .logout-modal-top {
          position: relative;
          padding: 28px 30px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .logout-close {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
          border-radius: 7px;
          background: transparent;
          color: #71717a;
          cursor: pointer;
          transition:
            background 0.18s ease,
            color 0.18s ease,
            border-color 0.18s ease;
        }

        .logout-close:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.07);
          color: #d4d4d8;
        }

        .logout-close:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .logout-heading {
          padding-right: 38px;
        }

        .logout-kicker {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 11px;
          color: #f87171;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.025em;
        }

        .logout-kicker svg {
          width: 15px;
          height: 15px;
          stroke-width: 1.8;
        }

        .logout-title {
          margin: 0;
          color: #f4f4f5;
          font-size: 22px;
          line-height: 1.3;
          font-weight: 600;
          letter-spacing: -0.025em;
        }

        .logout-subtitle {
          max-width: 370px;
          margin: 8px 0 0;
          color: #71717a;
          font-size: 13px;
          line-height: 1.6;
          font-weight: 400;
        }

        .logout-content {
          padding: 22px 30px 26px;
        }

        .logout-user {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 0 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .logout-user-main {
          display: flex;
          align-items: center;
          min-width: 0;
          gap: 12px;
        }

        .logout-avatar {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #27272a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #d4d4d8;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .logout-avatar.avatar-driver {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.16);
          color: #6ee7b7;
        }

        .logout-avatar.avatar-admin {
          background: rgba(129, 140, 248, 0.08);
          border-color: rgba(129, 140, 248, 0.16);
          color: #a5b4fc;
        }

        .logout-user-info {
          min-width: 0;
        }

        .logout-user-name {
          display: block;
          overflow: hidden;
          color: #d4d4d8;
          font-size: 13px;
          line-height: 1.4;
          font-weight: 500;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .logout-user-email {
          display: block;
          max-width: 230px;
          margin-top: 2px;
          overflow: hidden;
          color: #52525b;
          font-size: 11px;
          line-height: 1.4;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .logout-role {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          flex: 0 0 auto;
          color: #71717a;
          font-size: 10px;
          line-height: 1.2;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.035em;
        }

        .logout-role.driver {
          color: #6ee7b7;
        }

        .logout-role.admin {
          color: #a5b4fc;
        }

        .logout-notice {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          margin-top: 20px;
          padding: 13px 14px;
          border: 1px solid rgba(245, 158, 11, 0.10);
          border-radius: 9px;
          background: rgba(245, 158, 11, 0.035);
        }

        .logout-notice-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          padding-top: 1px;
          color: #a1a1aa;
        }

        .logout-notice-icon svg {
          width: 16px;
          height: 16px;
          stroke-width: 1.7;
        }

        .logout-notice-text {
          margin: 0;
          color: #71717a;
          font-size: 11px;
          line-height: 1.6;
          font-weight: 400;
        }

        .logout-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 24px;
        }

        .logout-action {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 9px 14px;
          border-radius: 8px;
          font-size: 12px;
          line-height: 1.2;
          font-weight: 500;
          cursor: pointer;
          transition:
            background 0.18s ease,
            border-color 0.18s ease,
            color 0.18s ease;
        }

        .logout-action svg {
          width: 15px;
          height: 15px;
          stroke-width: 1.8;
        }

        .logout-cancel {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: transparent;
          color: #a1a1aa;
        }

        .logout-cancel:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.035);
          border-color: rgba(255, 255, 255, 0.12);
          color: #e4e4e7;
        }

        .logout-confirm {
          border: 1px solid rgba(248, 113, 113, 0.18);
          background: rgba(248, 113, 113, 0.09);
          color: #fca5a5;
        }

        .logout-confirm:hover:not(:disabled) {
          background: rgba(248, 113, 113, 0.14);
          border-color: rgba(248, 113, 113, 0.25);
          color: #fecaca;
        }

        .logout-action:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        @media (max-width: 520px) {
          .logout-overlay {
            padding: 16px;
          }

          .logout-modal {
            max-width: 100%;
          }

          .logout-modal-top {
            padding: 24px 22px 21px;
          }

          .logout-content {
            padding: 19px 22px 22px;
          }

          .logout-title {
            font-size: 20px;
          }

          .logout-user {
            align-items: flex-start;
          }

          .logout-role {
            margin-top: 3px;
          }

          .logout-actions {
            grid-template-columns: 1fr;
          }

          .logout-confirm {
            order: 1;
          }

          .logout-cancel {
            order: 2;
          }
        }
      `}</style>

      <div
        className="logout-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="logout-modal-top">
          <button
            className="logout-close"
            onClick={onClose}
            aria-label="Cerrar modal"
            disabled={loggingOut}
          >
            <X size={18} />
          </button>

          <div className="logout-heading">
            <div className="logout-kicker">
              <LogOut />
              <span>Cerrar sesión</span>
            </div>

            <h2 className="logout-title">
              ¿Querés salir de tu cuenta?
            </h2>

            <p className="logout-subtitle">
              Vas a cerrar la sesión actual de TrampoPoints.
            </p>
          </div>
        </div>

        <div className="logout-content">
          {user && (
            <div className="logout-user">
              <div className="logout-user-main">
                <div
                  className={`logout-avatar ${isAdmin
                      ? 'avatar-admin'
                      : isDriver
                        ? 'avatar-driver'
                        : ''
                    }`}
                >
                  {getUserInitials(user.name)}
                </div>

                <div className="logout-user-info">
                  <span className="logout-user-name">
                    {user.name.replace(/\s*\(Chofer\)/i, '')}
                  </span>

                  <span className="logout-user-email">
                    {user.email}
                  </span>
                </div>
              </div>

              <span
                className={`logout-role ${isDriver
                    ? 'driver'
                    : isAdmin
                      ? 'admin'
                      : ''
                  }`}
              >
                {getRoleIcon()}
                {getRoleLabel()}
              </span>
            </div>
          )}

          <div className="logout-notice">
            <div className="logout-notice-icon">
              <AlertTriangle />
            </div>

            <p className="logout-notice-text">
              {isDriver
                ? 'Al salir, dejarás de estar en el módulo de gestión de tu combi y tendrás que volver a iniciar sesión.'
                : 'Podrás volver a ingresar en cualquier momento para consultar tus solicitudes y viajes.'}
            </p>
          </div>

          <div className="logout-actions">
            <button
              type="button"
              className="logout-action logout-cancel"
              onClick={onClose}
              disabled={loggingOut}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="logout-action logout-confirm"
              onClick={handleConfirm}
              disabled={loggingOut}
            >
              {loggingOut ? (
                <>
                  <Loader2 className="spinner" size={15} />
                  Saliendo...
                </>
              ) : (
                <>
                  <LogOut size={15} />
                  Cerrar sesión
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}