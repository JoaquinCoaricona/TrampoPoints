import React from 'react';
import { PlusCircle, Clock, MapPin, Navigation } from 'lucide-react';

export default function MyRequestsPage({
  userRequests,
  onNewRequest,
  onViewMatches,
  onDeleteRequest
}) {
  if (userRequests.length === 0) {
    return null;
  }

  return (
    <div
      className="card glass-card"
      style={{
        padding: '28px',
        background: 'rgba(255,255,255,0.015)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px'
      }}
    >
      <style>{`
        .my-requests-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .my-requests-title {
          margin: 0;
          color: #f4f4f5;
          font-size: 20px;
          line-height: 1.35;
          font-weight: 600;
          letter-spacing: -0.02em;
        }

        .my-requests-subtitle {
          margin: 6px 0 0;
          color: #71717a;
          font-size: 13px;
          line-height: 1.5;
          font-weight: 400;
        }

        .requests-list-clean {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
        }

        .request-item-clean {
          padding: 20px 22px;
          border: 1px solid rgba(255,255,255,0.055);
          border-radius: 12px;
          background: rgba(255,255,255,0.018);
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .request-item-clean:hover {
          background: rgba(255,255,255,0.028);
          border-color: rgba(255,255,255,0.09);
        }

        .request-topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
        }

        .request-id {
          color: #71717a;
          font-size: 11px;
          line-height: 1;
          font-weight: 500;
          letter-spacing: 0.01em;
        }

        .request-status {
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          padding: 4px 9px;
          border-radius: 6px;
          font-size: 10px;
          line-height: 1;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .request-status-confirmed {
          color: #86efac;
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.14);
        }

        .request-status-pending {
          color: #fbbf24;
          background: rgba(245,158,11,0.08);
          border: 1px solid rgba(245,158,11,0.14);
        }

        .request-route {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 28px;
          margin-bottom: 20px;
        }

        .route-point {
          min-width: 0;
        }

        .route-label {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 7px;
          color: #71717a;
          font-size: 11px;
          line-height: 1.2;
          font-weight: 500;
        }

        .route-label-origin svg {
          color: #10b981;
        }

        .route-label-destination svg {
          color: #818cf8;
        }

        .route-address {
          display: block;
          color: #d4d4d8;
          font-size: 14px;
          line-height: 1.5;
          font-weight: 400;
          overflow-wrap: anywhere;
        }

        .request-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .request-date {
          display: flex;
          align-items: center;
          gap: 7px;
          min-width: 0;
          color: #71717a;
          font-size: 12px;
          line-height: 1.4;
          font-weight: 400;
        }

        .request-date svg {
          flex: 0 0 auto;
          color: #71717a;
        }

        .request-action {
          flex: 0 0 auto;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.035);
          color: #d4d4d8;
          border-radius: 7px;
          padding: 8px 13px;
          font-size: 11px;
          line-height: 1.2;
          font-weight: 500;
          cursor: pointer;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }

        .request-action:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.14);
          color: #ffffff;
        }

        @media (max-width: 640px) {
          .my-requests-header {
            padding-bottom: 18px;
          }

          .my-requests-title {
            font-size: 18px;
          }

          .request-route {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .request-footer {
            align-items: flex-start;
            flex-direction: column;
            gap: 14px;
          }

          .request-action {
            width: 100%;
          }
        }
      `}</style>

      <div className="my-requests-header">
        <div>
          <h2 className="my-requests-title">
            Mis solicitudes de viaje
          </h2>
          <p className="my-requests-subtitle">
            Consultá los viajes que solicitaste y su recorrido asignado.
          </p>
        </div>
      </div>

      <div className="requests-list-clean">
        {userRequests.map((req) => {
          const departureDate = new Date(req.departureTime);

          const formattedDate = departureDate.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });

          const formattedTime = departureDate.toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit'
          });

          const isConfirmed = req.status === 'CONFIRMED';

          return (
            <div
              key={req.requestId}
              className="request-item-clean"
            >
              <div className="request-topline">
                <span className="request-id">
                  Solicitud #{req.requestId}
                </span>

                <span
                  className={`request-status ${isConfirmed
                      ? 'request-status-confirmed'
                      : 'request-status-pending'
                    }`}
                >
                  {req.status}
                </span>
              </div>

              <div className="request-route">
                <div className="route-point">
                  <div className="route-label route-label-origin">
                    <MapPin size={14} strokeWidth={1.8} />
                    <span>Origen</span>
                  </div>

                  <span className="route-address">
                    {req.origin?.address || 'Origen'}
                  </span>
                </div>

                <div className="route-point">
                  <div className="route-label route-label-destination">
                    <Navigation size={14} strokeWidth={1.8} />
                    <span>Destino</span>
                  </div>

                  <span className="route-address">
                    {req.destination?.address || 'Destino'}
                  </span>
                </div>
              </div>

              <div className="request-footer">
                <div className="request-date">
                  <Clock size={14} strokeWidth={1.8} />
                  <span>
                    {formattedDate} · {formattedTime} hs
                  </span>
                </div>

                <div className="request-actions-row" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    className="request-action"
                    onClick={() => onViewMatches(req)}
                  >
                    Ver recorrido asignado
                  </button>
                  <button
                    className="request-action"
                    onClick={() => onDeleteRequest && onDeleteRequest(req.requestId)}
                    style={{
                      borderColor: 'rgba(244, 63, 94, 0.2)',
                      background: 'rgba(244, 63, 94, 0.05)',
                      color: '#f43f5e',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(244, 63, 94, 0.1)';
                      e.target.style.borderColor = 'rgba(244, 63, 94, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(244, 63, 94, 0.05)';
                      e.target.style.borderColor = 'rgba(244, 63, 94, 0.2)';
                    }}
                  >
                    Cancelar solicitud
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}