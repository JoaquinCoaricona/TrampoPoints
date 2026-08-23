import React, { useState } from 'react';
import {
  Search,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Zap,
  Loader2,
  Bus,
  Home,
  ChevronRight
} from 'lucide-react';

export default function AdminPanel({
  allRequests,
  onRunAlgorithm,
  onUpdateStatus,
  onDeleteRequest,
  onViewMatches
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAlgorithmResult, setLastAlgorithmResult] = useState(null);

  const filteredRequests = allRequests.filter(req => {
    const matchesSearch =
      (req.requestId && req.requestId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.userName && req.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.userEmail && req.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.origin?.address && req.origin.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.destination?.address && req.destination.address.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = allRequests.length;
  const searchingCount = allRequests.filter(r => r.status === 'SEARCHING').length;
  const matchedCount = allRequests.filter(r => r.status === 'MATCHED' || r.status === 'CONFIRMED').length;

  const handleExecuteAlgorithm = async () => {
    setIsProcessing(true);
    setLastAlgorithmResult(null);

    try {
      const result = await onRunAlgorithm();
      setLastAlgorithmResult(result);
    } catch (err) {
      console.error('Error al ejecutar algoritmo en backend:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="admin-panel-wrap">
      {/* Scope styles specifically for the redesigned premium dark fintech Admin Panel */}
      <style>{`
        .admin-panel-wrap {
          background: transparent;
          border: none;
          border-radius: 0;
          padding: 0 0 80px 0;
          color: #f4f4f5;
          font-family: system-ui, -apple-system, sans-serif;
        }

        /* Breadcrumbs */
        .admin-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #71717a;
          margin-bottom: 24px;
        }
        .admin-breadcrumbs span {
          cursor: pointer;
        }
        .admin-breadcrumbs span:hover {
          color: #ffffff;
        }

        /* Header Layout matching Fintech style */
        .admin-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 1px solid #1f1f23;
          padding-bottom: 20px;
          margin-bottom: 28px;
          gap: 20px;
        }
        @media (max-width: 768px) {
          .admin-header-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        .admin-title-area {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .admin-status-update {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #71717a;
        }
        .pulsing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
          animation: pulse-green 2s infinite;
        }
        @keyframes pulse-green {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }
        .admin-dashboard-title {
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.5px;
        }
        .admin-search-area {
          display: flex;
          gap: 12px;
          width: 420px;
          max-width: 100%;
        }
        @media (max-width: 768px) {
          .admin-search-area {
            width: 100%;
          }
        }
        .admin-search-input-box {
          position: relative;
          flex-grow: 1;
        }
        .admin-search-input-box input {
          width: 100%;
          background: #09090b;
          border: 1px solid #1f1f23;
          border-radius: 6px;
          padding: 8px 12px 8px 36px;
          color: #ffffff;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }
        .admin-search-input-box input:focus {
          border-color: #71717a;
        }
        .search-icon-muted {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #71717a;
        }
        .admin-filter-select-flat {
          background: #09090b;
          border: 1px solid #1f1f23;
          border-radius: 6px;
          padding: 8px 12px;
          color: #ffffff;
          font-size: 13px;
          cursor: pointer;
          outline: none;
        }

        /* Algorithm execute box */
        .admin-algo-banner {
          background: #0e0e11;
          border: 1px solid #1f1f23;
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }
        @media (max-width: 768px) {
          .admin-algo-banner {
            flex-direction: column;
            align-items: stretch;
          }
        }
        .admin-algo-info {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .admin-algo-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #09090b;
          border: 1px solid #1f1f23;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
        }
        .admin-algo-text h3 {
          font-size: 15px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 4px 0;
        }
        .admin-algo-text p {
          font-size: 13px;
          color: #71717a;
          margin: 0;
          line-height: 1.4;
        }
        .admin-algo-btn-white {
          background: #ffffff;
          color: #09090b;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.2s;
          flex-shrink: 0;
        }
        .admin-algo-btn-white:hover:not(:disabled) {
          background: #cbd5e1;
        }
        .admin-algo-btn-white:disabled {
          background: #18181b;
          color: #71717a;
          border: 1px solid #27272a;
          cursor: not-allowed;
        }

        /* Success notification banner */
        .admin-success-banner {
          background: rgba(34, 197, 94, 0.04);
          border: 1px solid rgba(34, 197, 94, 0.15);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          color: #22c55e;
          font-size: 13px;
        }
        .new-trips-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }
        .new-trip-tag {
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.2);
          color: #22c55e;
          padding: 4px 10px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 11px;
        }

        /* Stats Strip - flat text aligned, no boxes */
        .admin-stats-summary-flat {
          display: flex;
          gap: 64px;
          margin-bottom: 36px;
          padding-bottom: 24px;
          border-bottom: 1px solid #1f1f23;
        }
        @media (max-width: 640px) {
          .admin-stats-summary-flat {
            flex-direction: column;
            gap: 20px;
          }
        }
        .admin-stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .admin-stat-label {
          font-size: 11px;
          text-transform: uppercase;
          color: #71717a;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .admin-stat-val {
          font-size: 32px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1;
        }
        .admin-stat-sub {
          font-size: 12px;
          color: #71717a;
        }
        .text-trend-up {
          color: #22c55e;
        }
        .text-trend-neutral {
          color: #e4e4e7;
        }

        /* Market Overview Table Style - Direct floating without encapsulating cards */
        .admin-table-section-flat {
          background: transparent;
          border: none;
          margin-top: 32px;
          width: 100%;
        }
        .admin-table-section-header {
          padding: 16px 0;
          border-bottom: 1px solid #1f1f23;
          margin-bottom: 16px;
        }
        .admin-table-section-title {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }
        .admin-table-wrapper-flat {
          width: 100%;
        }
        .admin-data-table-flat {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          text-align: left;
        }
        
        /* Rigid column widths ensuring zero horizontal scrollbar */
        .col-id { width: 8%; }
        .col-user { width: 22%; }
        .col-route { width: 34%; }
        .col-schedule { width: 14%; }
        .col-actions { width: 22%; }

        .admin-data-table-flat th {
          padding: 12px 8px;
          font-size: 11px;
          text-transform: uppercase;
          color: #71717a;
          font-weight: 700;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #1f1f23;
        }
        .admin-data-table-flat td {
          padding: 16px 8px;
          border-bottom: 1px solid #1c1c1f;
          font-size: 13px;
          color: #cbd5e1;
          vertical-align: middle;
        }
        .admin-data-table-flat tbody tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        /* Cells formatting */
        .cell-id {
          font-family: monospace;
          color: #71717a;
          font-weight: 600;
        }
        .cell-user-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .user-name-span {
          font-weight: 600;
          color: #ffffff;
        }
        .user-email-span {
          font-size: 12px;
          color: #71717a;
        }
        
        .cell-truncate {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
        }
        
        .table-route-row {
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100%;
        }
        .route-point-span {
          flex: 1;
          color: #e4e4e7;
        }
        .route-arrow-span {
          color: #3f3f46;
          flex-shrink: 0;
        }

        .cell-schedule-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .schedule-date-span {
          color: #e4e4e7;
        }
        .schedule-time-span {
          font-size: 12px;
          color: #71717a;
          font-weight: 600;
        }

        /* Fintech Status Pills - normal colors matching design, no neon glows */
        .status-pill-fintech {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: center;
        }
        .status-pill-fintech.searching {
          background: rgba(228, 228, 231, 0.05);
          color: #a1a1aa;
          border: 1px solid rgba(228, 228, 231, 0.15);
        }
        .status-pill-fintech.confirmed {
          background: rgba(34, 197, 94, 0.08);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.15);
        }
        .status-pill-fintech.cancelled {
          background: rgba(239, 68, 68, 0.08);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.15);
        }

        /* Actions styling */
        .actions-flex {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .admin-table-select-flat {
          background: #09090b;
          border: 1px solid #1f1f23;
          border-radius: 4px;
          padding: 6px 10px;
          color: #ffffff;
          font-size: 12px;
          cursor: pointer;
          outline: none;
          width: 100%;
        }
        .btn-action-flat-icon {
          background: transparent;
          color: #ffffff;
          border: 1px solid #1f1f23;
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
          flex-shrink: 0;
        }
        .btn-action-flat-icon:hover {
          background: #1c1c1f;
        }
        .btn-action-delete-icon {
          background: transparent;
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.15);
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s, border-color 0.2s;
          flex-shrink: 0;
        }
        .btn-action-delete-icon:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
        }

        .btn-ver-recorrido-flat {
          background: rgba(34, 197, 94, 0.08);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.15);
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: background-color 0.2s, border-color 0.2s;
        }
        .btn-ver-recorrido-flat:hover {
          background: rgba(34, 197, 94, 0.15);
          border-color: #22c55e;
        }

        .status-pill-fintech-select {
          font-size: 11px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          outline: none;
          display: inline-block;
          border: 1px solid rgba(228, 228, 231, 0.15);
          transition: background-color 0.2s, border-color 0.2s;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'><path fill='%2371717a' d='M0 2l4 4 4-4z'/></svg>");
          background-repeat: no-repeat;
          background-position: right 8px center;
          padding-right: 22px;
        }
        .status-pill-fintech-select.searching {
          background-color: rgba(228, 228, 231, 0.05);
          color: #a1a1aa;
          border-color: rgba(228, 228, 231, 0.15);
        }
        .status-pill-fintech-select.confirmed {
          background-color: rgba(34, 197, 94, 0.08);
          color: #22c55e;
          border-color: rgba(34, 197, 94, 0.15);
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'><path fill='%2322c55e' d='M0 2l4 4 4-4z'/></svg>");
        }
        .status-pill-fintech-select.cancelled {
          background-color: rgba(239, 68, 68, 0.08);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.15);
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'><path fill='%23ef4444' d='M0 2l4 4 4-4z'/></svg>");
        }
      `}</style>

      {/* Breadcrumbs */}
      <div className="admin-breadcrumbs">
        <Home size={14} />
        <span>Overview</span>
        <ChevronRight size={12} />
        <span>Dashboard</span>
      </div>

      {/* Header Info area */}
      <div className="admin-header-row">
        <div className="admin-title-area">
          <span className="admin-status-update">
            <span className="pulsing-dot"></span>
            Last update: 2 min ago
          </span>
          <h2 className="admin-dashboard-title">Panel de Control de Solicitudes</h2>
        </div>

        <div className="admin-search-area">
          <div className="admin-search-input-box">
            <Search size={14} className="search-icon-muted" />
            <input
              type="text"
              placeholder="Buscar por ID, pasajero o dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="admin-filter-select-flat"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Todos los Estados</option>
            <option value="SEARCHING">Buscando (Searching)</option>
            <option value="CONFIRMED">Asignado (Confirmed)</option>
            <option value="CANCELLED">Cancelado (Cancelled)</option>
          </select>
        </div>
      </div>

      {/* Algorithm Control Banner Box */}
      <div className="admin-algo-banner">
        <div className="admin-algo-info">
          <div className="admin-algo-icon-box">
            <Zap size={18} />
          </div>
          <div className="admin-algo-text">
            <h3>Algoritmo de Optimización de Combi-Sharing</h3>
            <p>
              Agrupa solicitudes en estado <strong>Buscando</strong> que comparten trayectos y horarios compatibles, reduciendo costos y planificando el ruteo dinámico.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="admin-algo-btn-white"
          onClick={handleExecuteAlgorithm}
          disabled={isProcessing || searchingCount === 0}
        >
          {isProcessing ? (
            <>
              <Loader2 size={14} className="spinner" />
              Procesando...
            </>
          ) : (
            <>
              <Zap size={14} />
              Ejecutar Algoritmo
            </>
          )}
        </button>
      </div>

      {/* Algorithm Output Banner */}
      {lastAlgorithmResult && (
        <div className="admin-success-banner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> Algoritmo completado
            </strong>
            <button
              style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '11px' }}
              onClick={() => setLastAlgorithmResult(null)}
            >
              Cerrar
            </button>
          </div>
          <p style={{ margin: '4px 0 0 0' }}>{lastAlgorithmResult.summary.message}</p>
          {lastAlgorithmResult.newTrips.length > 0 && (
            <div className="new-trips-list">
              {lastAlgorithmResult.newTrips.map(trip => (
                <span key={trip.tripId} className="new-trip-tag">
                  Combi #{trip.tripId} ({trip.stops.length / 2} paradas)
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats Summary strip - flat text aligned, no boxes */}
      <div className="admin-stats-summary-flat">
        <div className="admin-stat-item">
          <span className="admin-stat-label">Solicitudes Totales</span>
          <span className="admin-stat-val">{totalCount}</span>
          <span className="admin-stat-sub">100% de la base de datos</span>
        </div>
        <div className="admin-stat-item">
          <span className="admin-stat-label">Buscando Grupo</span>
          <span className="admin-stat-val">{searchingCount}</span>
          <span className="admin-stat-sub text-trend-neutral">En cola de optimización</span>
        </div>
        <div className="admin-stat-item">
          <span className="admin-stat-label">Combi Asignada</span>
          <span className="admin-stat-val">{matchedCount}</span>
          <span className="admin-stat-sub text-trend-up">+{Math.round((matchedCount / (totalCount || 1)) * 100)}% asignación</span>
        </div>
      </div>

      {/* Market Overview Style Requests Table - Spanning full side-to-side on deep black page background */}
      <div className="admin-table-section-flat">
        <div className="admin-table-section-header">
          <h3 className="admin-table-section-title">Market Overview / Solicitudes de Viaje</h3>
        </div>

        <div className="admin-table-wrapper-flat">
          {filteredRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', borderTop: '1px solid #1f1f23' }}>
              <AlertCircle size={28} style={{ color: '#71717a', marginBottom: '8px' }} />
              <p style={{ margin: 0, color: '#71717a', fontSize: '14px' }}>No se encontraron solicitudes registradas.</p>
            </div>
          ) : (
            <table className="admin-data-table-flat">
              <colgroup>
                <col className="col-id" />
                <col className="col-user" />
                <col className="col-route" />
                <col className="col-schedule" />
                <col className="col-actions" />
              </colgroup>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Ruta (Origen ➔ Destino)</th>
                  <th>Horario</th>
                  <th>Estado y Gestión</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.requestId}>
                    <td className="cell-id">#{req.requestId}</td>
                    <td>
                      <div className="cell-user-info">
                        <span className="user-name-span cell-truncate">{req.userName || 'Pasajero'}</span>
                        <span className="user-email-span cell-truncate">{req.userEmail || 'demo@email.com'}</span>
                      </div>
                    </td>
                    <td title={`${req.origin?.address} ➔ ${req.destination?.address}`}>
                      <div className="table-route-row">
                        <span className="route-point-span cell-truncate">{req.origin?.address || 'Origen'}</span>
                        <span className="route-arrow-span">➔</span>
                        <span className="route-point-span cell-truncate">{req.destination?.address || 'Destino'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="cell-schedule-info">
                        <span className="schedule-date-span">{new Date(req.departureTime).toLocaleDateString()}</span>
                        <span className="schedule-time-span">{new Date(req.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs</span>
                      </div>
                    </td>
                    <td>
                      <div className="actions-flex">
                        <select
                          className={`status-pill-fintech-select ${req.status ? req.status.toLowerCase() : 'searching'}`}
                          value={req.status || 'SEARCHING'}
                          onChange={(e) => onUpdateStatus(req.requestId, e.target.value)}
                        >
                          <option value="SEARCHING">SEARCHING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                        {(req.status === 'CONFIRMED' || req.status === 'MATCHED') ? (
                          <button
                            type="button"
                            className="btn-ver-recorrido-flat"
                            onClick={() => onViewMatches(req)}
                          >
                            Ver Recorrido
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-action-flat-icon"
                            onClick={() => onViewMatches(req)}
                            title="Ver Combi"
                          >
                            <Bus size={14} />
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn-action-delete-icon"
                          onClick={() => onDeleteRequest(req.requestId)}
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
