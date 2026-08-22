import React from 'react';
import { PlusCircle, Clock, MapPin, Navigation } from 'lucide-react';

export default function MyRequestsPage({
  userRequests,
  onNewRequest,
  onViewMatches
}) {
  return (
    <div className="card glass-card padding-28">
      <div className="card-header flex-between align-center border-bottom-glass padding-bottom-16">
        <div>
          <h2 className="text-gradient-white text-22 font-extrabold">Mis Solicitudes de Viaje Cargadas</h2>
          <p className="text-muted text-xs margin-top-2">Historial de reservas e itinerarios solicitados</p>
        </div>
        <button 
          className="btn-primary flex-center gap-6"
          onClick={onNewRequest}
        >
          <PlusCircle size={16} /> Nueva Solicitud
        </button>
      </div>

      {userRequests.length === 0 ? (
        <div className="empty-state padding-40 text-center flex-column align-center gap-12">
          <h3 className="text-white text-18 font-bold">No has cargado solicitudes de viaje todavía.</h3>
          <p className="text-muted text-14 max-w-500">Crea tu primera solicitud indicando tu dirección de origen, destino y hora deseada de salida.</p>
          <button 
            className="btn-primary margin-top-12 flex-center gap-6"
            onClick={onNewRequest}
          >
            <PlusCircle size={16} /> Cargar Primera Solicitud
          </button>
        </div>
      ) : (
        <div className="requests-list flex-column gap-16 margin-top-20">
          {userRequests.map((req) => (
            <div key={req.requestId} className="request-card-item card glass-card padding-20">
              <div className="flex-between align-center border-bottom-glass padding-bottom-8 margin-bottom-12">
                <span className="badge badge-subtle font-mono text-xs">ID Solicitud: {req.requestId}</span>
                <span className={`badge ${req.status === 'CONFIRMED' ? 'badge-emerald' : 'badge-amber'} text-xs font-bold`}>
                  Estado: {req.status}
                </span>
              </div>

              <div className="grid-2-col gap-12 margin-bottom-12">
                <div>
                  <span className="text-xs text-muted block uppercase font-semibold">Origen</span>
                  <strong className="text-emerald text-14 flex-center-left gap-4">
                    <MapPin size={14} /> {req.origin?.address || 'Origen'}
                  </strong>
                </div>
                <div>
                  <span className="text-xs text-muted block uppercase font-semibold">Destino</span>
                  <strong className="text-indigo text-14 flex-center-left gap-4">
                    <Navigation size={14} /> {req.destination?.address || 'Destino'}
                  </strong>
                </div>
              </div>

              <div className="flex-between align-center margin-top-12 border-top-glass padding-top-8">
                <span className="text-xs text-muted flex-center gap-4">
                  <Clock size={13} /> Hora de salida: {new Date(req.departureTime).toLocaleDateString()} {new Date(req.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs
                </span>
                <button
                  className="btn-secondary text-xs"
                  onClick={() => onViewMatches(req)}
                >
                  Ver Recorrido Asignado
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
