import React, { useState, useEffect } from 'react';
import {
  Save,
  Loader2,
  CheckCircle2,
  Wifi,
  Wind,
  Flame,
  Zap,
  Shield,
  Briefcase,
  Accessibility
} from 'lucide-react';
import { getVehicle, saveVehicle } from '../../services/driverService';
import Vehicle3DViewer from './Vehicle3DViewer';

const AVAILABLE_FEATURES = [
  { id: 'AIRE_ACONDICIONADO', label: 'Aire Acondicionado', icon: Wind },
  { id: 'CALEFACCION', label: 'Calefacción', icon: Flame },
  { id: 'WIFI', label: 'Conexión WiFi', icon: Wifi },
  { id: 'USB', label: 'Puertos USB en cada fila', icon: Zap },
  { id: 'CINTURONES_SEGURIDAD', label: 'Cinturones de 3 Puntos', icon: Shield },
  { id: 'ESPACIO_EQUIPAJE', label: 'Baúl / Bodega Amplia', icon: Briefcase },
  { id: 'ACCESIBILIDAD_RAMPA', label: 'Rampa de Accesibilidad', icon: Accessibility }
];

export default function DriverVehicle({ onUpdateSuccess }) {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVehicle();
  }, []);

  const loadVehicle = async () => {
    setLoading(true);
    try {
      const data = await getVehicle();
      setVehicle(data);
    } catch (err) {
      setError('Error al cargar datos del vehículo');
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureToggle = (featureId) => {
    const currentFeatures = vehicle.features || [];
    if (currentFeatures.includes(featureId)) {
      setVehicle({ ...vehicle, features: currentFeatures.filter((f) => f !== featureId) });
    } else {
      setVehicle({ ...vehicle, features: [...currentFeatures, featureId] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setError(null);
    try {
      const updated = await saveVehicle(vehicle);
      setVehicle(updated);
      setSavedSuccess(true);
      if (onUpdateSuccess) onUpdateSuccess();
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      setError('Error al guardar datos del vehículo');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="driver-subpage-container flex-column gap-32">
        <div className="skeleton-box shimmer-wave" style={{ height: '80px', borderRadius: '6px' }} />
        <div className="skeleton-box shimmer-wave" style={{ height: '420px', borderRadius: '6px' }} />
        <div className="skeleton-box shimmer-wave" style={{ height: '240px', borderRadius: '6px' }} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="driver-subpage-container">

      {/* Alerts */}
      {savedSuccess && (
        <div className="alert-banner-green flex-between margin-bottom-32">
          <span className="flex-center gap-10">
            <CheckCircle2 size={18} className="text-neon-green flex-shrink-0" />
            <span>Especificaciones del vehículo actualizadas correctamente.</span>
          </span>
        </div>
      )}
      {error && (
        <div className="alert-banner-red margin-bottom-32">
          <span>{error}</span>
        </div>
      )}

      {/* ── BLOQUE 1: Identidad de la Unidad ── */}
      <section className="margin-bottom-48">
        <span className="section-eyebrow text-neon-green margin-bottom-12" style={{ display: 'block' }}>
          Unidad Asignada
        </span>
        <h1 className="vehicle-name-title">
          {vehicle?.brand || 'Mercedes-Benz'} {vehicle?.model || 'Sprinter 516 CDI Minibús'}
        </h1>
        <div className="vehicle-summary-meta flex-center gap-14 flex-wrap" style={{ marginTop: '12px' }}>
          <span className="text-main font-semibold">{vehicle?.passengerCapacity || 20} pasajeros</span>
          <span className="meta-dot">·</span>
          <span className="text-main font-semibold">Patente {vehicle?.licensePlate || 'AF 482 TP'}</span>
          <span className="meta-dot">·</span>
          <span>{vehicle?.color || 'Blanco Ártico'}</span>
          <span className="meta-dot">·</span>
          <span>Año {vehicle?.year || 2023}</span>
        </div>
      </section>

      {/* ── BLOQUE 2: Showroom 3D sin caja exterior ── */}
      <section className="margin-bottom-56">
        <Vehicle3DViewer
          vehicle={vehicle}
          onVehicleChange={(partial) => setVehicle((prev) => ({ ...prev, ...partial }))}
        />
      </section>

      <div className="hairline-divider margin-bottom-48" />

      {/* ── BLOQUE 3: Ficha Técnica + Equipamiento en 2 columnas ── */}
      <section className="vehicle-config-2col margin-bottom-48">
        {/* Columna izquierda: Ficha Técnica */}
        <div className="flex-column gap-24">
          <div className="flex-column gap-6">
            <span className="section-eyebrow text-muted">Ficha Técnica</span>
            <p className="text-sm text-muted">Identificación de la unidad y capacidad habilitada.</p>
          </div>

          <div className="form-grid-2cols">
            <div className="form-group flex-column gap-8">
              <label className="form-label">Marca</label>
              <input
                type="text"
                className="form-input"
                value={vehicle?.brand || ''}
                onChange={(e) => setVehicle({ ...vehicle, brand: e.target.value })}
                placeholder="Ej. Mercedes-Benz"
                required
              />
            </div>

            <div className="form-group flex-column gap-8">
              <label className="form-label">Modelo</label>
              <input
                type="text"
                className="form-input"
                value={vehicle?.model || ''}
                onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                placeholder="Ej. Sprinter"
                required
              />
            </div>

            <div className="form-group flex-column gap-8">
              <label className="form-label">Patente / Dominio</label>
              <input
                type="text"
                className="form-input"
                value={vehicle?.licensePlate || ''}
                onChange={(e) => setVehicle({ ...vehicle, licensePlate: e.target.value.toUpperCase() })}
                placeholder="Ej. AF 482 TP"
                required
              />
            </div>

            <div className="form-group flex-column gap-8">
              <label className="form-label">Capacidad de Asientos</label>
              <input
                type="number"
                className="form-input"
                min={4}
                max={40}
                value={vehicle?.passengerCapacity || 20}
                onChange={(e) => setVehicle({ ...vehicle, passengerCapacity: parseInt(e.target.value) || 20 })}
                required
              />
            </div>

            <div className="form-group flex-column gap-8">
              <label className="form-label">Año de Fabricación</label>
              <input
                type="number"
                className="form-input"
                min={2000}
                max={2027}
                value={vehicle?.year || 2023}
                onChange={(e) => setVehicle({ ...vehicle, year: parseInt(e.target.value) || 2023 })}
                required
              />
            </div>

            <div className="form-group flex-column gap-8">
              <label className="form-label">Color de Carrocería</label>
              <input
                type="text"
                className="form-input"
                value={vehicle?.color || 'Blanco Ártico'}
                onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })}
                placeholder="Ej. Blanco Ártico"
                required
              />
            </div>
          </div>
        </div>

        {/* Columna derecha: Equipamiento */}
        <div className="flex-column gap-24">
          <div className="flex-column gap-6">
            <span className="section-eyebrow text-electric-violet">Equipamiento & Confort</span>
            <p className="text-sm text-muted">Servicios a bordo visibles para los pasajeros.</p>
          </div>

          <div className="amenities-list-wrap">
            {AVAILABLE_FEATURES.map((feat) => {
              const Icon = feat.icon;
              const isChecked = (vehicle?.features || []).includes(feat.id);
              return (
                <button
                  key={feat.id}
                  type="button"
                  className={`amenity-item-btn flex-between align-center ${isChecked ? 'active' : ''}`}
                  onClick={() => handleFeatureToggle(feat.id)}
                >
                  <div className="flex-center gap-14">
                    <Icon size={18} className={isChecked ? 'text-neon-green' : 'text-muted'} />
                    <span className="amenity-name">{feat.label}</span>
                  </div>
                  <span className={`amenity-toggle-check ${isChecked ? 'checked' : ''}`}>
                    {isChecked ? 'Incluido' : 'No disponible'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BLOQUE 4: Guardar ── */}
      <div className="form-footer-actions flex-between align-center">
        <span className="text-muted text-sm">
          Los cambios se reflejan en búsquedas de trayectos.
        </span>
        <button type="submit" className="btn-primary-neon flex-center gap-10" disabled={saving}>
          {saving ? (
            <><Loader2 className="spinner" size={16} /> Guardando...</>
          ) : (
            <><Save size={16} /> Guardar Unidad</>
          )}
        </button>
      </div>
    </form>
  );
}
