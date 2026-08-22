import React, { useState } from 'react';
import { MapPin, Navigation, Calendar, Clock, Search, Sparkles } from 'lucide-react';

const QUICK_LOCATIONS = [
  {
    name: 'Obelisco ➔ Palermo',
    origin: { latitude: -34.6037, longitude: -58.3816, address: 'Obelisco (Av. 9 de Julio)' },
    destination: { latitude: -34.5895, longitude: -58.3974, address: 'Palermo Soho' },
  },
  {
    name: 'Belgrano ➔ Pilar',
    origin: { latitude: -34.5614, longitude: -58.4563, address: 'Belgrano (Juramento y Cabildo)' },
    destination: { latitude: -34.4580, longitude: -58.9142, address: 'Pilar Centro / Parque Ind.' },
  },
  {
    name: 'San Isidro ➔ Microcentro',
    origin: { latitude: -34.4719, longitude: -58.5283, address: 'Estación San Isidro' },
    destination: { latitude: -34.6083, longitude: -58.3712, address: 'Plaza de Mayo / Microcentro' },
  }
];

export default function TripRequestForm({ onSubmit, loading }) {
  const [origin, setOrigin] = useState({
    latitude: -34.6037,
    longitude: -58.3816,
    address: 'Obelisco'
  });

  const [destination, setDestination] = useState({
    latitude: -34.5895,
    longitude: -58.3974,
    address: 'Palermo'
  });

  const [departureTime, setDepartureTime] = useState('2026-08-22T08:30:00');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      origin,
      destination,
      departureTime
    });
  };

  const handleSelectPreset = (preset) => {
    setOrigin(preset.origin);
    setDestination(preset.destination);
  };

  return (
    <div className="card glass-card form-card">
      <div className="card-header">
        <div className="title-with-icon">
          <Search className="accent-icon" size={20} />
          <h2>Crear Solicitud de Viaje</h2>
        </div>
        <p className="card-subtitle">
          Agrupa tu viaje con pasajeros cercanos para compartir combi y ahorrar hasta un 40%.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="preset-container">
        <span className="preset-label">
          <Sparkles size={14} /> Rutas Frecuentes Demo:
        </span>
        <div className="preset-buttons">
          {QUICK_LOCATIONS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              className="btn-preset"
              onClick={() => handleSelectPreset(preset)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="trip-form">
        <div className="form-grid">
          {/* Origin Section */}
          <div className="form-group">
            <label className="form-label">
              <MapPin className="text-emerald" size={16} /> Punto de Origen
            </label>
            <input
              type="text"
              className="form-input"
              value={origin.address}
              onChange={(e) => setOrigin({ ...origin, address: e.target.value })}
              placeholder="Dirección o punto de partida"
              required
            />
            <div className="coords-row">
              <input
                type="number"
                step="any"
                className="form-input sub-input"
                value={origin.latitude}
                onChange={(e) => setOrigin({ ...origin, latitude: parseFloat(e.target.value) || 0 })}
                placeholder="Latitud"
                required
              />
              <input
                type="number"
                step="any"
                className="form-input sub-input"
                value={origin.longitude}
                onChange={(e) => setOrigin({ ...origin, longitude: parseFloat(e.target.value) || 0 })}
                placeholder="Longitud"
                required
              />
            </div>
          </div>

          {/* Destination Section */}
          <div className="form-group">
            <label className="form-label">
              <Navigation className="text-indigo" size={16} /> Punto de Destino
            </label>
            <input
              type="text"
              className="form-input"
              value={destination.address}
              onChange={(e) => setDestination({ ...destination, address: e.target.value })}
              placeholder="Dirección o punto de llegada"
              required
            />
            <div className="coords-row">
              <input
                type="number"
                step="any"
                className="form-input sub-input"
                value={destination.latitude}
                onChange={(e) => setDestination({ ...destination, latitude: parseFloat(e.target.value) || 0 })}
                placeholder="Latitud"
                required
              />
              <input
                type="number"
                step="any"
                className="form-input sub-input"
                value={destination.longitude}
                onChange={(e) => setDestination({ ...destination, longitude: parseFloat(e.target.value) || 0 })}
                placeholder="Longitud"
                required
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="form-group full-width">
            <label className="form-label">
              <Clock className="text-amber" size={16} /> Fecha y Hora Aproximada de Salida
            </label>
            <input
              type="datetime-local"
              className="form-input"
              value={departureTime.slice(0, 16)}
              onChange={(e) => setDepartureTime(e.target.value + ':00')}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <span className="flex-center">
              <span className="spinner"></span> Buscando Coincidencias...
            </span>
          ) : (
            <span className="flex-center">
              <Search size={18} /> Buscar Combis Compartidas
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
