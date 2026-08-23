import React from 'react';
import { Users, DollarSign, TrendingDown, Clock, MapPin, Navigation, ArrowLeft, CheckCircle, User } from 'lucide-react';
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
    stops,
    driver,
    vehicle
  } = tripData;

  const distanceKm = (route.distanceMeters / 1000).toFixed(1);
  const durationMin = Math.round(route.durationSeconds / 60);

  return (
    <div className="trip-details-layout">
      {/* Dynamic CSS Overrides for Premium Map Layout */}
      <style>{`
        .trip-details-layout {
          width: 94vw;
          max-width: 1600px;
          margin-left: calc(-47vw + 50%);
          margin-right: calc(-47vw + 50%);
          align-self: center;
          color: #f4f4f5;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          padding-bottom: 120px; /* Generous space before the footer */
          box-sizing: border-box;
        }

        .trip-details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #1f1f23;
          padding-bottom: 16px;
        }

        .trip-back-btn {
          background: transparent;
          color: #ffffff;
          border: 1px solid #27272a;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.15s, border-color 0.15s;
        }
        .trip-back-btn:hover {
          background: #18181b;
          border-color: #3f3f46;
        }

        .trip-header-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .trip-status-pill {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.25);
          color: #34d399;
          font-size: 11px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 20px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .trip-id-tag {
          font-size: 12px;
          font-weight: 500;
          color: #71717a;
          font-family: monospace;
          background: #18181b;
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #27272a;
        }

        /* Combined Stats Strip - Premium alternative to generic boxes */
        .trip-stats-strip {
          display: flex;
          align-items: center;
          gap: 24px;
          background: #09090b;
          border: 1px solid #1c1c22;
          border-radius: 10px;
          padding: 14px 24px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .trip-stat-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #cbd5e1;
        }

        .trip-stat-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
        }
        .icon-users { background: rgba(99, 102, 241, 0.1); color: #818cf8; }
        .icon-dollar { background: rgba(16, 185, 129, 0.1); color: #34d399; }
        .icon-savings { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }
        .icon-route { background: rgba(59, 130, 246, 0.1); color: #60a5fa; }

        .trip-stat-label {
          color: #71717a;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 2px;
          display: block;
        }

        .trip-stat-value {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
        }

        .trip-stat-divider {
          width: 1px;
          height: 24px;
          background: #1c1c22;
        }

        @media (max-width: 768px) {
          .trip-stat-divider {
            display: none;
          }
          .trip-stats-strip {
            gap: 16px;
            padding: 16px;
          }
        }

        /* Grid System - Expanded Map on Left, Stops stretching on Right */
        .trip-details-grid {
          display: grid;
          grid-template-columns: 2.8fr 1.2fr;
          gap: 32px;
          width: 100%;
          align-items: start;
        }

        @media (max-width: 1100px) {
          .trip-details-grid {
            grid-template-columns: 1fr;
          }
          .trip-details-layout {
            width: 100%;
            margin-left: 0;
            margin-right: 0;
            padding: 0 16px;
          }
        }

        /* Map Container - massive height */
        .trip-map-card {
          background: #09090b;
          border: 1px solid #1c1c22;
          border-radius: 12px;
          overflow: hidden;
          height: 700px;
          position: relative;
        }

        /* Stops Sidebar - Stretching down completely without scroll boxes */
        .trip-stops-sidebar {
          background: #09090b;
          border: 1px solid #1c1c22;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: auto;
          max-height: none;
          overflow: visible;
        }

        .trip-stops-sidebar-title {
          font-size: 15px;
          font-weight: 700;
          margin: 0;
          color: #ffffff;
          padding-bottom: 14px;
          border-bottom: 1px solid #1c1c22;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .trip-stops-count-badge {
          background: #18181b;
          border: 1px solid #27272a;
          color: #a1a1aa;
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 600;
        }

        /* Timeline Stops */
        .stops-timeline-premium {
          display: flex;
          flex-direction: column;
          position: relative;
          padding-left: 24px;
          margin-top: 4px;
        }

        .stops-timeline-line {
          position: absolute;
          left: 7px;
          top: 10px;
          bottom: 10px;
          width: 2px;
          background: linear-gradient(to bottom, #10b981 0%, #6366f1 50%, #f43f5e 100%);
          opacity: 0.4;
        }

        .stop-item-premium {
          position: relative;
          margin-bottom: 24px;
        }
        .stop-item-premium:last-child {
          margin-bottom: 0;
        }

        .stop-dot-indicator {
          position: absolute;
          left: -24px;
          top: 6px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #09090b;
          border: 3px solid #1c1c22;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .stop-dot-indicator.pickup {
          border-color: #10b981;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
        }

        .stop-dot-indicator.dropoff {
          border-color: #f43f5e;
          box-shadow: 0 0 8px rgba(244, 63, 94, 0.3);
        }

        .stop-info-card {
          background: #0e0e11;
          border: 1px solid #18181b;
          border-radius: 8px;
          padding: 12px 16px;
          transition: border-color 0.2s, background-color 0.2s;
        }
        .stop-info-card:hover {
          border-color: #27272a;
          background: #111115;
        }

        .stop-info-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .stop-info-type {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .type-pickup { color: #10b981; }
        .type-dropoff { color: #f43f5e; }

        .stop-info-order {
          font-size: 10px;
          font-weight: 600;
          color: #71717a;
        }

        .stop-info-address {
          font-size: 13px;
          font-weight: 500;
          color: #e4e4e7;
          line-height: 1.45;
          margin-bottom: 4px;
        }

        .stop-info-coords {
          font-size: 10.5px;
          color: #52525b;
          font-family: monospace;
        }
      `}</style>

      {/* Top Header Row */}
      <div className="trip-details-header">
        <button onClick={onBack} className="trip-back-btn">
          <ArrowLeft size={15} /> Volver
        </button>

        <div className="trip-header-meta">
          <span className="trip-status-pill">
            <CheckCircle size={13} /> {status}
          </span>
          <span className="trip-id-tag">ID: {tripId}</span>
        </div>
      </div>

      {/* Stats Inline Strip */}
      <div className="trip-stats-strip">
        <div className="trip-stat-item">
          <div className="trip-stat-icon-wrapper icon-users">
            <Users size={16} />
          </div>
          <div>
            <span className="trip-stat-label">Pasajeros</span>
            <span className="trip-stat-value">{passengerCount} / {capacity}</span>
          </div>
        </div>

        <div className="trip-stat-divider" />

        <div className="trip-stat-item">
          <div className="trip-stat-icon-wrapper icon-dollar">
            <DollarSign size={16} />
          </div>
          <div>
            <span className="trip-stat-label">Precio Estimado</span>
            <span className="trip-stat-value">${estimatedPricePerPassenger?.toLocaleString('es-AR')}</span>
          </div>
        </div>

        <div className="trip-stat-divider" />

        <div className="trip-stat-item">
          <div className="trip-stat-icon-wrapper icon-savings">
            <TrendingDown size={16} />
          </div>
          <div>
            <span className="trip-stat-label">Ahorro Promedio</span>
            <span className="trip-stat-value">{estimatedSavingsPercent}%</span>
          </div>
        </div>

        <div className="trip-stat-divider" />

        <div className="trip-stat-item">
          <div className="trip-stat-icon-wrapper icon-route">
            <Clock size={16} />
          </div>
          <div>
            <span className="trip-stat-label">Ruta Total</span>
            <span className="trip-stat-value">{distanceKm} km ({durationMin} min)</span>
          </div>
        </div>
      </div>

      {/* Driver Info Card */}
      {driver && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          background: '#09090b',
          border: '1px solid #1c1c22',
          borderRadius: 12,
          padding: '18px 24px',
          marginBottom: 24,
          flexWrap: 'wrap',
        }}>
          {/* Imagen de la combi */}
          <div style={{
            flexShrink: 0,
            width: 120,
            height: 80,
            borderRadius: 8,
            overflow: 'hidden',
            background: '#111113',
            border: '1px solid #27272a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {vehicle?.imageUrl ? (
              <img
                src={vehicle.imageUrl}
                alt="Combi asignada"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <span style={{ fontSize: 32 }}>🚌</span>
            )}
          </div>

          {/* Info del chofer */}
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#71717a', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
              Chofer Asignado
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {driver.avatarUrl ? (
                  <img src={driver.avatarUrl} alt={driver.name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <User size={18} color="white" />
                )}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f4f4f5' }}>
                  {driver.name} {driver.lastName}
                </div>
                {driver.ratingAverage > 0 && (
                  <div style={{ fontSize: 12, color: '#fbbf24', marginTop: 1 }}>
                    ★ {driver.ratingAverage?.toFixed(1)} · {driver.totalRatings || 0} viajes
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info del vehículo */}
          {vehicle && (
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#71717a', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                Vehículo
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f4f4f5', marginBottom: 3 }}>
                {vehicle.brand} {vehicle.model}
              </div>
              <div style={{ fontSize: 12, color: '#a1a1aa', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {vehicle.licensePlate && <span>🔖 {vehicle.licensePlate}</span>}
                {vehicle.color && <span>🎨 {vehicle.color}</span>}
                {vehicle.year && <span>📅 {vehicle.year}</span>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid: Map & Stops */}
      <div className="trip-details-grid">
        {/* Map view section */}
        <div className="trip-map-card">
          <MapView stops={stops} polyline={route.polyline} height="100%" />
        </div>

        {/* Timeline stops sidebar */}
        <div className="trip-stops-sidebar">
          <h3 className="trip-stops-sidebar-title">
            <span>Paradas del Viaje</span>
            <span className="trip-stops-count-badge">{stops?.length || 0}</span>
          </h3>

          <div className="stops-timeline-premium">
            <div className="stops-timeline-line" />
            
            {stops?.map((stop, index) => {
              const isPickup = stop.type === 'PICKUP';
              return (
                <div key={stop.stopId || index} className="stop-item-premium">
                  <div className={`stop-dot-indicator ${isPickup ? 'pickup' : 'dropoff'}`} />
                  <div className="stop-info-card">
                    <div className="stop-info-header">
                      <span className={`stop-info-type ${isPickup ? 'type-pickup' : 'type-dropoff'}`}>
                        {isPickup ? 'Subida (PICKUP)' : 'Bajada (DROPOFF)'}
                      </span>
                      <span className="stop-info-order">Orden #{stop.order}</span>
                    </div>
                    <div className="stop-info-address">{stop.address}</div>
                    <div className="stop-info-coords">
                      Lat: {stop.latitude.toFixed(5)}, Lng: {stop.longitude.toFixed(5)}
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
