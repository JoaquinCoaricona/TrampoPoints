import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Clock, PlusCircle, CheckCircle2, Search, Loader2, Sparkles } from 'lucide-react';

const PRESET_LOCATIONS = [
  { name: 'Obelisco (Av. 9 de Julio)', address: 'Obelisco, Av. 9 de Julio, Buenos Aires', latitude: -34.6037, longitude: -58.3816 },
  { name: 'Palermo (Plaza Italia)', address: 'Palermo, Av. Santa Fe y Italia, Buenos Aires', latitude: -34.5895, longitude: -58.3974 },
  { name: 'Belgrano (Cabildo y Juramento)', address: 'Belgrano, Av. Cabildo 2000, Buenos Aires', latitude: -34.5614, longitude: -58.4563 },
  { name: 'Pilar (Centro / Parque Ind.)', address: 'Pilar Centro, Tratado del Pilar, Buenos Aires', latitude: -34.4580, longitude: -58.9142 },
  { name: 'San Isidro (Estación)', address: 'San Isidro, Belgrano y Centenario, Buenos Aires', latitude: -34.4719, longitude: -58.5283 },
  { name: 'Microcentro (Plaza de Mayo)', address: 'Microcentro, Plaza de Mayo, Buenos Aires', latitude: -34.6083, longitude: -58.3712 },
  { name: 'Recoleta (Av. Las Heras)', address: 'Recoleta, Av. Las Heras y Junín, Buenos Aires', latitude: -34.5875, longitude: -58.3934 },
  { name: 'Tigre (Puerto de Frutos)', address: 'Tigre, Puerto de Frutos, Buenos Aires', latitude: -34.4251, longitude: -58.5796 },
  { name: 'Vicente López (Olivos)', address: 'Vicente López, Av. Maipú 2000, Buenos Aires', latitude: -34.5106, longitude: -58.4854 },
  { name: 'Quilmes Centro', address: 'Quilmes, Peatonal Rivadavia, Buenos Aires', latitude: -34.7242, longitude: -58.2608 },
  { name: 'San Telmo (Plaza Dorrego)', address: 'San Telmo, Plaza Dorrego, Buenos Aires', latitude: -34.6211, longitude: -58.3731 },
  { name: 'Caballito (Plaza Primera Junta)', address: 'Caballito, Av. Rivadavia 5200, Buenos Aires', latitude: -34.6186, longitude: -58.4425 },
  { name: 'Almagro (Av. Corrientes y Medrano)', address: 'Almagro, Av. Corrientes 3900, Buenos Aires', latitude: -34.6108, longitude: -58.4215 },
  { name: 'Núñez (Estación / Av. del Libertador)', address: 'Núñez, Av. del Libertador 8000, Buenos Aires', latitude: -34.5461, longitude: -58.4625 },
  { name: 'Morón (Estación Centro)', address: 'Morón Centro, Almirante Brown 800, Buenos Aires', latitude: -34.6514, longitude: -58.6186 },
  { name: 'Aeropuerto de Ezeiza', address: 'Aeropuerto Internacional de Ezeiza, Buenos Aires', latitude: -34.8150, longitude: -58.5358 },
  { name: 'Aeroparque Jorge Newbery', address: 'Aeroparque Jorge Newbery, Buenos Aires', latitude: -34.5592, longitude: -58.4156 },
  { name: 'La Plata (Plaza Moreno)', address: 'La Plata, Plaza Moreno, Calle 12, Buenos Aires', latitude: -34.9214, longitude: -57.9545 }
];

export default function TripRequestForm({ onSubmit, loading }) {
  const [origin, setOrigin] = useState({
    address: PRESET_LOCATIONS[0].address,
    latitude: PRESET_LOCATIONS[0].latitude,
    longitude: PRESET_LOCATIONS[0].longitude
  });

  const [destination, setDestination] = useState({
    address: PRESET_LOCATIONS[1].address,
    latitude: PRESET_LOCATIONS[1].latitude,
    longitude: PRESET_LOCATIONS[1].longitude
  });

  const [departureTime, setDepartureTime] = useState('2026-08-22T08:30:00');
  const [createdSuccess, setCreatedSuccess] = useState(false);

  // Estados de sugerencias y geocodificación
  const [originQuery, setOriginQuery] = useState(PRESET_LOCATIONS[0].address);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [isGeocodingOrigin, setIsGeocodingOrigin] = useState(false);

  const [destQuery, setDestQuery] = useState(PRESET_LOCATIONS[1].address);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [isGeocodingDest, setIsGeocodingDest] = useState(false);

  const originDebounceTimer = useRef(null);
  const destDebounceTimer = useRef(null);

  // Buscar coordenadas para la dirección ingresada
  const fetchGeocode = async (queryText, isOrigin) => {
    if (!queryText || queryText.trim().length < 3) return;

    const lower = queryText.toLowerCase().trim();

    // 1. Coincidencia rápida en la lista de ubicaciones
    const match = PRESET_LOCATIONS.find(loc =>
      loc.name.toLowerCase().includes(lower) || loc.address.toLowerCase().includes(lower)
    );

    if (match) {
      if (isOrigin) {
        setOrigin({ address: queryText, latitude: match.latitude, longitude: match.longitude });
        setOriginSuggestions([]);
      } else {
        setDestination({ address: queryText, latitude: match.latitude, longitude: match.longitude });
        setDestSuggestions([]);
      }
      return;
    }

    // 2. Geocodificación remota con Nominatim OpenStreetMap
    if (isOrigin) setIsGeocodingOrigin(true);
    else setIsGeocodingDest(true);

    try {
      const encoded = encodeURIComponent(queryText + ', Argentina');
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=4`);
      const data = await res.json();

      if (data && data.length > 0) {
        const topResult = data[0];
        const lat = parseFloat(topResult.lat);
        const lon = parseFloat(topResult.lon);

        if (isOrigin) {
          setOrigin({ address: queryText, latitude: lat, longitude: lon });
          setOriginSuggestions(data);
        } else {
          setDestination({ address: queryText, latitude: lat, longitude: lon });
          setDestSuggestions(data);
        }
      }
    } catch (err) {
      console.warn('Geocoding search failed, using fallback coords:', err);
    } finally {
      if (isOrigin) setIsGeocodingOrigin(false);
      else setIsGeocodingDest(false);
    }
  };

  const handleOriginInputChange = (text) => {
    setOriginQuery(text);
    setOrigin(prev => ({ ...prev, address: text }));

    // Filtrar sugerencias locales inmediatas
    if (text.length >= 2) {
      const matches = PRESET_LOCATIONS.filter(l =>
        l.name.toLowerCase().includes(text.toLowerCase()) ||
        l.address.toLowerCase().includes(text.toLowerCase())
      );
      setOriginSuggestions(matches);
    } else {
      setOriginSuggestions([]);
    }

    if (originDebounceTimer.current) clearTimeout(originDebounceTimer.current);
    originDebounceTimer.current = setTimeout(() => {
      fetchGeocode(text, true);
    }, 500);
  };

  const handleDestInputChange = (text) => {
    setDestQuery(text);
    setDestination(prev => ({ ...prev, address: text }));

    if (text.length >= 2) {
      const matches = PRESET_LOCATIONS.filter(l =>
        l.name.toLowerCase().includes(text.toLowerCase()) ||
        l.address.toLowerCase().includes(text.toLowerCase())
      );
      setDestSuggestions(matches);
    } else {
      setDestSuggestions([]);
    }

    if (destDebounceTimer.current) clearTimeout(destDebounceTimer.current);
    destDebounceTimer.current = setTimeout(() => {
      fetchGeocode(text, false);
    }, 500);
  };

  const handleSelectPresetLocation = (preset, isOrigin) => {
    if (isOrigin) {
      setOriginQuery(preset.address);
      setOrigin({ address: preset.address, latitude: preset.latitude, longitude: preset.longitude });
      setOriginSuggestions([]);
    } else {
      setDestQuery(preset.address);
      setDestination({ address: preset.address, latitude: preset.latitude, longitude: preset.longitude });
      setDestSuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCreatedSuccess(true);
    setTimeout(() => setCreatedSuccess(false), 3000);

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
          <PlusCircle className="accent-icon" size={24} />
          <h2>Generar Solicitud de Viaje Compartido</h2>
        </div>
        <p className="card-subtitle">
          Escribe cualquier dirección u origen/destino. Las coordenadas se detectarán automáticamente.
        </p>
      </div>

      {createdSuccess && (
        <div className="banner banner-success margin-bottom-16 flex-center gap-8">
          <CheckCircle2 size={18} /> Solicitud creada exitosamente. Buscando combis y agrupando viajes...
        </div>
      )}

      {/* Botones de Selección Rápida */}
      <div className="preset-container margin-bottom-16">
        <span className="preset-label flex-center gap-4 text-xs font-bold">
          <Sparkles size={14} className="text-amber" /> Lugares Frecuentes Demo:
        </span>
        <div className="preset-buttons">
          {PRESET_LOCATIONS.slice(0, 6).map((preset, idx) => (
            <button
              key={idx}
              type="button"
              className="btn-preset"
              onClick={() => {
                handleSelectPresetLocation(preset, true);
                const nextDest = PRESET_LOCATIONS[(idx + 3) % PRESET_LOCATIONS.length];
                handleSelectPresetLocation(nextDest, false);
              }}
            >
              {preset.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="trip-form">
        <div className="form-grid">
          {/* Origin Section */}
          <div className="form-group relative">
            <label className="form-label flex-between">
              <span><MapPin className="text-emerald" size={16} /> Punto de Origen</span>
              {isGeocodingOrigin && <span className="text-xs text-muted flex-center"><Loader2 size={12} className="spinner" /> Obteniendo Coordenadas...</span>}
            </label>
            
            <input
              type="text"
              className="form-input"
              value={originQuery}
              onChange={(e) => handleOriginInputChange(e.target.value)}
              placeholder="Escribe una dirección (Ej: Belgrano, San Isidro, Recoleta, Pilar...)"
              required
            />

            {/* Listado de sugerencias de Origen */}
            {originSuggestions.length > 0 && (
              <ul className="suggestions-list card glass-card">
                {originSuggestions.map((item, idx) => (
                  <li
                    key={idx}
                    className="suggestion-item"
                    onClick={() => handleSelectPresetLocation({
                      address: item.display_name || item.address,
                      latitude: parseFloat(item.lat || item.latitude),
                      longitude: parseFloat(item.lon || item.longitude)
                    }, true)}
                  >
                    📍 {item.name || item.display_name || item.address}
                  </li>
                ))}
              </ul>
            )}

            <div className="coords-row margin-top-8">
              <span className="text-xs text-muted font-mono flex-center gap-4">
                Lat: <strong>{origin.latitude}</strong> | Lng: <strong>{origin.longitude}</strong>
              </span>
            </div>
          </div>

          {/* Destination Section */}
          <div className="form-group relative">
            <label className="form-label flex-between">
              <span><Navigation className="text-indigo" size={16} /> Punto de Destino</span>
              {isGeocodingDest && <span className="text-xs text-muted flex-center"><Loader2 size={12} className="spinner" /> Obteniendo Coordenadas...</span>}
            </label>

            <input
              type="text"
              className="form-input"
              value={destQuery}
              onChange={(e) => handleDestInputChange(e.target.value)}
              placeholder="Escribe el destino (Ej: Microcentro, Palermo, Pilar, Tigre...)"
              required
            />

            {/* Listado de sugerencias de Destino */}
            {destSuggestions.length > 0 && (
              <ul className="suggestions-list card glass-card">
                {destSuggestions.map((item, idx) => (
                  <li
                    key={idx}
                    className="suggestion-item"
                    onClick={() => handleSelectPresetLocation({
                      address: item.display_name || item.address,
                      latitude: parseFloat(item.lat || item.latitude),
                      longitude: parseFloat(item.lon || item.longitude)
                    }, false)}
                  >
                    🏁 {item.name || item.display_name || item.address}
                  </li>
                ))}
              </ul>
            )}

            <div className="coords-row margin-top-8">
              <span className="text-xs text-muted font-mono flex-center gap-4">
                Lat: <strong>{destination.latitude}</strong> | Lng: <strong>{destination.longitude}</strong>
              </span>
            </div>
          </div>

          {/* Date & Time */}
          <div className="form-group full-width">
            <label className="form-label">
              <Clock className="text-amber" size={16} /> Horario Deseado de Salida
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

        <button type="submit" className="btn-primary full-width margin-top-16" disabled={loading}>
          {loading ? (
            <span className="flex-center">
              <span className="spinner"></span> Generando Solicitud...
            </span>
          ) : (
            <span className="flex-center font-bold">
              <PlusCircle size={20} /> Generar Solicitud de Viaje
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
