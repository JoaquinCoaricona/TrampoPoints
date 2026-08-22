import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Image, CheckCircle, Save, Loader2, Award, Shield, CheckCircle2 } from 'lucide-react';
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
      <div className="card glass-card padding-32 text-center flex-center">
        <Loader2 className="spinner" size={24} />
        <span>Cargando perfil del chofer...</span>
      </div>
    );
  }

  return (
    <div className="driver-profile-view">
      <div className="card glass-card">
        <div className="card-header flex-between margin-bottom-24">
          <div>
            <h2 className="title-with-icon">
              <User className="accent-icon" size={22} /> Perfil del Chofer
            </h2>
            <p className="card-subtitle">
              Consultá y administrá tu información personal de contacto y habilitación profesional.
            </p>
          </div>
          <div className="driver-badge-status">
            <Shield size={16} className="text-emerald" />
            <span>Cuenta Verificada</span>
          </div>
        </div>

        {/* Success / Error Alerts */}
        {savedSuccess && (
          <div className="banner banner-auth-success margin-bottom-20 flex-between">
            <span className="flex-center gap-8">
              <CheckCircle2 size={18} className="text-emerald" />
              ¡Datos del perfil actualizados correctamente en el servidor!
            </span>
          </div>
        )}

        {error && (
          <div className="banner banner-error margin-bottom-20">
            <span>{error}</span>
          </div>
        )}

        {/* Stats Summary Bar */}
        <div className="driver-profile-stats-bar margin-bottom-24">
          <div className="stat-pill">
            <span className="pill-label">Calificación</span>
            <span className="pill-val">⭐ {profile?.ratingAverage?.toFixed(1) || '4.8'} / 5</span>
          </div>
          <div className="stat-pill">
            <span className="pill-label">Opiniones</span>
            <span className="pill-val">💬 {profile?.totalRatings || 103}</span>
          </div>
          <div className="stat-pill">
            <span className="pill-label">Viajes Realizados</span>
            <span className="pill-val">🚐 {profile?.tripsCompleted || 42}</span>
          </div>
          <div className="stat-pill">
            <span className="pill-label">Estado</span>
            <span className="pill-val text-emerald">● Activo</span>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="driver-profile-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <User size={15} className="text-indigo" /> Nombre
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
                <User size={15} className="text-indigo" /> Apellido
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
                <Mail size={15} className="text-emerald" /> Correo Electrónico
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
                <Phone size={15} className="text-amber" /> Teléfono de Contacto
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
                <Image size={15} className="text-rose" /> URL de Foto de Perfil (Avatar)
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

          <div className="margin-top-16 flex-between">
            <span className="text-muted text-xs">
              Los cambios se sincronizan en tiempo real con el backend de TrampoPoints.
            </span>
            <button type="submit" className="btn-primary btn-auto flex-center gap-8" disabled={saving}>
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
    </div>
  );
}
