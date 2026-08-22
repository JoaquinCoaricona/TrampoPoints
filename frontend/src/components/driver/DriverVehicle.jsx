import React, { useState, useEffect } from 'react';
import {
  Bus,
  Save,
  Loader2,
  CheckCircle2,
  Sparkles,
  Wifi,
  Wind,
  Flame,
  Zap,
  Shield,
  Briefcase,
  Accessibility,
  Hash,
  Palette,
  Calendar,
  Users
} from 'lucide-react';
import { getVehicle, saveVehicle } from '../../services/driverService';
import Vehicle3DViewer from './Vehicle3DViewer';

const AVAILABLE_FEATURES = [
  { id: 'AIRE_ACONDICIONADO', label: 'Aire Acondicionado', icon: Wind },
  { id: 'CALEFACCION', label: 'Calefacción', icon: Flame },
  { id: 'WIFI', label: 'Conexión WiFi 4G/5G', icon: Wifi },
  { id: 'USB', label: 'Puertos USB en Asientos', icon: Zap },
  { id: 'CINTURONES_SEGURIDAD', label: 'Cinturones de 3 Puntos', icon: Shield },
  { id: 'ESPACIO_EQUIPAJE', label: 'Bodega / Baúl Amplio', icon: Briefcase },
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
      setVehicle({
        ...vehicle,
        features: currentFeatures.filter((f) => f !== featureId)
      });
    } else {
      setVehicle({
        ...vehicle,
        features: [...currentFeatures, featureId]
      });
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
      <div className="driver-vehicle-skeleton flex-column gap-20">
        <div className="skeleton-box shimmer-wave" style={{ height: '420px', borderRadius: '16px' }} />
        <div className="skeleton-box shimmer-wave" style={{ height: '300px', borderRadius: '16px' }} />
      </div>
    );
  }

  return (
    <div className="driver-subpage-container">
      {/* Header section (Clean, no box) */}
      <div className="subpage-header flex-between align-center flex-wrap gap-12 margin-bottom-24">
        <div>
          <span className="subpage-eyebrow text-neon-green flex-center gap-6">
            <Bus size={14} /> Gestión de Flota & 3D
          </span>
          <h1 className="subpage-title">Mi Vehículo (Combi / Minibús)</h1>
          <p className="subpage-subtitle">
            Visualizá tu combi en 360°, elegí entre modelos comunes de Argentina y actualizá sus especificaciones.
          </p>
        </div>

        <div className="badge-verified-clean">
          <Sparkles size={15} className="text-electric-violet" />
          <span>Showroom 3D Interactivo</span>
        </div>
      </div>

      {/* Success / Error Alerts */}
      {savedSuccess && (
        <div className="alert-banner-green margin-bottom-20 flex-between">
          <span className="flex-center gap-8">
            <CheckCircle2 size={18} className="text-neon-green" />
            ¡Especificaciones del vehículo actualizadas con éxito!
          </span>
        </div>
      )}

      {error && (
        <div className="alert-banner-red margin-bottom-20">
          <span>{error}</span>
        </div>
      )}

      {/* 3D Interactive Showroom */}
      <div className="showroom-container-clean margin-bottom-32">
        <Vehicle3DViewer
          vehicle={vehicle}
          onVehicleChange={(partial) => setVehicle((prev) => ({ ...prev, ...partial }))}
        />
      </div>

      {/* Specifications & Equipment Form */}
      <form onSubmit={handleSubmit} className="clean-vehicle-form">
        <div className="section-header-clean margin-bottom-16">
          <h2 className="section-clean-title flex-center gap-8">
            <Bus size={18} className="text-neon-green" /> Datos Técnicos de la Unidad
          </h2>
          <span className="text-xs text-muted">Información visible para los pasajeros asignados</span>
        </div>

        <div className="form-grid-3cols margin-bottom-24">
          <div className="form-group">
            <label className="form-label">
              <Bus size={14} className="text-electric-violet" /> Marca
            </label>
            <input
              type="text"
              className="form-input"
              value={vehicle?.brand || ''}
              onChange={(e) => setVehicle({ ...vehicle, brand: e.target.value })}
              placeholder="Ej. Mercedes-Benz"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Bus size={14} className="text-electric-violet" /> Modelo
            </label>
            <input
              type="text"
              className="form-input"
              value={vehicle?.model || ''}
              onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
              placeholder="Ej. Sprinter 516 CDI"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Hash size={14} className="text-neon-green" /> Patente / Dominio
            </label>
            <input
              type="text"
              className="form-input"
              value={vehicle?.licensePlate || ''}
              onChange={(e) => setVehicle({ ...vehicle, licensePlate: e.target.value.toUpperCase() })}
              placeholder="Ej. AE 123 CD"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Users size={14} className="text-electric-violet" /> Capacidad de Pasajeros
            </label>
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

          <div className="form-group">
            <label className="form-label">
              <Calendar size={14} className="text-neon-green" /> Año de Fabricación
            </label>
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

          <div className="form-group">
            <label className="form-label">
              <Palette size={14} className="text-electric-violet" /> Color de Carrocería
            </label>
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

        {/* Features / Amenities */}
        <div className="section-header-clean margin-bottom-16">
          <h2 className="section-clean-title flex-center gap-8">
            <Sparkles size={18} className="text-electric-violet" /> Equipamiento y Confort a Bordo
          </h2>
          <span className="text-xs text-muted">Seleccioná los servicios disponibles en tu combi</span>
        </div>

        <div className="features-chips-grid margin-bottom-28">
          {AVAILABLE_FEATURES.map((feat) => {
            const Icon = feat.icon;
            const isChecked = (vehicle?.features || []).includes(feat.id);
            return (
              <button
                key={feat.id}
                type="button"
                className={`feature-chip-btn ${isChecked ? 'active' : ''}`}
                onClick={() => handleFeatureToggle(feat.id)}
              >
                <Icon size={16} className={isChecked ? 'text-neon-green' : 'text-muted'} />
                <span>{feat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="form-footer-actions flex-between align-center">
          <span className="text-muted text-xs">
            Los datos se actualizan en el modelo 3D y en la ficha que visualizan los pasajeros al viajar.
          </span>
          <button type="submit" className="btn-primary-neon flex-center gap-8" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="spinner" size={16} /> Guardando...
              </>
            ) : (
              <>
                <Save size={16} /> Guardar Datos del Vehículo
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
