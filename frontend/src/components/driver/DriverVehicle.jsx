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
      <div className="card glass-card padding-32 text-center flex-center">
        <Loader2 className="spinner" size={24} />
        <span>Cargando datos del vehículo...</span>
      </div>
    );
  }

  return (
    <div className="driver-vehicle-view">
      <div className="card glass-card">
        <div className="card-header flex-between margin-bottom-24">
          <div>
            <h2 className="title-with-icon">
              <Bus className="accent-icon" size={22} /> Mi Vehículo (Combi / Minibús)
            </h2>
            <p className="card-subtitle">
              Registrá y actualizá los datos técnicos, capacidades y comodidades de tu vehículo asignado.
            </p>
          </div>

          <div className="vehicle-quick-status">
            <span className="text-xs text-muted">Estado actual:</span>
            <select
              className="form-input select-status-dropdown margin-top-4"
              value={vehicle?.status || 'AVAILABLE'}
              onChange={(e) => setVehicle({ ...vehicle, status: e.target.value })}
            >
              <option value="AVAILABLE">🟢 Disponible</option>
              <option value="UNAVAILABLE">🟡 No Disponible</option>
              <option value="OUT_OF_SERVICE">🔴 Fuera de Servicio</option>
            </select>
          </div>
        </div>

        {/* Success / Error Alerts */}
        {savedSuccess && (
          <div className="banner banner-auth-success margin-bottom-20 flex-between">
            <span className="flex-center gap-8">
              <CheckCircle2 size={18} className="text-emerald" />
              ¡Datos y características del vehículo guardados exitosamente!
            </span>
          </div>
        )}

        {error && (
          <div className="banner banner-error margin-bottom-20">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="vehicle-form">
          {/* Seccion 1: Datos Basicos */}
          <div className="form-section-title margin-bottom-16">
            <h3>1. Datos Básicos del Vehículo</h3>
          </div>

          <div className="form-grid margin-bottom-24">
            <div className="form-group">
              <label className="form-label">Marca</label>
              <input
                type="text"
                className="form-input"
                value={vehicle?.brand || ''}
                onChange={(e) => setVehicle({ ...vehicle, brand: e.target.value })}
                placeholder="Ej. Mercedes-Benz, Iveco, Renault"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Modelo</label>
              <input
                type="text"
                className="form-input"
                value={vehicle?.model || ''}
                onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                placeholder="Ej. Sprinter 516 CDI, Master"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={14} className="text-muted" /> Año de Fabricación
              </label>
              <input
                type="number"
                min="2000"
                max="2030"
                className="form-input"
                value={vehicle?.year || 2024}
                onChange={(e) => setVehicle({ ...vehicle, year: parseInt(e.target.value) || 2024 })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Palette size={14} className="text-muted" /> Color
              </label>
              <input
                type="text"
                className="form-input"
                value={vehicle?.color || ''}
                onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })}
                placeholder="Ej. Blanco, Gris Plata, Negro"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Hash size={14} className="text-emerald" /> Patente / Dominio
              </label>
              <input
                type="text"
                className="form-input uppercase font-mono"
                value={vehicle?.licensePlate || ''}
                onChange={(e) => setVehicle({ ...vehicle, licensePlate: e.target.value.toUpperCase() })}
                placeholder="Ej. AF 482 TP"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Vehículo</label>
              <select
                className="form-input"
                value={vehicle?.vehicleType || 'MINIBUS'}
                onChange={(e) => setVehicle({ ...vehicle, vehicleType: e.target.value })}
              >
                <option value="MINIBUS">Minibús (15 a 24 Pasajeros)</option>
                <option value="COMBI">Combi Standard (10 a 14 Pasajeros)</option>
                <option value="VAN">Van Ejecutiva (6 a 9 Pasajeros)</option>
              </select>
            </div>
          </div>

          {/* Seccion 2: Capacidad y Carga */}
          <div className="form-section-title margin-bottom-16">
            <h3>2. Capacidad de Pasajeros y Carga</h3>
          </div>

          <div className="form-grid margin-bottom-24">
            <div className="form-group">
              <label className="form-label">
                <Users size={15} className="text-indigo" /> Capacidad Máxima de Pasajeros
              </label>
              <input
                type="number"
                min="4"
                max="40"
                className="form-input"
                value={vehicle?.passengerCapacity || 20}
                onChange={(e) =>
                  setVehicle({
                    ...vehicle,
                    passengerCapacity: parseInt(e.target.value) || 20,
                    seatCount: parseInt(e.target.value) || 20
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Briefcase size={15} className="text-amber" /> Capacidad de Equipaje
              </label>
              <select
                className="form-input"
                value={vehicle?.luggageCapacity || 'MEDIUM'}
                onChange={(e) => setVehicle({ ...vehicle, luggageCapacity: e.target.value })}
              >
                <option value="LIGHT">Ligero (Mochila / Bolso de mano)</option>
                <option value="MEDIUM">Medio (1 valija carry-on por pasajero)</option>
                <option value="LARGE">Amplio (Valijas grandes + baúl exterior)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Carga Aproximada Total (kg)</label>
              <input
                type="number"
                min="100"
                max="3000"
                step="50"
                className="form-input"
                value={vehicle?.approxCargoKg || 850}
                onChange={(e) => setVehicle({ ...vehicle, approxCargoKg: parseInt(e.target.value) || 850 })}
              />
            </div>

            <div className="form-group flex-center-left margin-top-24">
              <label className="checkbox-custom-label">
                <input
                  type="checkbox"
                  checked={vehicle?.allowsBulkyObjects || false}
                  onChange={(e) => setVehicle({ ...vehicle, allowsBulkyObjects: e.target.checked })}
                />
                <span>Habilitar transporte de objetos voluminosos (instrumentos, cochecitos, etc.)</span>
              </label>
            </div>
          </div>

          {/* Seccion 3: Comodidades y Caracteristicas */}
          <div className="form-section-title margin-bottom-16">
            <h3>3. Características y Comodidades a Bordo</h3>
          </div>

          <div className="features-checklist-grid margin-bottom-24">
            {AVAILABLE_FEATURES.map((feat) => {
              const IconComponent = feat.icon;
              const isChecked = (vehicle?.features || []).includes(feat.id);
              return (
                <div
                  key={feat.id}
                  className={`feature-check-card ${isChecked ? 'feature-checked' : ''}`}
                  onClick={() => handleFeatureToggle(feat.id)}
                >
                  <IconComponent size={20} className={isChecked ? 'text-indigo' : 'text-muted'} />
                  <span className="feature-label-text">{feat.label}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // Handled by card click
                    className="feature-checkbox"
                  />
                </div>
              );
            })}
          </div>

          <div className="margin-top-24 flex-between">
            <span className="text-muted text-xs">
              La capacidad de pasajeros define el cupo máximo para el agrupamiento de viajes en combi.
            </span>
            <button type="submit" className="btn-primary btn-auto flex-center gap-8" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="spinner" size={16} /> Guardando...
                </>
              ) : (
                <>
                  <Save size={16} /> Guardar Vehículo y Características
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
