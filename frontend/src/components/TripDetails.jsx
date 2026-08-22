import React from 'react';
import { Users, DollarSign, TrendingDown, Clock, MapPin, Navigation, ArrowLeft, CheckCircle } from 'lucide-react';
import MapView from './MapView';

export default function TripDetails({ tripData, onBack }) {
  if (!tripData) return null;

  const {
    tripId,
    status,
    passengerCount,
    capacity,
    estimatedPricePerPassenger,
    estimatedSavingsPercent,
    departureTime,
    route,
    stops
  } = tripData;

  const distanceKm = (route.distanceMeters / 1000).toFixed(1);
  const durationMin = Math.round(route.durationSeconds / 60);

  return (
    <div className="trip-details-layout">
      {/* Header Bar */}
      <div className="card glass-card">
        <div className="flex-between">
          <button onClick={onBack} className="btn-secondary btn-icon-text">
            <ArrowLeft size={16} /> Volver
          </button>

          <div className="status-header">
            <span className="badge badge-success flex-center">
              <CheckCircle size={14} /> Estado: {status}
            </span>
            <span className="trip-id-text">ID: {tripId}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-grid margin-top-16">
          <div className="stat-card">
            <div className="stat-icon bg-indigo">
              <Users size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Pasajeros</span>
              <span className="stat-value">{passengerCount} / {capacity}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-emerald">
              <DollarSign size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Precio x Pasajero</span>
              <span className="stat-value">${estimatedPricePerPassenger?.toLocaleString('es-AR')}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-amber">
              <TrendingDown size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Ahorro Estimado</span>
              <span className="stat-value text-amber">{estimatedSavingsPercent}%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-blue">
              <Clock size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Distancia y Tiempo</span>
              <span className="stat-value">{distanceKm} km ({durationMin} min)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Map & Stops */}
      <div className="details-grid">
        {/* Map View */}
        <div className="card glass-card">
          <div className="card-header">
            <h3>Trazado de Ruta y Paradas</h3>
          </div>
          <MapView stops={stops} polyline={route.polyline} />
        </div>

        {/* Stops List */}
        <div className="card glass-card">
          <div className="card-header">
            <h3>Paradas Ordenadas del Viaje ({stops?.length || 0})</h3>
          </div>

          <div className="stops-timeline">
            {stops?.map((stop, index) => {
              const isPickup = stop.type === 'PICKUP';
              return (
                <div key={stop.stopId || index} className="timeline-item">
                  <div className={`timeline-badge ${isPickup ? 'badge-pickup' : 'badge-dropoff'}`}>
                    {stop.order}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title flex-between">
                      <span className="stop-type">
                        {isPickup ? <MapPin size={14} className="text-emerald" /> : <Navigation size={14} className="text-rose" />}
                        {isPickup ? 'Parada de Subida (PICKUP)' : 'Parada de Bajada (DROPOFF)'}
                      </span>
                      <span className="stop-order">Orden #{stop.order}</span>
                    </div>
                    <div className="stop-address">{stop.address}</div>
                    <div className="stop-coords">
                      Lat: {stop.latitude.toFixed(4)}, Lng: {stop.longitude.toFixed(4)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
