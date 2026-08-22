import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Search, Sparkles, Loader2 } from 'lucide-react';

const KNOWN_LOCATIONS = [
  { keywords: ['obelisco', '9 de julio'], lat: -34.6037, lng: -58.3816 },
  { keywords: ['palermo', 'soho', 'hollywood'], lat: -34.5895, lng: -58.3974 },
  { keywords: ['belgrano', 'cabildo', 'juramento'], lat: -34.5614, lng: -58.4563 },
  { keywords: ['pilar', 'parque industrial'], lat: -34.4580, lng: -58.9142 },
  { keywords: ['san isidro', 'estacion san isidro'], lat: -34.4719, lng: -58.5283 },
  { keywords: ['microcentro', 'plaza de mayo'], lat: -34.6083, lng: -58.3712 },
  { keywords: ['recoleta', 'cemetery'], lat: -34.5875, lng: -58.3934 },
  { keywords: ['tigre', 'puerto de frutos'], lat: -34.4251, lng: -58.5796 },
  { keywords: ['san telmo', 'dorrego'], lat: -34.6211, lng: -58.3731 },
  { keywords: ['vicente lopez', 'olivos'], lat: -34.5106, lng: -58.4854 },
  { keywords: ['la plata'], lat: -34.9214, lng: -57.9545 },
  { keywords: ['ezeiza', 'aeropuerto'], lat: -34.8150, lng: -58.5358 }
];

const QUICK_PRESETS = [
  {
    name: 'Obelisco ➔ Palermo',
    origin: { latitude: -34.6037, longitude: -58.3816, address: 'Obelisco (Av. 9 de Julio)' },
    destination: { latitude: -34.5895, longitude: -58.3974, address: 'Palermo Soho' },
  },
  {
    name: 'Belgrano ➔ Pilar',
    origin: { latitude: -34.5614, longitude: -58.4563, address: 'Belgrano (Juramento y Cabildo)' },
    destination: { latitude: -34.4580, longitude: -58.9142, address: 'Pilar Centro' },
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
  const [geocodingOrigin, setGeocodingOrigin] = useState(false);
  const [geocodingDest, setGeocodingDest] = useState(false);

  // Función para autogeocodificar dirección a latitud/longitud
  const geocodeAddress = async (addressText, isOrigin) => {
    if (!addressText || addressText.trim().length < 3) return;

    const lower = addressText.toLowerCase();

    // 1. Buscar en diccionario local rápido
    const localMatch = KNOWN_LOCATIONS.find(loc =>
      loc.keywords.some(k => lower.includes(k))
    );

    if (localMatch) {
      if (isOrigin) {
        setOrigin(prev => ({ ...prev, latitude: localMatch.lat, longitude: localMatch.lng }));
      } else {
        setDestination(prev => ({ ...prev, latitude: localMatch.lat, longitude: localMatch.lng }));
      }
      return;
    }

    // 2. Si no está en el diccionario, buscar en la API de geocodificación gratuita de OpenStreetMap (Nominatim)
    if (isOrigin) setGeocodingOrigin(true);
    else setGeocodingDest(true);

    try {
      const query = encodeURIComponent(addressText + ', Argentina');
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
      const results = await response.json();

      if (results && results.length > 0) {
        const lat = parseFloat(results[0].lat);
        const lon = parseFloat(results[0].lon);

        if (isOrigin) {
          setOrigin(prev => ({ ...prev, latitude: lat, longitude: lon }));
        } else {
          setDestination(prev => ({ ...prev, latitude: lat, longitude: lon }));
        }
      }
    } catch (err) {
      console.warn('Geocoding error:', err);
    } finally {
      if (isOrigin) setGeocodingOrigin(false);
      else setGeocodingDest(false);
    }
  };

  const handleOriginAddressChange = (e) => {
    const newAddr = e.target.value;
    setOrigin(prev => ({ ...prev, address: newAddr }));
    geocodeAddress(newAddr, true);
  };

  const handleDestAddressChange = (e) => {
    const newAddr = e.target.value;
    setDestination(prev => ({ ...prev, address: newAddr }));
    geocodeAddress(newAddr, false);
  };

  const handleSelectPreset = (preset) => {
    setOrigin(preset.origin);
    setDestination(preset.destination);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      origin,
      destination,
      departureTime
    });
  };

  return (
    <div className="card glass-card form-card">
      <div className="card-header">
        <div className="title-with-icon">
          <Search className="accent-icon" size={20} />
          <h2>Crear Solicitud de Viaje</h2>
        </div>
        <p className="card-subtitle">
          Ingresa cualquier origen y destino. El sistema detectará las coordenadas automáticamente y buscará combis cercanas.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="preset-container">
        <span className="preset-label">
          <Sparkles size={14} /> Rutas Frecuentes Demo:
        </span>
        <div className="preset-buttons">
          {QUICK_PRESETS.map((preset, idx) => (
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
            <label className="form-label flex-between">
              <span><MapPin className="text-emerald" size={16} /> Punto de Origen</span>
              {geocodingOrigin && <span className="text-muted text-xs flex-center"><Loader2 size={12} className="spinner" /> Obteniendo Coordenadas...</span>}
            </label>
            <input
              type="text"
              className="form-input"
              value={origin.address}
              onChange={handleOriginAddressChange}
              onBlur={(e) => geocodeAddress(e.target.value, true)}
              placeholder="Ej: Belgrano, San Isidro, Recoleta, Pilar, etc."
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
            <label className="form-label flex-between">
              <span><Navigation className="text-indigo" size={16} /> Punto de Destino</span>
              {geocodingDest && <span className="text-muted text-xs flex-center"><Loader2 size={12} className="spinner" /> Obteniendo Coordenadas...</span>}
            </label>
            <input
              type="text"
              className="form-input"
              value={destination.address}
              onChange={handleDestAddressChange}
              onBlur={(e) => geocodeAddress(e.target.value, false)}
              placeholder="Ej: Microcentro, Palermo, Pilar, Tigre, etc."
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
              <span className="spinner"></span> Buscando Combis Compatibles...
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
