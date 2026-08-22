import React from 'react';
import { CheckCircle2, MapPin, Navigation, Clock, PlusCircle, ListOrdered } from 'lucide-react';

export default function RequestConfirmation({ requestData, onCreateAnother, onViewMyRequests }) {
  if (!requestData) return null;

  return (
    <div className="card glass-card confirmation-card">
      <div className="card-header text-center padding-bottom-16 border-bottom-glass">
        <div className="flex-center margin-bottom-12">
          <div className="success-icon-badge">
            <CheckCircle2 size={40} className="text-emerald" />
          </div>
        </div>
        <h2 className="text-gradient-emerald font-extrabold text-24">
          ¡Solicitud Cargada Exitosamente!
        </h2>
        <p className="card-subtitle margin-top-4">
          Tu pedido de viaje en combi compartida ha sido registrado correctamente en el sistema.
        </p>
      </div>

      <div className="confirmation-body margin-top-24 flex-column gap-16">
        <div className="flex-between align-center bg-slate-800-50 padding-12 rounded-lg border-glass">
          <span className="badge badge-subtle font-mono">ID de Solicitud: {requestData.requestId}</span>
          <span className="badge badge-success font-bold">Estado: {requestData.status || 'SEARCHING'}</span>
        </div>

        <div className="route-details-box bg-slate-900-80 padding-20 rounded-xl border-glass flex-column gap-12">
          <div className="flex-center-left gap-10">
            <MapPin size={18} className="text-emerald shrink-0" />
            <div>
              <span className="text-xs text-muted block uppercase font-bold">Punto de Origen</span>
              <strong className="text-white text-15">{requestData.origin.address}</strong>
              <div className="text-xs text-muted font-mono margin-top-2">
                Lat: {requestData.origin.latitude} | Lng: {requestData.origin.longitude}
              </div>
            </div>
          </div>

          <div className="divider-line"></div>

          <div className="flex-center-left gap-10">
            <Navigation size={18} className="text-indigo shrink-0" />
            <div>
              <span className="text-xs text-muted block uppercase font-bold">Punto de Destino</span>
              <strong className="text-white text-15">{requestData.destination.address}</strong>
              <div className="text-xs text-muted font-mono margin-top-2">
                Lat: {requestData.destination.latitude} | Lng: {requestData.destination.longitude}
              </div>
            </div>
          </div>

          <div className="divider-line"></div>

          <div className="flex-center-left gap-10">
            <Clock size={18} className="text-amber shrink-0" />
            <div>
              <span className="text-xs text-muted block uppercase font-bold">Horario de Salida Solicitado</span>
              <strong className="text-white text-15">
                {new Date(requestData.departureTime).toLocaleDateString()} a las {new Date(requestData.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs
              </strong>
            </div>
          </div>
        </div>

        <div className="banner banner-info font-normal text-13">
          <strong>¿Qué sucede ahora?</strong> Tu solicitud permanecerá activa mientras el sistema agrupa pasajeros compatibles con origenes y destinos cercanos para formar la combi ideal.
        </div>

        <div className="flex-row gap-12 margin-top-12">
          <button onClick={onCreateAnother} className="btn-primary flex-1 flex-center">
            <PlusCircle size={18} /> Crear Otra Solicitud
          </button>
          <button onClick={onViewMyRequests} className="btn-secondary flex-1 flex-center">
            <ListOrdered size={18} /> Ver Mis Solicitudes
          </button>
        </div>
      </div>
    </div>
  );
}
