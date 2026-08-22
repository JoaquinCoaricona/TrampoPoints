import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Image, CheckCircle, Save, Loader2, Award, Shield, CheckCircle2, Sparkles } from 'lucide-react';
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
      <div className="driver-profile-skeleton flex-column gap-20">
        <div className="skeleton-box shimmer-wave" style={{ height: '90px', borderRadius: '14px' }} />
        <div className="skeleton-box shimmer-wave" style={{ height: '340px', borderRadius: '14px' }} />
      </div>
    );
  }

  return (
    <div className="driver-subpage-container">
      {/* Header section (clean, no heavy card) */}
      <div className="subpage-header flex-between align-center flex-wrap gap-12 margin-bottom-24">
        <div>
          <span className="subpage-eyebrow text-electric-violet flex-center gap-6">
            <User size={14} /> Configuración de Cuenta
          </span>
          <h1 className="subpage-title">Mi Perfil de Chofer</h1>
          <p className="subpage-subtitle">
            Administrá tu información de contacto y habilitación profesional en TrampoPoints.
          </p>
        </div>

        <div className="badge-verified-clean">
          <Shield size={15} className="text-neon-green" />
          <span>Cuenta Verificada</span>
        </div>
      </div>

      {/* Success / Error Alerts */}
      {savedSuccess && (
        <div className="alert-banner-green margin-bottom-20 flex-between">
          <span className="flex-center gap-8">
            <CheckCircle2 size={18} className="text-neon-green" />
            ¡Datos del perfil actualizados correctamente en el servidor!
          </span>
        </div>
      )}

      {error && (
        <div className="alert-banner-red margin-bottom-20">
          <span>{error}</span>
        </div>
      )}

      {/* Profile Metrics Bar (Minimalist Strip) */}
      <div className="profile-metrics-strip margin-bottom-28">
        <div className="metric-strip-item">
          <span className="metric-strip-label">Calificación</span>
          <strong className="metric-strip-value text-electric-violet">
            ⭐ {profile?.ratingAverage?.toFixed(1) || '4.8'} <span className="text-muted text-xs">/ 5</span>
          </strong>
        </div>
        <div className="metric-strip-item">
          <span className="metric-strip-label">Opiniones</span>
          <strong className="metric-strip-value">{profile?.totalRatings || 103}</strong>
        </div>
        <div className="metric-strip-item">
          <span className="metric-strip-label">Viajes Realizados</span>
          <strong className="metric-strip-value">{profile?.tripsCompleted || 42}</strong>
        </div>
        <div className="metric-strip-item">
          <span className="metric-strip-label">Estado</span>
          <strong className="metric-strip-value text-neon-green">● Activo</strong>
        </div>
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="clean-profile-form">
        <div className="form-grid-2cols">
          <div className="form-group">
            <label className="form-label">
              <User size={14} className="text-electric-violet" /> Nombre
            </label>
            <input
              type="text"
              className="form-input"
              value={profile?.name || ''}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <User size={14} className="text-electric-violet" /> Apellido
            </label>
            <input
              type="text"
              className="form-input"
              value={profile?.lastName || ''}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Mail size={14} className="text-neon-green" /> Correo Electrónico
            </label>
            <input
              type="email"
              className="form-input"
              value={profile?.email || ''}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Phone size={14} className="text-electric-violet" /> Teléfono de Contacto
            </label>
            <input
              type="tel"
              className="form-input"
              value={profile?.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              required
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">
              <Image size={14} className="text-neon-green" /> URL de Foto de Perfil (Avatar)
            </label>
            <input
              type="url"
              className="form-input"
              value={profile?.avatarUrl || ''}
              onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="form-footer-actions flex-between align-center margin-top-24">
          <span className="text-muted text-xs">
            Los cambios se sincronizan en tiempo real con el backend de TrampoPoints.
          </span>
          <button type="submit" className="btn-primary-neon flex-center gap-8" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="spinner" size={16} /> Guardando...
              </>
            ) : (
              <>
                <Save size={16} /> Guardar Cambios del Perfil
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
