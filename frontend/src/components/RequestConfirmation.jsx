import React from 'react';
import { CheckCircle2, MapPin, Navigation, Clock, PlusCircle, ListOrdered } from 'lucide-react';

export default function RequestConfirmation({ requestData, onCreateAnother, onViewMyRequests }) {
  if (!requestData) return null;

  const departureDate = new Date(requestData.departureTime);

  const formattedDate = departureDate.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const formattedTime = departureDate.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="confirmation-page">
      <style>{`
        .confirmation-page {
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
          padding: 24px 0 32px;
          color: #e4e4e7;
        }

        /* Header */
        .confirmation-header {
          padding: 4px 0 28px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .confirmation-success-row {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 14px;
        }

        .confirmation-check {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          color: #4ade80;
        }

        .confirmation-check svg {
          width: 25px;
          height: 25px;
          stroke-width: 1.8;
        }

        .confirmation-success-label {
          color: #86efac;
          font-size: 12px;
          line-height: 1.2;
          font-weight: 500;
          letter-spacing: 0.01em;
        }

        .confirmation-title {
          margin: 0;
          color: #f4f4f5;
          font-size: 25px;
          line-height: 1.3;
          font-weight: 600;
          letter-spacing: -0.025em;
        }

        .confirmation-description {
          max-width: 620px;
          margin: 8px 0 0;
          color: #71717a;
          font-size: 13px;
          line-height: 1.6;
          font-weight: 400;
        }

        /* Request meta */
        .confirmation-meta {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-top: 20px;
        }

        .confirmation-meta-item {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #71717a;
          font-size: 11px;
          line-height: 1.3;
        }

        .confirmation-meta-label {
          color: #52525b;
        }

        .confirmation-meta-value {
          color: #a1a1aa;
          font-weight: 500;
        }

        .confirmation-meta-status {
          color: #86efac;
        }

        .confirmation-meta-divider {
          width: 1px;
          height: 14px;
          background: rgba(255,255,255,0.08);
        }

        /* Route */
        .confirmation-route {
          position: relative;
          margin-top: 30px;
          padding: 0 0 4px;
        }

        .confirmation-route-item {
          position: relative;
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr);
          column-gap: 14px;
          min-height: 108px;
        }

        .confirmation-route-item.destination {
          min-height: 108px;
        }

        .confirmation-route-marker {
          position: relative;
          display: flex;
          justify-content: center;
          padding-top: 2px;
        }

        .confirmation-route-marker::before {
          content: '';
          position: absolute;
          top: 8px;
          left: 50%;
          width: 8px;
          height: 8px;
          margin-left: -4px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 4px rgba(16,185,129,0.08);
          z-index: 2;
        }

        .confirmation-route-item.destination .confirmation-route-marker::before {
          background: #818cf8;
          box-shadow: 0 0 0 4px rgba(129,140,248,0.08);
        }

        .confirmation-route-line {
          position: absolute;
          top: 16px;
          bottom: -16px;
          left: 13.5px;
          width: 1px;
          background: rgba(255,255,255,0.09);
        }

        .confirmation-route-item:last-child .confirmation-route-line {
          display: none;
        }

        .confirmation-route-content {
          padding-bottom: 36px;
        }

        .confirmation-route-label {
          margin-bottom: 6px;
          color: #71717a;
          font-size: 10px;
          line-height: 1.2;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .confirmation-route-address {
          display: block;
          color: #d4d4d8;
          font-size: 14px;
          line-height: 1.5;
          font-weight: 400;
          overflow-wrap: anywhere;
        }

        .confirmation-coordinates {
          margin-top: 5px;
          color: #52525b;
          font-size: 10px;
          line-height: 1.4;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        /* Departure */
        .confirmation-departure {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 2px;
          padding: 16px 0;
          border-top: 1px solid rgba(255,255,255,0.055);
          border-bottom: 1px solid rgba(255,255,255,0.055);
        }

        .confirmation-departure-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          color: #a1a1aa;
          flex: 0 0 28px;
        }

        .confirmation-departure-content {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 7px;
        }

        .confirmation-departure-label {
          color: #71717a;
          font-size: 11px;
          font-weight: 400;
        }

        .confirmation-departure-value {
          color: #d4d4d8;
          font-size: 13px;
          font-weight: 500;
        }

        /* Info */
        .confirmation-info {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-top: 24px;
          padding: 0;
        }

        .confirmation-info-line {
          width: 2px;
          min-height: 42px;
          flex: 0 0 2px;
          border-radius: 2px;
          background: #3f3f46;
        }

        .confirmation-info-content {
          max-width: 700px;
        }

        .confirmation-info-title {
          margin: 0 0 4px;
          color: #a1a1aa;
          font-size: 12px;
          line-height: 1.4;
          font-weight: 500;
        }

        .confirmation-info-text {
          margin: 0;
          color: #71717a;
          font-size: 12px;
          line-height: 1.65;
          font-weight: 400;
        }

        /* Actions */
        .confirmation-actions {
          display: flex;
          justify-content: flex-start;
          gap: 10px;
          margin-top: 30px;
        }

        .confirmation-action-primary,
        .confirmation-action-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 40px;
          padding: 9px 16px;
          border-radius: 8px;
          font-size: 12px;
          line-height: 1.2;
          font-weight: 500;
          cursor: pointer;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }

        .confirmation-action-primary {
          border: 1px solid rgba(255,255,255,0.12);
          background: #f4f4f5;
          color: #18181b;
        }

        .confirmation-action-primary:hover {
          background: #ffffff;
        }

        .confirmation-action-secondary {
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent;
          color: #a1a1aa;
        }

        .confirmation-action-secondary:hover {
          background: rgba(255,255,255,0.035);
          border-color: rgba(255,255,255,0.13);
          color: #e4e4e7;
        }

        .confirmation-action-primary svg,
        .confirmation-action-secondary svg {
          width: 15px;
          height: 15px;
          stroke-width: 1.8;
        }

        @media (max-width: 640px) {
          .confirmation-page {
            padding: 18px 0 24px;
          }

          .confirmation-title {
            font-size: 21px;
          }

          .confirmation-description {
            font-size: 12px;
          }

          .confirmation-meta {
            gap: 10px;
            flex-wrap: wrap;
          }

          .confirmation-meta-divider {
            display: none;
          }

          .confirmation-actions {
            flex-direction: column;
          }

          .confirmation-action-primary,
          .confirmation-action-secondary {
            width: 100%;
          }
        }
      `}</style>

      <header className="confirmation-header">
        <div className="confirmation-success-row">
          <div className="confirmation-check">
            <CheckCircle2 />
          </div>

          <span className="confirmation-success-label">
            Solicitud registrada correctamente
          </span>
        </div>

        <h2 className="confirmation-title">
          Tu solicitud de viaje fue cargada
        </h2>

        <p className="confirmation-description">
          Guardamos los datos del viaje y ya se encuentra disponible para
          encontrar pasajeros compatibles.
        </p>

        <div className="confirmation-meta">
          <div className="confirmation-meta-item">
            <span className="confirmation-meta-label">Solicitud</span>
            <span className="confirmation-meta-value">
              #{requestData.requestId}
            </span>
          </div>

          <div className="confirmation-meta-divider" />

          <div className="confirmation-meta-item">
            <span className="confirmation-meta-label">Estado</span>
            <span className="confirmation-meta-value confirmation-meta-status">
              {requestData.status || 'SEARCHING'}
            </span>
          </div>
        </div>
      </header>

      <section className="confirmation-route">
        {/* ORIGEN */}
        <div className="confirmation-route-item">
          <div className="confirmation-route-marker">
            <MapPin
              size={15}
              style={{ opacity: 0 }}
            />
          </div>

          <div className="confirmation-route-content">
            <div className="confirmation-route-label">
              Origen
            </div>

            <span className="confirmation-route-address">
              {requestData.origin.address}
            </span>

            <div className="confirmation-coordinates">
              {requestData.origin.latitude}, {requestData.origin.longitude}
            </div>
          </div>

          {/* Línea que conecta Origen con Destino */}
          <div className="confirmation-route-line" />
        </div>

        {/* DESTINO */}
        <div className="confirmation-route-item destination">
          <div className="confirmation-route-marker">
            <Navigation
              size={15}
              style={{ opacity: 0 }}
            />
          </div>

          <div className="confirmation-route-content">
            <div className="confirmation-route-label">
              Destino
            </div>

            <span className="confirmation-route-address">
              {requestData.destination.address}
            </span>

            <div className="confirmation-coordinates">
              {requestData.destination.latitude}, {requestData.destination.longitude}
            </div>
          </div>
        </div>
      </section>

      <section className="confirmation-departure">
        <div className="confirmation-departure-icon">
          <Clock size={17} strokeWidth={1.7} />
        </div>

        <div className="confirmation-departure-content">
          <span className="confirmation-departure-label">
            Salida solicitada
          </span>

          <span className="confirmation-departure-value">
            {formattedDate} · {formattedTime} hs
          </span>
        </div>
      </section>

      <section className="confirmation-info">
        <div className="confirmation-info-line" />

        <div className="confirmation-info-content">
          <p className="confirmation-info-title">
            ¿Qué sucede ahora?
          </p>

          <p className="confirmation-info-text">
            Tu solicitud permanece activa mientras buscamos pasajeros con
            recorridos compatibles para formar un viaje compartido.
          </p>
        </div>
      </section>

      <div className="confirmation-actions">
        <button
          onClick={onCreateAnother}
          className="confirmation-action-primary"
        >
          <PlusCircle />
          Crear otra solicitud
        </button>

        <button
          onClick={onViewMyRequests}
          className="confirmation-action-secondary"
        >
          <ListOrdered />
          Ver mis solicitudes
        </button>
      </div>
    </div>
  );
}