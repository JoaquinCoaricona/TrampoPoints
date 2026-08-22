import React, { useState } from 'react';
import {
  Bus,
  Star,
  FileCheck,
  User,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { updateVehicleStatus } from '../../services/driverService';

export default function DriverDashboard({ dashboardData, onNavigate, onRefresh }) {
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (!dashboardData) {
    return (
      <div className="driver-dashboard-skeleton flex-column gap-20">
        <div className="skeleton-hero-card skeleton-box shimmer-wave" style={{ height: '140px', borderRadius: '16px' }} />
        <div className="grid-cards-dashboard">
          <div className="skeleton-box shimmer-wave" style={{ height: '180px', borderRadius: '14px' }} />
          <div className="skeleton-box shimmer-wave" style={{ height: '180px', borderRadius: '14px' }} />
          <div className="skeleton-box shimmer-wave" style={{ height: '180px', borderRadius: '14px' }} />
        </div>
        <div className="skeleton-box shimmer-wave" style={{ height: '220px', borderRadius: '14px' }} />
      </div>
    );
  }


  const { driver, vehicle, ratingSummary, validDocsCount, expiredDocsCount, topRecommendations } = dashboardData;

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await updateVehicleStatus(newStatus);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="driver-status-pill status-available">
            <span className="dot pulse"></span> 🟢 Disponible para Viajes
          </span>
        );
      case 'UNAVAILABLE':
        return (
          <span className="driver-status-pill status-unavailable">
            <span className="dot dot-amber"></span> 🟡 No Disponible
          </span>
        );
      case 'OUT_OF_SERVICE':
        return (
          <span className="driver-status-pill status-out-of-service">
            <span className="dot dot-red"></span> 🔴 Fuera de Servicio
          </span>
        );
      default:
        return <span className="driver-status-pill">{status}</span>;
    }
  };

  return (
    <div className="driver-dashboard-view">
      {/* Welcome & Status Hero */}
      <div className="card glass-card driver-hero-card margin-bottom-24">
        <div className="driver-hero-content flex-between">
          <div className="driver-welcome-section">
            <div className="driver-greeting">
              <h2>¡Hola, {driver?.name || 'Chofer'}! 👋</h2>
              <span className="driver-role-tag">Chofer Profesional TrampoPoints</span>
            </div>
            <p className="driver-subtitle">
              Gestioná tu combi, revisá la vigencia de tu documentación y consultá la reputación de tus viajes.
            </p>
          </div>

          {/* Quick Availability Status Toggler */}
          <div className="driver-status-toggle-box">
            <span className="status-label-caption">Estado actual del vehículo:</span>
            <div className="margin-bottom-8">{getStatusBadge(vehicle?.status)}</div>
            
            <div className="status-button-group">
              <button
                className={`btn-status-toggle ${vehicle?.status === 'AVAILABLE' ? 'active-avail' : ''}`}
                onClick={() => handleStatusChange('AVAILABLE')}
                disabled={updatingStatus || vehicle?.status === 'AVAILABLE'}
              >
                Disponible
              </button>
              <button
                className={`btn-status-toggle ${vehicle?.status === 'UNAVAILABLE' ? 'active-unavail' : ''}`}
                onClick={() => handleStatusChange('UNAVAILABLE')}
                disabled={updatingStatus || vehicle?.status === 'UNAVAILABLE'}
              >
                Pausa
              </button>
              <button
                className={`btn-status-toggle ${vehicle?.status === 'OUT_OF_SERVICE' ? 'active-out' : ''}`}
                onClick={() => handleStatusChange('OUT_OF_SERVICE')}
                disabled={updatingStatus || vehicle?.status === 'OUT_OF_SERVICE'}
              >
                Taller
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Snapshot Cards Grid */}
      <div className="driver-kpi-grid margin-bottom-24">
        {/* Card 1: Vehículo */}
        <div className="card glass-card kpi-card" onClick={() => onNavigate('VEHICLE')}>
          <div className="kpi-header flex-between">
            <span className="kpi-title"><Bus size={18} className="text-indigo" /> Mi Vehículo</span>
            <span className="kpi-badge badge-indigo">{vehicle?.vehicleType || 'MINIBÚS'}</span>
          </div>
          <div className="kpi-body">
            <h3 className="kpi-main-text">{vehicle?.brand} {vehicle?.model}</h3>
            <div className="kpi-meta-row">
              <span><strong>Patente:</strong> {vehicle?.licensePlate}</span>
              <span>•</span>
              <span><strong>Año:</strong> {vehicle?.year}</span>
            </div>
            <div className="kpi-capacity-tag margin-top-8">
              👥 <strong>{vehicle?.passengerCapacity || 20} asientos</strong> para pasajeros
            </div>
          </div>
          <div className="kpi-footer flex-between">
            <span className="text-xs text-muted">Editar datos del vehículo</span>
            <ChevronRight size={16} className="text-muted" />
          </div>
        </div>

        {/* Card 2: Calificaciones */}
        <div className="card glass-card kpi-card" onClick={() => onNavigate('RATINGS')}>
          <div className="kpi-header flex-between">
            <span className="kpi-title"><Star size={18} className="text-amber" /> Reputación</span>
            <span className="kpi-badge badge-emerald">Excelente</span>
          </div>
          <div className="kpi-body">
            <div className="rating-hero-score">
              <span className="score-number">⭐ {ratingSummary?.ratingAverage?.toFixed(1) || '4.8'}</span>
              <span className="score-total">/ 5</span>
            </div>
            <div className="kpi-meta-row">
              <span><strong>{ratingSummary?.totalRatings || 103}</strong> calificaciones</span>
              <span>•</span>
              <span><strong>{driver?.tripsCompleted || 42}</strong> viajes completados</span>
            </div>
            <div className="rating-minibar-preview margin-top-8">
              <div className="minibar-fill" style={{ width: '92%' }}></div>
            </div>
          </div>
          <div className="kpi-footer flex-between">
            <span className="text-xs text-muted">Ver todas las opiniones</span>
            <ChevronRight size={16} className="text-muted" />
          </div>
        </div>

        {/* Card 3: Documentación */}
        <div className="card glass-card kpi-card" onClick={() => onNavigate('DOCS')}>
          <div className="kpi-header flex-between">
            <span className="kpi-title"><FileCheck size={18} className="text-emerald" /> Documentación</span>
            {expiredDocsCount > 0 ? (
              <span className="kpi-badge badge-rose"><AlertTriangle size={12} /> {expiredDocsCount} Vencidos</span>
            ) : (
              <span className="kpi-badge badge-success"><CheckCircle2 size={12} /> Al Día</span>
            )}
          </div>
          <div className="kpi-body">
            <h3 className="kpi-main-text">{validDocsCount || 4} Documentos Vigentes</h3>
            <div className="kpi-meta-row">
              <span>Seguro de Pasajeros: <strong>Vigente</strong></span>
            </div>
            <div className="kpi-meta-row margin-top-4">
              <span>VTV / RTO: <strong>Vigente</strong></span>
            </div>
          </div>
          <div className="kpi-footer flex-between">
            <span className="text-xs text-muted">Gestionar pólizas y VTV</span>
            <ChevronRight size={16} className="text-muted" />
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="card glass-card margin-bottom-24">
        <h3 className="section-title margin-bottom-16">Accesos Rápidos del Chofer</h3>
        <div className="driver-actions-grid">
          <button className="btn-driver-nav-card" onClick={() => onNavigate('PROFILE')}>
            <User size={22} className="text-indigo" />
            <div className="nav-card-text">
              <strong>Mi Perfil</strong>
              <span>Datos personales y contacto</span>
            </div>
          </button>

          <button className="btn-driver-nav-card" onClick={() => onNavigate('VEHICLE')}>
            <Bus size={22} className="text-emerald" />
            <div className="nav-card-text">
              <strong>Mi Vehículo</strong>
              <span>Capacidad y comodidades</span>
            </div>
          </button>

          <button className="btn-driver-nav-card" onClick={() => onNavigate('DOCS')}>
            <ShieldCheck size={22} className="text-blue" />
            <div className="nav-card-text">
              <strong>Documentación</strong>
              <span>Seguro, VTV y Patente</span>
            </div>
          </button>

          <button className="btn-driver-nav-card" onClick={() => onNavigate('RATINGS')}>
            <Star size={22} className="text-amber" />
            <div className="nav-card-text">
              <strong>Mis Calificaciones</strong>
              <span>Estrellas y comentarios</span>
            </div>
          </button>

          <button className="btn-driver-nav-card" onClick={() => onNavigate('RECOMMENDATIONS')}>
            <Sparkles size={22} className="text-rose" />
            <div className="nav-card-text">
              <strong>Recomendaciones</strong>
              <span>Testimonios de pasajeros</span>
            </div>
          </button>
        </div>
      </div>

      {/* Top Testimonials Preview */}
      {topRecommendations && topRecommendations.length > 0 && (
        <div className="card glass-card">
          <div className="flex-between margin-bottom-16">
            <h3 className="section-title">
              <Sparkles size={18} className="text-amber" /> Recomendaciones Destacadas de Pasajeros
            </h3>
            <button className="btn-text" onClick={() => onNavigate('RECOMMENDATIONS')}>
              Ver todas ({topRecommendations.length})
            </button>
          </div>

          <div className="recommendations-preview-grid">
            {topRecommendations.slice(0, 2).map((rec) => (
              <div key={rec.id} className="rec-preview-card">
                <div className="rec-preview-stars">
                  {'★'.repeat(rec.score)}{'☆'.repeat(5 - rec.score)}
                </div>
                <p className="rec-preview-quote">"{rec.quote}"</p>
                <div className="rec-preview-author">
                  <strong>{rec.passengerName}</strong>
                  {rec.tripRoute && <span className="rec-preview-route">• {rec.tripRoute}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
