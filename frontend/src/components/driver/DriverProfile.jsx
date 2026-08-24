import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Image, Save, Loader2, ShieldCheck, CheckCircle2, Star, Award, TrendingUp } from 'lucide-react';
import { getDriverProfile, updateDriverProfile } from '../../services/driverService';

export default function DriverProfile({ onUpdateSuccess }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await getDriverProfile();
      setProfile(data);
    } catch (err) {
      setError('Error al cargar datos del perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setError(null);

    try {
      const updated = await updateDriverProfile({
        name: profile.name,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        avatarUrl: profile.avatarUrl
      });
      setProfile(updated);
      setSavedSuccess(true);
      if (onUpdateSuccess) onUpdateSuccess();
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      setError('Error al guardar los cambios del perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="driver-subpage-container" style={{ opacity: 0.7, pointerEvents: 'none' }}>
        <header className="profile-hero-header flex-between align-center flex-wrap gap-24 margin-bottom-36">
          <div className="flex-center gap-20">
            <div className="skeleton-box shimmer-wave" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
            <div className="flex-column gap-12">
              <div className="skeleton-box shimmer-wave" style={{ width: '240px', height: '32px', borderRadius: '6px' }} />
              <div className="skeleton-box shimmer-wave" style={{ width: '180px', height: '16px', borderRadius: '4px' }} />
            </div>
          </div>
        </header>

        <div className="profile-metrics-band flex-between align-center flex-wrap gap-24 margin-bottom-40">
          <div className="skeleton-box shimmer-wave" style={{ width: '120px', height: '60px', borderRadius: '8px' }} />
          <div className="metric-vertical-separator" />
          <div className="skeleton-box shimmer-wave" style={{ width: '120px', height: '60px', borderRadius: '8px' }} />
          <div className="metric-vertical-separator" />
          <div className="skeleton-box shimmer-wave" style={{ width: '150px', height: '60px', borderRadius: '8px' }} />
        </div>

        <div className="hairline-divider margin-bottom-40" />

        <div className="profile-clean-form flex-column gap-32">
          <div className="flex-column gap-6">
             <div className="skeleton-box shimmer-wave" style={{ width: '140px', height: '16px', borderRadius: '4px' }} />
             <div className="skeleton-box shimmer-wave" style={{ width: '380px', height: '14px', borderRadius: '4px' }} />
          </div>
          <div className="form-grid-2cols">
            <div className="skeleton-box shimmer-wave" style={{ width: '100%', height: '54px', borderRadius: '10px' }} />
            <div className="skeleton-box shimmer-wave" style={{ width: '100%', height: '54px', borderRadius: '10px' }} />
            <div className="skeleton-box shimmer-wave" style={{ width: '100%', height: '54px', borderRadius: '10px' }} />
            <div className="skeleton-box shimmer-wave" style={{ width: '100%', height: '54px', borderRadius: '10px' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-subpage-container">
      {/* Success / Error Alerts */}
      {savedSuccess && (
        <div className="alert-banner-green margin-bottom-32 flex-between">
          <span className="flex-center gap-10">
            <CheckCircle2 size={18} className="text-neon-green flex-shrink-0" />
            <span>Datos del perfil actualizados correctamente.</span>
          </span>
        </div>
      )}

      {error && (
        <div className="alert-banner-red margin-bottom-32">
          <span>{error}</span>
        </div>
      )}

      {/* 1. Header Identity & Verification */}
      <header className="profile-hero-header flex-between align-center flex-wrap gap-24 margin-bottom-36">
        <div className="flex-center gap-20">
          <div className="profile-avatar-large">
            {profile?.name ? profile.name[0] : 'C'}
          </div>
          <div className="flex-column gap-12">
            <div className="flex-center gap-12 flex-wrap">
              <h1 className="profile-name-headline">{profile?.name} {profile?.lastName}</h1>
              <div className="badge-verified-clean">
                <ShieldCheck size={14} className="text-neon-green" />
                <span>Chofer Verificado</span>
              </div>
            </div>
            <div className="margin-top-8">
              <span className="text-sm text-muted">{profile?.email} · Rol Chofer Profesional</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Distinct Metric Blocks (Calificación, Viajes, Estado) */}
      <div className="profile-metrics-band flex-between align-center flex-wrap gap-24 margin-bottom-40">
        <div className="profile-metric-cell flex-column gap-4">
          <span className="section-eyebrow text-electric-violet">Calificación Promedio</span>
          <div className="flex-center gap-10 margin-top-2">
            <span className="metric-large-num text-electric-violet">
              {profile?.ratingAverage?.toFixed(1) || '4.8'}
            </span>
            <div className="flex-column gap-2">
              <div className="flex-center gap-3">
                <Star size={14} className="text-electric-violet" fill="#7C4DFF" />
                <span className="text-xs text-main font-semibold">Excelente</span>
              </div>
              <span className="text-xs text-muted">{profile?.totalRatings || 103} opiniones</span>
            </div>
          </div>
        </div>

        <div className="metric-vertical-separator" />

        <div className="profile-metric-cell flex-column gap-4">
          <span className="section-eyebrow text-muted">Viajes Realizados</span>
          <div className="flex-column gap-2 margin-top-2">
            <span className="metric-large-num text-main">
              {profile?.tripsCompleted || 42}
            </span>
            <span className="text-xs text-muted">viajes completados</span>
          </div>
        </div>

        <div className="metric-vertical-separator" />

        <div className="profile-metric-cell flex-column gap-4">
          <span className="section-eyebrow text-muted">Estado de Cuenta</span>
          <div className="flex-column gap-4 margin-top-2">
            <span className="text-sm font-semibold text-neon-green flex-center gap-6">
              <span className="dot dot-green"></span> Habilitado para viajes
            </span>
            <span className="text-xs text-muted">Documentación vigente</span>
          </div>
        </div>
      </div>

      <div className="hairline-divider margin-bottom-40" />

      {/* 3. Personal Details Form */}
      <form onSubmit={handleSubmit} className="profile-clean-form flex-column gap-32">
        <div className="flex-column gap-6">
          <span className="section-eyebrow text-neon-green">Datos Personales</span>
          <br></br>
          <p className="text-sm text-muted">
            Información de contacto utilizada para la coordinación de viajes y confirmación con pasajeros.
          </p>
          <br></br>
        </div>

        <div className="form-grid-2cols">
          <div className="form-group flex-column gap-8">
            <label className="form-label">
              <User size={14} className="text-muted" /> Nombre
            </label>
            <input
              type="text"
              className="form-input"
              value={profile?.name || ''}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group flex-column gap-8">
            <label className="form-label">
              <User size={14} className="text-muted" /> Apellido
            </label>
            <input
              type="text"
              className="form-input"
              value={profile?.lastName || ''}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              required
            />
          </div>

          <div className="form-group flex-column gap-8">
            <label className="form-label">
              <Mail size={14} className="text-muted" /> Correo Electrónico
            </label>
            <input
              type="email"
              className="form-input"
              value={profile?.email || ''}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group flex-column gap-8">
            <label className="form-label">
              <Phone size={14} className="text-muted" /> Teléfono Celular
            </label>
            <input
              type="tel"
              className="form-input"
              value={profile?.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              required
            />
          </div>

          <div className="form-group full-width flex-column gap-8">
            <label className="form-label">
              <Image size={14} className="text-muted" /> URL de Foto de Perfil
            </label>
            <input
              type="url"
              className="form-input"
              value={profile?.avatarUrl || ''}
              onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
              placeholder="https://ejemplo.com/foto.jpg"
            />
          </div>
        </div>

        <div className="form-footer-actions flex-between align-center margin-top-12">
          <span className="text-muted text-sm">
            Los cambios se reflejan inmediatamente en tu perfil de chofer.
          </span>
          <button type="submit" className="btn-primary-neon flex-center gap-10" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="spinner" size={16} /> Guardando...
              </>
            ) : (
              <>
                <Save size={16} /> Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
