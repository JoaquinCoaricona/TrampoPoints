import React, { useState } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import {
  Bus,
  Star,
  FileCheck,
  User,
  ArrowRight,
  ChevronRight,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trash2,
  X
} from 'lucide-react';
import { updateVehicleStatus, getDriverTrips, deleteDriverTrip } from '../../services/driverService';
import ConfirmModal from '../ConfirmModal';

export default function DriverDashboard({ dashboardData: propData, onRefresh: propRefresh }) {
  const navigate = useNavigate();
  const outletCtx = useOutletContext() || {};
  const dashboardData = propData || outletCtx.dashboardData;
  const onRefresh = propRefresh || outletCtx.onRefresh;
  const [updatingStatus, setUpdatingStatus] = useState(false);
  // Optimistic local status (sobreescribe el del dashboard mientras actualiza)
  const [localVehicleStatus, setLocalVehicleStatus] = useState(null);

  const [trips, setTrips] = React.useState([]);
  const [loadingTrips, setLoadingTrips] = React.useState(true);

  // Registro de notificaciones de viajes ya vistas/descartadas
  const [dismissedTripIds, setDismissedTripIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tp_dismissed_driver_trips') || '[]');
    } catch {
      return [];
    }
  });

  const handleDismissNotification = (tripId) => {
    if (!tripId || dismissedTripIds.includes(tripId)) return;
    const next = [...dismissedTripIds, tripId];
    setDismissedTripIds(next);
    try {
      localStorage.setItem('tp_dismissed_driver_trips', JSON.stringify(next));
    } catch (e) {
      console.warn('Error al guardar dismissed trip notification:', e);
    }
  };

  const [tripToDelete, setTripToDelete] = useState(null);
  const [deletingTrip, setDeletingTrip] = useState(false);

  const handleDeleteTrip = async () => {
    if (!tripToDelete) return;
    setDeletingTrip(true);
    try {
      await deleteDriverTrip(tripToDelete);
      setTrips(prev => prev.filter(t => t.tripId !== tripToDelete));
      handleDismissNotification(tripToDelete);
      if (onRefresh) onRefresh();
      setTripToDelete(null);
    } catch (err) {
      console.error('Error al cancelar viaje:', err);
      alert('No se pudo cancelar el viaje.');
    } finally {
      setDeletingTrip(false);
    }
  };

  React.useEffect(() => {
    async function loadTrips() {
      try {
        const data = await getDriverTrips();
        setTrips(data || []);
      } catch (err) {
        console.error('Error al cargar viajes del chofer:', err);
      } finally {
        setLoadingTrips(false);
      }
    }
    loadTrips();
  }, []);

  const activeTrip = trips.find(t => t.status === 'CONFIRMED' || t.status === 'ACTIVE');
  const showNotification = activeTrip && !dismissedTripIds.includes(activeTrip.tripId);

  if (!dashboardData) {
    return (
      <div className="driver-editorial-dashboard" style={{ opacity: 0.7, pointerEvents: 'none' }}>
        <header className="driver-dash-header flex-between align-start flex-wrap gap-20 margin-bottom-32">
          <div className="dash-greeting-area flex-column gap-12">
            <div className="skeleton-box shimmer-wave" style={{ width: '220px', height: '36px', borderRadius: '6px' }} />
            <div className="skeleton-box shimmer-wave" style={{ width: '140px', height: '28px', borderRadius: '20px' }} />
          </div>
          <div className="skeleton-box shimmer-wave" style={{ width: '280px', height: '44px', borderRadius: '12px' }} />
        </header>

        <div className="hairline-divider margin-bottom-48" />

        <section className="dash-operation-spotlight margin-bottom-56">
          <div className="operation-headline-wrap flex-column gap-16">
            <div className="skeleton-box shimmer-wave" style={{ width: '120px', height: '14px', borderRadius: '4px' }} />
            <div className="skeleton-box shimmer-wave" style={{ width: '340px', height: '40px', borderRadius: '8px' }} />
            <div className="skeleton-box shimmer-wave" style={{ width: '260px', height: '20px', borderRadius: '4px' }} />
          </div>
          <div className="operation-integrated-metrics flex-center gap-32 flex-wrap margin-top-28">
            <div className="skeleton-box shimmer-wave" style={{ width: '150px', height: '54px', borderRadius: '8px' }} />
            <div className="metric-vertical-separator" />
            <div className="skeleton-box shimmer-wave" style={{ width: '130px', height: '54px', borderRadius: '8px' }} />
            <div className="metric-vertical-separator" />
            <div className="skeleton-box shimmer-wave" style={{ width: '160px', height: '54px', borderRadius: '8px' }} />
          </div>
        </section>

        <div className="hairline-divider margin-bottom-48" />

        <section className="driver-trips-section">
          <div className="skeleton-box shimmer-wave margin-bottom-16" style={{ width: '160px', height: '16px', borderRadius: '4px' }} />
          <div className="skeleton-box shimmer-wave" style={{ width: '100%', height: '140px', borderRadius: '16px' }} />
        </section>
      </div>
    );
  }

  const { driver, vehicle, ratingSummary, validDocsCount, expiredDocsCount, topRecommendations } = dashboardData;
  // Estado efectivo: el local (optimista) tiene prioridad sobre el del backend
  const effectiveVehicleStatus = localVehicleStatus || vehicle?.status;

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    setLocalVehicleStatus(newStatus); // Optimistic: actualizar UI de inmediato
    try {
      await updateVehicleStatus(newStatus);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      setLocalVehicleStatus(vehicle?.status); // Revertir si falla
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="driver-editorial-dashboard">
      {showNotification && (
        <div className="driver-notification-banner margin-bottom-32 flex-between align-center gap-16">
          <div className="flex-center gap-12">
            <span className="dot pulse"></span>
            <div className="flex-column gap-2">
              <span className="banner-title" style={{ textAlign: 'left', display: 'block' }}>¡Nuevo viaje asignado!</span>
              <span className="banner-desc text-muted" style={{ textAlign: 'left', display: 'block' }}>
                Tenes un recorrido confirmado desde <strong>{activeTrip.stops[0]?.address || 'Origen'}</strong> a las <strong>{activeTrip.departureTime}</strong>.
              </span>
            </div>
          </div>
          <div className="flex-center gap-8">
            <Link
              to={`/driver/trip/${activeTrip.tripId}`}
              className="banner-btn flex-center gap-6"
              onClick={() => handleDismissNotification(activeTrip.tripId)}
            >
              <span>Ver Recorrido</span>
              <ArrowRight size={14} />
            </Link>
            <button
              type="button"
              onClick={() => handleDismissNotification(activeTrip.tripId)}
              title="Descartar notificación"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#a1a1aa',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 1. Header: Saludo Directo + Estado Operativo */}
      <header className="dash-hero-header flex-between align-center flex-wrap gap-24 margin-bottom-48">
        <div className="flex-column gap-6">
          <h1 className="dash-greeting-title">
            Hola, <span className="text-neon-green">{driver?.name?.split(' ')[0] || 'Chofer'}</span>
          </h1>
          <div className="dash-status-indicator flex-center gap-8">
            {effectiveVehicleStatus === 'AVAILABLE' && (
              <span className="status-live-pill text-neon-green">
                <span className="dot pulse"></span> Disponible para viajes
              </span>
            )}
            {effectiveVehicleStatus === 'UNAVAILABLE' && (
              <span className="status-live-pill text-amber">
                <span className="dot dot-amber"></span> En Pausa temporal
              </span>
            )}
            {effectiveVehicleStatus === 'OUT_OF_SERVICE' && (
              <span className="status-live-pill text-rose">
                <span className="dot dot-red"></span> En Mantenimiento
              </span>
            )}
          </div>
        </div>

        {/* Compact Status Segmented Switch */}
        <div className="segmented-toggle-row">
          <button
            type="button"
            className={`seg-btn ${effectiveVehicleStatus === 'AVAILABLE' ? 'active-green' : ''}`}
            onClick={() => handleStatusChange('AVAILABLE')}
            disabled={updatingStatus || effectiveVehicleStatus === 'AVAILABLE'}
          >
            Disponible
          </button>
          <button
            type="button"
            className={`seg-btn ${effectiveVehicleStatus === 'UNAVAILABLE' ? 'active-amber' : ''}`}
            onClick={() => handleStatusChange('UNAVAILABLE')}
            disabled={updatingStatus || effectiveVehicleStatus === 'UNAVAILABLE'}
          >
            Pausa
          </button>
          <button
            type="button"
            className={`seg-btn ${effectiveVehicleStatus === 'OUT_OF_SERVICE' ? 'active-red' : ''}`}
            onClick={() => handleStatusChange('OUT_OF_SERVICE')}
            disabled={updatingStatus || effectiveVehicleStatus === 'OUT_OF_SERVICE'}
          >
            Taller
          </button>
        </div>
      </header>

      <div className="hairline-divider margin-bottom-48" />

      {/* 2. Operación Actual (Hero Dominante de la Página) */}
      <section className="dash-operation-spotlight margin-bottom-56">
        <div className="operation-headline-wrap flex-column gap-16">
          <span className="section-eyebrow text-neon-green">Unidad Asignada</span>
          <h2 className="operation-vehicle-name margin-bottom-12">
            {vehicle?.brand || 'Mercedes-Benz'} {vehicle?.model || 'Sprinter 516 CDI'}
          </h2>
          <div className="operation-metadata-line flex-center gap-14 text-muted flex-wrap">
            <span className="text-main font-medium">{vehicle?.passengerCapacity || 20} pasajeros</span>
            <span className="meta-dot">·</span>
            <span className="text-main font-medium">Patente {vehicle?.licensePlate || 'AF 482 TP'}</span>
            <span className="meta-dot">·</span>
            <span>{vehicle?.color || 'Blanco Ártico'}</span>
            
          </div>
          <br></br>
        </div>

        {/* Integrated Metrics Row (Reputación, Viajes y Documentación integrados con la unidad) */}
        <div className="operation-integrated-metrics flex-center gap-32 flex-wrap margin-top-28">
          <div className="integrated-metric-item flex-center gap-10">
            <span className="integrated-score-num text-electric-violet">
              {ratingSummary?.ratingAverage?.toFixed(1) || '4.8'}
            </span>
            <div className="flex-column gap-2">
              <div className="flex-center gap-3">
                <Star size={14} className="text-electric-violet" fill="#7C4DFF" />
                <span className="text-sm font-semibold text-main">Excelente</span>
              </div>
              <span className="text-xs text-muted">
                {ratingSummary?.totalRatings || 103} opiniones
              </span>
            </div>
          </div>

          <div className="metric-vertical-separator" />

          <div className="integrated-metric-item flex-column gap-2">
            <span className="text-sm text-muted">Viajes Realizados</span>
            <span className="text-lg font-extrabold text-main">
              {driver?.tripsCompleted || 42} <span className="text-xs text-muted font-normal">completados</span>
            </span>
          </div>

          <div className="metric-vertical-separator" />

          <div className="integrated-metric-item flex-column gap-2">
            <span className="text-sm text-muted">Documentación</span>
            <span className="text-sm font-semibold text-neon-green flex-center gap-6">
              <CheckCircle2 size={14} /> {validDocsCount || 4}/4 al día
            </span>
          </div>
        </div>
      </section>

      <div className="hairline-divider margin-bottom-48" />

      {/* Viajes Asignados Section */}
      <section className="driver-trips-section margin-bottom-56">
        <span className="section-eyebrow text-muted margin-bottom-16 block">Mis Viajes Asignados</span>
        {loadingTrips ? (
          <div className="skeleton-box shimmer-wave" style={{ height: '100px', borderRadius: '10px' }} />
        ) : trips.length === 0 ? (
          <div className="driver-trip-card flex-center text-muted" style={{ padding: '40px' }}>
            <Bus size={24} className="text-dim margin-bottom-8" />
            <span>No tenés ningún viaje asignado en este momento.</span>
          </div>
        ) : (
          <div className="driver-trips-list">
            {trips.map((trip) => (
              <div key={trip.tripId} className="driver-trip-card">
                <div className="driver-trip-card-header">
                  <div className="flex-center gap-10">
                    <span className="driver-trip-id">ID: {trip.tripId}</span>
                    <span className="driver-trip-time">{trip.departureTime}</span>
                  </div>
                  <span className="status-live-pill text-neon-green">
                    {trip.status === 'CONFIRMED' ? 'Confirmado' : trip.status}
                  </span>
                </div>
                <div className="driver-trip-addresses">
                  <div className="driver-address-row">
                    <span className="driver-address-indicator"></span>
                    <div className="flex-column">
                      <span className="text-sm font-semibold text-main">Origen</span>
                      <span className="text-xs text-muted">{trip.stops[0]?.address || 'Dirección de Origen'}</span>
                    </div>
                  </div>
                  <div className="driver-address-row">
                    <span className="driver-address-indicator dest"></span>
                    <div className="flex-column">
                      <span className="text-sm font-semibold text-main">Destino</span>
                      <span className="text-xs text-muted">{trip.stops[trip.stops.length - 1]?.address || 'Dirección de Destino'}</span>
                    </div>
                  </div>
                </div>
                <div className="driver-trip-stats-row flex-between align-center flex-wrap gap-12">
                  <div className="flex-center gap-24">
                    <div className="driver-trip-stat">
                      <User size={14} className="text-muted" />
                      <span>{trip.passengerCount} / {trip.capacity} Pasajeros</span>
                    </div>
                    <div className="driver-trip-stat">
                      <MapPin size={14} className="text-muted" />
                      <span>{trip.stops.length} Paradas</span>
                    </div>
                  </div>
                  <div className="flex-center gap-8 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setTripToDelete(trip.tripId)}
                      className="driver-trip-action"
                      style={{
                        borderColor: 'rgba(244, 63, 94, 0.25)',
                        background: 'rgba(244, 63, 94, 0.06)',
                        color: '#f43f5e',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      title="Liberar chofer y cancelar este viaje"
                    >
                      <Trash2 size={13} />
                      <span>Liberar viaje</span>
                    </button>

                    <Link to={`/driver/trip/${trip.tripId}`} className="driver-trip-action flex-center gap-6">
                      <span>Ver Recorrido</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="hairline-divider margin-bottom-48" />

      {/* 3. Gestión (Lista Vertical con Separadores Sutiles, No Cards) */}
      <section className="dash-management-section margin-bottom-56">
        <span className="section-eyebrow text-muted margin-bottom-16 block">Gestión</span>

        <div className="management-vertical-list">
          <Link to="/driver/vehicle" className="mgmt-row-item flex-between align-center">
            <div className="flex-center gap-16">
              <Bus size={18} className="text-neon-green flex-shrink-0" />
              <span className="mgmt-title">Mi vehículo</span>
            </div>
            <ChevronRight size={18} className="mgmt-arrow text-muted" />
          </Link>

          <Link to="/driver/profile" className="mgmt-row-item flex-between align-center">
            <div className="flex-center gap-16">
              <User size={18} className="text-electric-violet flex-shrink-0" />
              <span className="mgmt-title">Perfil del chofer</span>
            </div>
            <ChevronRight size={18} className="mgmt-arrow text-muted" />
          </Link>

          <Link to="/driver/documents" className="mgmt-row-item flex-between align-center">
            <div className="flex-center gap-16">
              <FileCheck size={18} className="text-neon-green flex-shrink-0" />
              <span className="mgmt-title">Documentación y habilitaciones</span>
            </div>
            <ChevronRight size={18} className="mgmt-arrow text-muted" />
          </Link>

          <Link to="/driver/ratings" className="mgmt-row-item flex-between align-center">
            <div className="flex-center gap-16">
              <Star size={18} className="text-electric-violet flex-shrink-0" />
              <span className="mgmt-title">Calificaciones y reseñas</span>
            </div>
            <ChevronRight size={18} className="mgmt-arrow text-muted" />
          </Link>
        </div>
      </section>

      <div className="hairline-divider margin-bottom-48" />

      {/* 4. Opiniones Recientes (Flujo Editorial Continuo) */}
      {topRecommendations && topRecommendations.length > 0 && (
        <section className="dash-opinions-section">
          <div className="flex-between align-center margin-bottom-24">
            <span className="section-eyebrow text-muted">Opiniones Recientes</span>
            <Link to="/driver/recommendations" className="inline-action-link text-electric-violet text-sm flex-center gap-6">
              <span>Ver todas ({topRecommendations.length})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="opinions-editorial-flow flex-column gap-32">
            {topRecommendations.slice(0, 2).map((rec, index) => (
              <div key={rec.id || index} className="opinion-editorial-entry flex-column gap-8">
                <blockquote className="opinion-quote-body">
                  "{rec.quote}"
                </blockquote>
                <div className="opinion-author-line flex-center gap-10 text-sm">
                  <span className="text-main font-semibold">{rec.passengerName}</span>
                  {rec.tripRoute && (
                    <span className="text-muted flex-center gap-6">
                      · <MapPin size={13} className="text-neon-green" /> {rec.tripRoute}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <ConfirmModal
        isOpen={!!tripToDelete}
        onClose={() => setTripToDelete(null)}
        onConfirm={handleDeleteTrip}
        title="Cancelar Viaje"
        subtitle="¿Deseás liberar y cancelar este viaje asignado? Quedarás libre para nuevos viajes."
        confirmText="Liberar Viaje"
        isLoading={deletingTrip}
      />
    </div>
  );
}
