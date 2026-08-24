import React from 'react';
import { AlertTriangle, X, Loader2, Check } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  subtitle,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDanger = true,
  isLoading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay" onClick={onClose}>
      <style>{`
        .confirm-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .confirm-modal {
          position: relative;
          width: 100%;
          max-width: 480px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          background: #18181b;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.6), 0 4px 18px rgba(0, 0, 0, 0.4);
          color: #ffffff;
        }

        .confirm-modal-top {
          position: relative;
          padding: 32px 32px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .confirm-close {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
          border-radius: 8px;
          background: transparent;
          color: #a1a1aa;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .confirm-close:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .confirm-title {
          margin: 0 0 12px;
          color: #ffffff;
          font-size: 24px;
          line-height: 1.3;
          font-weight: 700;
        }

        .confirm-subtitle {
          margin: 0;
          color: #d4d4d8;
          font-size: 16px;
          line-height: 1.6;
          font-weight: 400;
        }

        .confirm-content {
          padding: 28px 32px;
        }

        .confirm-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .confirm-action {
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .confirm-action svg {
          width: 18px;
          height: 18px;
        }

        .confirm-cancel {
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          color: #ffffff;
        }

        .confirm-cancel:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .confirm-submit-danger {
          border: 1px solid #ef4444;
          background: #dc2626;
          color: #ffffff;
        }

        .confirm-submit-danger:hover:not(:disabled) {
          background: #b91c1c;
          border-color: #dc2626;
        }

        .confirm-submit-primary {
          border: 1px solid #10b981;
          background: #059669;
          color: #ffffff;
        }

        .confirm-submit-primary:hover:not(:disabled) {
          background: #047857;
          border-color: #059669;
        }

        .confirm-action:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-top">
          <button
            className="confirm-close"
            onClick={onClose}
            aria-label="Cerrar modal"
            disabled={isLoading}
          >
            <X size={20} />
          </button>

          <div className="confirm-heading">
            <h2 className="confirm-title">{title}</h2>
            {subtitle && <p className="confirm-subtitle">{subtitle}</p>}
          </div>
        </div>

        <div className="confirm-content">
          <div className="confirm-actions">
            <button
              type="button"
              className="confirm-action confirm-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </button>

            <button
              type="button"
              className={`confirm-action ${isDanger ? 'confirm-submit-danger' : 'confirm-submit-primary'}`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="spinner" size={18} />
                  Cargando...
                </>
              ) : (
                <>
                  {isDanger ? <AlertTriangle size={18} /> : <Check size={18} />}
                  {confirmText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
