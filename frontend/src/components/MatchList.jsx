import React from 'react';
import { Users, DollarSign, TrendingDown, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function MatchList({ requestId, matches, onSelectTrip, onReset }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="card glass-card empty-state">
        <h3>No se encontraron coincidencias directas</h3>
        <p>Intenta ajustar la hora aproximada o cambiar la ubicación.</p>
        <button onClick={onReset} className="btn-secondary">Volver a Buscar</button>
      </div>
    );
  }

  return (
    <div className="card glass-card match-card">
      <div className="card-header flex-between">
        <div>
          <h2>Viajes Compatibles Encontrados</h2>
          <span className="badge badge-subtle">Solicitud ID: {requestId}</span>
        </div>
        <button onClick={onReset} className="btn-text">Nueva búsqueda</button>
      </div>

      <div className="match-grid">
        {matches.map((match) => {
          const occupancyPercent = Math.round((match.passengerCount / match.capacity) * 100);

          return (
            <div key={match.tripId} className="trip-match-item">
              <div className="match-header">
                <div className="trip-id-badge">
                  <CheckCircle2 size={16} className="text-emerald" />
                  <span>Combi ID: {match.tripId}</span>
                </div>
                <div className="savings-tag">
                  <TrendingDown size={14} />
                  <span>{match.estimatedSavings}% de Ahorro</span>
                </div>
              </div>

              <div className="match-body">
                {/* Ocupación */}
                <div className="info-block">
                  <div className="info-label">
                    <Users size={16} /> Pasajeros Agrupados
                  </div>
                  <div className="info-value">
                    {match.passengerCount} / {match.capacity} personas
                  </div>
                  <div className="capacity-bar-bg">
                    <div 
                      className="capacity-bar-fill"
                      style={{ width: `${occupancyPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Precio Estimado */}
                <div className="info-block">
                  <div className="info-label">
                    <DollarSign size={16} /> Precio Estimado / Pasajero
                  </div>
                  <div className="price-value">
                    ${match.estimatedPrice.toLocaleString('es-AR')}
                  </div>
                </div>

                {/* Horario de Salida */}
                <div className="info-block">
                  <div className="info-label">
                    <Clock size={16} /> Horario Salida
                  </div>
                  <div className="info-value">
                    {new Date(match.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs
                  </div>
                </div>
              </div>

              <div className="match-footer">
                <button 
                  onClick={() => onSelectTrip(match.tripId)} 
                  className="btn-primary btn-full"
                >
                  Ver Recorrido y Paradas <ArrowRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
