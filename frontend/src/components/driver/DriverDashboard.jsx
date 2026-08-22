import React, { useState } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
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
  Loader2,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { updateVehicleStatus } from '../../services/driverService';

export default function DriverDashboard({ dashboardData: propData, onRefresh: propRefresh }) {
  const navigate = useNavigate();
  const outletCtx = useOutletContext() || {};
  const dashboardData = propData || outletCtx.dashboardData;
  const onRefresh = propRefresh || outletCtx.onRefresh;
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

  return (
    <div className="driver-dashboard-view">
      {/* 1. Header Hero Area (Minimalist, No Heavy Box) */}
      <div className="driver-dash-header flex-between align-center flex-wrap gap-16 margin-bottom-32">
        <div className="driver-dash-welcome">
          <span className="driver-eyebrow text-electric-violet flex-center gap-6">
            <Sparkles size={14} /> Panel Principal
          </span>
          <h1 className="driver-hero-heading">
            Hola, <span className="text-neon-green">{driver?.name?.split(' ')[0] || 'Chofer'}</span> 👋
          </h1>
          <p className="driver-hero-subtext">
            Gestioná tu combi, revisá la vigencia de documentación y consultá la reputación de tus viajes.
          </p>
        </div>

        {/* Status Switcher Chip */}
        <div className="driver-status-control-strip">
          <div className="flex-center gap-8 margin-bottom-8">
            <span className="text-xs text-muted">Estado del vehículo:</span>
            {vehicle?.status === 'AVAILABLE' && (
              <span className="driver-pill-available">
                <span className="dot pulse"></span> Disponible
              </span>
            )}
            {vehicle?.status === 'UNAVAILABLE' && (
              <span className="driver-pill-unavailable">
                <span className="dot dot-amber"></span> En Pausa
              </span>
            )}
            {vehicle?.status === 'OUT_OF_SERVICE' && (
              <span className="driver-pill-outofservice">
                <span className="dot dot-red"></span> En Taller
              </span>
            )}
          </div>

          <div className="status-mini-toggles">
            <button
              type="button"
              className={`btn-mini-status ${vehicle?.status === 'AVAILABLE' ? 'active-green' : ''}`}
              onClick={() => handleStatusChange('AVAILABLE')}
              disabled={updatingStatus || vehicle?.status === 'AVAILABLE'}
            >
              Disponible
            </button>
            <button
              type="button"
              className={`btn-mini-status ${vehicle?.status === 'UNAVAILABLE' ? 'active-amber' : ''}`}
              onClick={() => handleStatusChange('UNAVAILABLE')}
              disabled={updatingStatus || vehicle?.status === 'UNAVAILABLE'}
            >
              Pausa
            </button>
            <button
              type="button"
              className={`btn-mini-status ${vehicle?.status === 'OUT_OF_SERVICE' ? 'active-red' : ''}`}
              onClick={() => handleStatusChange('OUT_OF_SERVICE')}
              disabled={updatingStatus || vehicle?.status === 'OUT_OF_SERVICE'}
            >
              Taller
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row (Clean, High Contrast, Electric Violet & Neon Green Accents) */}
      <div className="driver-stats-strip margin-bottom-36">
        {/* Stat 1: Reputación */}
        <div className="dash-stat-cell" onClick={() => navigate('/driver/ratings')}>
          <div className="stat-icon-wrap icon-violet">
            <Star size={20} className="text-electric-violet" />
          </div>
          <div className="stat-content">
            <div className="stat-big-number">
              {ratingSummary?.ratingAverage?.toFixed(1) || '4.8'} <span className="stat-unit text-electric-violet">★</span>
            </div>
            <span className="stat-title">Calificación General</span>
            <span className="stat-subdetail text-muted">{ratingSummary?.totalRatings || 103} opiniones recibidas</span>
          </div>
          <ChevronRight size={18} className="stat-arrow" />
        </div>

        {/* Stat 2: Vehículo */}
        <div className="dash-stat-cell" onClick={() => navigate('/driver/vehicle')}>
          <div className="stat-icon-wrap icon-green">
            <Bus size={20} className="text-neon-green" />
          </div>
          <div className="stat-content">
            <div className="stat-big-text">
              {vehicle?.brand || 'Mercedes-Benz'} {vehicle?.model || 'Sprinter'}
            </div>
            <span className="stat-title">Combi Asignada</span>
            <span className="stat-subdetail text-neon-green">
              👥 {vehicle?.passengerCapacity || 20} pasajeros • Patente {vehicle?.licensePlate || 'AD123TP'}
            </span>
          </div>
          <ChevronRight size={18} className="stat-arrow" />
        </div>

        {/* Stat 3: Documentación */}
        <div className="dash-stat-cell" onClick={() => navigate('/driver/documents')}>
          <div className="stat-icon-wrap icon-green">
            <FileCheck size={20} className="text-neon-green" />
          </div>
          <div className="stat-content">
            <div className="stat-big-number text-neon-green">
              {validDocsCount || 4} / {(validDocsCount || 4) + (expiredDocsCount || 0)}
            </div>
            <span className="stat-title">Documentos Habilitantes</span>
            <span className="stat-subdetail text-muted">
              {expiredDocsCount > 0 ? `${expiredDocsCount} requieren atención` : 'Toda la documentación al día'}
            </span>
          </div>
          <ChevronRight size={18} className="stat-arrow" />
        </div>
      </div>

      {/* 3. Section: Accesos Rápidos Tecnológicos */}
      <div className="dash-quick-links-section margin-bottom-36">
        <div className="section-header-clean flex-between align-center margin-bottom-16">
          <h2 className="section-clean-title flex-center gap-8">
            <TrendingUp size={18} className="text-neon-green" /> Módulos de Gestión
          </h2>
          <span className="text-xs text-muted">Acceso directo a configuraciones</span>
        </div>

        <div className="driver-clean-grid">
          <Link to="/driver/vehicle" className="clean-nav-card">
            <div className="clean-card-icon text-neon-green">
              <Bus size={22} />
            </div>
            <div className="clean-card-info">
              <strong>Mi Vehículo & Showroom 3D</strong>
              <span>Explorá y personalizá el modelo 3D de tu combi</span>
            </div>
            <ArrowRight size={16} className="clean-card-arrow" />
          </Link>

          <Link to="/driver/profile" className="clean-nav-card">
            <div className="clean-card-icon text-electric-violet">
              <User size={22} />
            </div>
            <div className="clean-card-info">
              <strong>Perfil del Chofer</strong>
              <span>Actualizá tus datos personales y de contacto</span>
            </div>
            <ArrowRight size={16} className="clean-card-arrow" />
          </Link>

          <Link to="/driver/documents" className="clean-nav-card">
            <div className="clean-card-icon text-neon-green">
              <ShieldCheck size={22} />
            </div>
            <div className="clean-card-info">
              <strong>Documentación y Habilitaciones</strong>
              <span>Póliza de seguro, VTV/RTO y licencia profesional</span>
            </div>
            <ArrowRight size={16} className="clean-card-arrow" />
          </Link>

          <Link to="/driver/ratings" className="clean-nav-card">
            <div className="clean-card-icon text-electric-violet">
              <Star size={22} />
            </div>
            <div className="clean-card-info">
              <strong>Calificaciones y Reseñas</strong>
              <span>Monitoreá la satisfacción y comentarios de pasajeros</span>
            </div>
            <ArrowRight size={16} className="clean-card-arrow" />
          </Link>
        </div>
      </div>

      {/* 4. Section: Testimonios Destacados (Typography-focused, no heavy boxes) */}
      {topRecommendations && topRecommendations.length > 0 && (
        <div className="dash-testimonials-section">
          <div className="section-header-clean flex-between align-center margin-bottom-16">
            <h2 className="section-clean-title flex-center gap-8">
              <Sparkles size={18} className="text-electric-violet" /> Opiniones Recientes de Pasajeros
            </h2>
            <Link to="/driver/recommendations" className="link-see-all text-xs text-electric-violet flex-center gap-4">
              Ver todas ({topRecommendations.length}) <ChevronRight size={14} />
            </Link>
          </div>

          <div className="testimonials-quote-list">
            {topRecommendations.slice(0, 2).map((rec) => (
              <div key={rec.id} className="quote-item-clean">
                <div className="quote-stars text-electric-violet">
                  {'★'.repeat(rec.score)}{'☆'.repeat(5 - rec.score)}
                </div>
                <p className="quote-text">"{rec.quote}"</p>
                <div className="quote-author-row">
                  <span className="quote-author-name">{rec.passengerName}</span>
                  {rec.tripRoute && <span className="quote-route-chip">• {rec.tripRoute}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
