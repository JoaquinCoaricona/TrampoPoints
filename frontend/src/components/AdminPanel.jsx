import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  MapPin,
  Navigation,
  Clock,
  User,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Layers,
  Zap,
  Loader2,
  Sparkles,
  Bus
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
    <div className="card glass-card admin-panel-container flex-column gap-24">
      {/* Header */}
      <div className="card-header flex-between align-center border-bottom-glass padding-bottom-16">
        <div>
          <div className="flex-center-left gap-10">
            <ShieldCheck size={28} className="text-amber" />
            <div>
              <h2 className="text-gradient-amber font-extrabold text-22">
                Panel de Control de Administrador
              </h2>
              <span className="text-muted text-xs">
                Monitoreo y ejecución del algoritmo de agrupamiento por afinidad en tiempo real
              </span>
            </div>
          </div>
        </div>
        <span className="badge badge-amber font-mono font-bold text-xs flex-center gap-4">
          <ShieldCheck size={14} /> Modo Administrador Activo
        </span>
      </div>

      {/* Algorithm Execution Banner Box */}
      <div className="card glass-card algorithm-exec-box border-indigo padding-20">
        <div className="flex-between align-center">
          <div className="flex-center-left gap-12">
            <div className="algo-icon-badge">
              <Zap size={24} className="text-indigo" />
            </div>
            <div>
              <h3 className="font-extrabold text-16 text-white flex-center gap-6">
                Algoritmo de Agrupamiento y Optimización de Rutas
              </h3>
              <p className="text-muted text-13 margin-top-2">
                Procesa las solicitudes en estado <strong className="text-amber">SEARCHING</strong>, calcula afinidades geográficas/temporales y genera los viajes en combi.
              </p>
            </div>
          </div>

          <div className="algo-action-container flex-column align-end gap-8 shrink-0">
            <span className="badge badge-subtle font-bold text-xs flex-center gap-4">
              <Sparkles size={13} className="text-amber" />
              {searchingCount} Solicitudes Pendientes
            </span>

            <button
              type="button"
              className="btn-primary btn-algo-launch flex-center gap-8"
              onClick={handleExecuteAlgorithm}
              disabled={isProcessing || searchingCount === 0}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="spinner" />
                  Procesando Algoritmo...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Ejecutar Algoritmo ({searchingCount})
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Summary Notification */}
        {lastAlgorithmResult && (
          <div className="banner banner-success margin-top-16 flex-column gap-6">
            <div className="flex-between align-center">
              <strong className="flex-center gap-6 text-14">
                <CheckCircle2 size={18} /> ¡Algoritmo Ejecutado con Éxito!
              </strong>
              <button className="btn-text text-xs" onClick={() => setLastAlgorithmResult(null)}>Cerrar</button>
            </div>
            <p className="text-13">
              {lastAlgorithmResult.summary.message}
            </p>

            {lastAlgorithmResult.newTrips.length > 0 && (
              <div className="new-trips-summary-list flex-row gap-8 margin-top-8">
                {lastAlgorithmResult.newTrips.map(trip => (
                  <span key={trip.tripId} className="badge badge-emerald text-xs font-mono flex-center gap-4">
                    <Bus size={12} /> Combi {trip.tripId} ({trip.stops.length / 2} Pasajeros Afines)
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card bg-indigo">
          <div className="stat-icon bg-indigo">
            <Layers size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Solicitudes</span>
            <span className="stat-value">{totalCount}</span>
          </div>
        </div>

        <div className="stat-card bg-amber">
          <div className="stat-icon bg-amber">
            <AlertCircle size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Buscando Combi (SEARCHING)</span>
            <span className="stat-value">{searchingCount}</span>
          </div>
        </div>

        <div className="stat-card bg-emerald">
          <div className="stat-icon bg-emerald">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Combi Asignada (CONFIRMED)</span>
            <span className="stat-value">{matchedCount}</span>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="filters-toolbar flex-between gap-16">
        <div className="search-input-wrapper flex-grow relative">
          <Search size={16} className="search-icon-inside text-muted" />
          <input
            type="text"
            className="form-input padding-left-36"
            placeholder="Buscar por ID, Usuario, Origen o Destino..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-center gap-8">
          <Filter size={16} className="text-muted" />
          <select
            className="form-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Todos los Estados</option>
            <option value="SEARCHING">SEARCHING (Buscando)</option>
            <option value="CONFIRMED">CONFIRMED (Asignado)</option>
            <option value="CANCELLED">CANCELLED (Cancelado)</option>
          </select>
        </div>
      </div>

      {/* Requests Table / List */}
      {filteredRequests.length === 0 ? (
        <div className="empty-placeholder text-center padding-32">
          <AlertCircle size={32} className="margin-bottom-8 text-muted" />
          <p>No se encontraron solicitudes registradas que coincidan con los filtros.</p>
        </div>
      ) : (
        <div className="admin-requests-list flex-column gap-16">
          {filteredRequests.map((req) => (
            <div key={req.requestId} className="request-admin-card card glass-card">
              <div className="flex-between align-center border-bottom-glass padding-bottom-8 margin-bottom-12">
                <div className="flex-center gap-8">
                  <span className="badge badge-subtle font-mono">ID: {req.requestId}</span>
                  <span className="text-xs text-muted flex-center gap-4">
                    <User size={14} className="text-indigo" />
                    <strong>{req.userName || 'Usuario Pasajero'}</strong> ({req.userEmail || 'demo@email.com'})
                  </span>
                </div>
                <div className="flex-center gap-8">
                  <select
                    className="form-input text-xs padding-4-8"
                    value={req.status || 'SEARCHING'}
                    onChange={(e) => onUpdateStatus(req.requestId, e.target.value)}
                  >
                    <option value="SEARCHING">SEARCHING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                  <button
                    className="btn-icon-danger"
                    onClick={() => onDeleteRequest(req.requestId)}
                    title="Eliminar solicitud"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="admin-route-summary grid-2-col gap-12">
                <div>
                  <span className="text-xs text-muted block uppercase">Origen</span>
                  <strong className="text-emerald text-14 flex-center-left gap-4">
                    <MapPin size={14} /> {req.origin?.address || 'Origen'}
                  </strong>
                </div>
                <div>
                  <span className="text-xs text-muted block uppercase">Destino</span>
                  <strong className="text-indigo text-14 flex-center-left gap-4">
                    <Navigation size={14} /> {req.destination?.address || 'Destino'}
                  </strong>
                </div>
              </div>

              <div className="flex-between align-center margin-top-12">
                <span className="text-xs text-muted flex-center gap-4">
                  <Clock size={13} /> Hora Salida: {new Date(req.departureTime).toLocaleDateString()} a las {new Date(req.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs
                </span>
                <button
                  className="btn-secondary text-xs flex-center gap-4"
                  onClick={() => onViewMatches(req)}
                >
                  Ver Recorrido Combi <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
