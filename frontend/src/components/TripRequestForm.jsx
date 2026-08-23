import React, { useState, useRef } from 'react';
import { MapPin, Navigation, Clock, Loader2, ArrowRight } from 'lucide-react';

const PRESET_LOCATIONS = [
  { name: 'Obelisco (Av. 9 de Julio)', address: 'Obelisco, Av. 9 de Julio, Buenos Aires', latitude: -34.6037, longitude: -58.3816 },
  { name: 'Palermo (Plaza Italia)', address: 'Palermo, Av. Santa Fe y Italia, Buenos Aires', latitude: -34.5895, longitude: -58.3974 },
  { name: 'Belgrano (Cabildo y Juramento)', address: 'Belgrano, Av. Cabildo 2000, Buenos Aires', latitude: -34.5614, longitude: -58.4563 },
  { name: 'Pilar (Centro / Parque Ind.)', address: 'Pilar Centro, Tratado del Pilar, Buenos Aires', latitude: -34.4580, longitude: -58.9142 },
  { name: 'San Isidro (Estación)', address: 'San Isidro, Belgrano y Centenario, Buenos Aires', latitude: -34.4719, longitude: -58.5283 },
  { name: 'Microcentro (Plaza de Mayo)', address: 'Microcentro, Plaza de Mayo, Buenos Aires', latitude: -34.6083, longitude: -58.3712 }
];

export default function TripRequestForm({ onSubmit, loading }) {
  const [origin, setOrigin] = useState({ address: '', latitude: 0, longitude: 0 });
  const [destination, setDestination] = useState({ address: '', latitude: 0, longitude: 0 });

  // Validaciones para obligar a seleccionar una opción de la lista
  const [isOriginSelected, setIsOriginSelected] = useState(false);
  const [isDestSelected, setIsDestSelected] = useState(false);

  const today = new Date();
  const defaultDate = today.toISOString().split('T')[0];
  const defaultTime = '08:30';

  const [departureDate, setDepartureDate] = useState(defaultDate);
  const [departureTimeOnly, setDepartureTimeOnly] = useState(defaultTime);
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const [originQuery, setOriginQuery] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [isGeocodingOrigin, setIsGeocodingOrigin] = useState(false);

  const [destQuery, setDestQuery] = useState('');
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [isGeocodingDest, setIsGeocodingDest] = useState(false);

  const originDebounceTimer = useRef(null);
  const destDebounceTimer = useRef(null);

  const isDriverAwake = originQuery.trim().length > 0 || destQuery.trim().length > 0;

  const fetchGeocode = async (queryText, isOrigin) => {
    if (!queryText || queryText.trim().length < 3) return;

    const lower = queryText.toLowerCase().trim();
    const match = PRESET_LOCATIONS.find(loc =>
      loc.name.toLowerCase().includes(lower) || loc.address.toLowerCase().includes(lower)
    );

    if (match) {
      if (isOrigin) {
        setOrigin({ address: match.address, latitude: match.latitude, longitude: match.longitude });
        setIsOriginSelected(true);
        setOriginSuggestions([]);
      } else {
        setDestination({ address: match.address, latitude: match.latitude, longitude: match.longitude });
        setIsDestSelected(true);
        setDestSuggestions([]);
      }
      return;
    }

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
    setIsOriginSelected(false);

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
    setIsDestSelected(false);

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
      setIsOriginSelected(true);
      setOriginSuggestions([]);
    } else {
      setDestQuery(preset.address);
      setDestination({ address: preset.address, latitude: preset.latitude, longitude: preset.longitude });
      setIsDestSelected(true);
      setDestSuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isOriginSelected || !isDestSelected) return;

    setCreatedSuccess(true);
    setTimeout(() => setCreatedSuccess(false), 3000);

    const fullDepartureTime = `${departureDate}T${departureTimeOnly}:00`;
    onSubmit({
      origin,
      destination,
      departureTime: fullDepartureTime
    });
  };

  return (
    <div className="card glass-card form-card" style={{ background: 'transparent', border: 'none', padding: '0', boxShadow: 'none' }}>
      <style>{`
        .trip-form-container-centered {
          max-width: 960px;
          margin: 0 auto;
          padding: 20px 0;
        }

        .trip-form-layout-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 48px;
          align-items: center;
        }
        @media (max-width: 768px) {
          .trip-form-layout-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .trip-form-animation-col {
            display: flex;
            justify-content: center;
          }
        }

        /* Serpentine road connection layout */
        .inputs-serpentine-wrap {
          position: relative;
          padding-left: 36px;
        }
        
        @keyframes road-scroll {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -20; }
        }

        /* Large styled inputs */
        .large-input-group {
          margin-bottom: 28px;
          position: relative;
        }
        .large-input-label {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .large-form-input {
          width: 100%;
          background: #09090b;
          border: 1px solid #1f1f23;
          border-radius: 12px;
          padding: 18px 24px;
          font-size: 16px;
          color: #ffffff;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .large-form-input:focus {
          border-color: #cbd5e1;
          background: #0c0c0e;
          box-shadow: 0 0 0 1px #cbd5e1;
        }

        /* Compact Date/Time inputs below */
        .small-datetime-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 28px;
        }
        .small-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .small-input-label {
          font-size: 11px;
          font-weight: 700;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .small-form-input {
          background: #09090b;
          border: 1px solid #1f1f23;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #cbd5e1;
          outline: none;
          transition: border-color 0.2s;
        }
        .small-form-input:focus {
          border-color: #71717a;
        }

        /* Submit Button animation */
        .btn-viajar {
          background: #ffffff;
          color: #09090b;
          font-size: 18px;
          font-weight: 800;
          padding: 18px 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.05);
        }
        .btn-viajar:hover:not(:disabled) {
          background: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.1);
        }
        .btn-viajar:hover .btn-arrow-icon {
          transform: translateX(8px);
        }
        .btn-viajar:disabled {
          background: #18181b;
          color: #71717a;
          border: 1px solid #27272a;
          cursor: not-allowed;
        }
        .btn-arrow-icon {
          transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        /* SVG Driver Illustration (Floating, no border/box) */
        .driver-illustration-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 340px;
          height: 340px;
          background: transparent;
          position: relative;
        }
        .driver-interactive-svg {
          width: 100%;
          height: 100%;
        }

        /* Floating Zzz */
        @keyframes float-zzz {
          0% { opacity: 0; transform: translateY(6px) scale(0.85); }
          50% { opacity: 0.8; }
          100% { opacity: 0; transform: translateY(-16px) scale(1.15); }
        }
        .zzz {
          font-family: monospace;
          font-weight: 700;
          fill: #71717a;
          animation: float-zzz 3.5s infinite ease-in-out;
          transform-origin: center;
        }
        .z1 { animation-delay: 0s; font-size: 11px; }
        .z2 { animation-delay: 1.2s; font-size: 15px; }
        .z3 { animation-delay: 2.4s; font-size: 20px; }
      `}</style>

      <div className="trip-form-container-centered">
        {/* Simplified Title */}
        <div className="card-header" style={{ padding: '0', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', margin: '0' }}>Generar Solicitud</h2>
        </div>

        {createdSuccess && (
          <div className="banner banner-success margin-bottom-24" style={{ background: 'rgba(34, 197, 94, 0.04)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.15)', padding: '16px', borderRadius: '8px', fontSize: '13px' }}>
            Solicitud creada exitosamente. Buscando combis y agrupando viajes...
          </div>
        )}

        <div className="trip-form-layout-grid">
          {/* Left Column: Form Fields with serpentine road line on the left */}
          <div className="trip-form-inputs-col">
            <form onSubmit={handleSubmit}>

              <div className="inputs-serpentine-wrap">
                {/* Winding road loop-the-loop connecting Origen and Destino inputs */}
                <svg
                  style={{
                    position: 'absolute',
                    left: '-10px',
                    top: '0px',
                    height: '220px',
                    width: '40px',
                    overflow: 'visible',
                    pointerEvents: 'none'
                  }}
                >
                  <path
                    d="M 24,56 C -10,56 -15,82 12,96 C 35,109 35,124 12,138 C -15,152 -10,174 24,174"
                    fill="none"
                    strokeWidth="2.5"
                    strokeDasharray="5 5"
                    style={{
                      stroke: isDriverAwake ? '#22c55e' : '#27272a',
                      transition: 'stroke 0.5s ease',
                      animation: isDriverAwake ? 'road-scroll 1.5s linear infinite' : 'none'
                    }}
                  />
                </svg>

                {/* Origen Input */}
                <div className="large-input-group">
                  <label className="large-input-label">
                    <MapPin className="text-emerald" size={20} style={{ color: '#10b981' }} /> Origen
                  </label>
                  <input
                    type="text"
                    className="large-form-input"
                    value={originQuery}
                    onChange={(e) => handleOriginInputChange(e.target.value)}
                    placeholder="Dirección de origen..."
                    required
                  />

                  {/* Warning if typed but not selected from dropdown */}
                  {originQuery.trim().length >= 3 && !isOriginSelected && (
                    <span style={{ fontSize: '12px', color: '#f87171', marginTop: '6px', display: 'block' }}>
                      Seleccioná una dirección sugerida de la lista.
                    </span>
                  )}

                  {/* Suggestions dropdown */}
                  {originSuggestions.length > 0 && (
                    <ul className="suggestions-list card glass-card" style={{ zIndex: 10, left: 0 }}>
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
                          {item.name || item.display_name || item.address}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Destino Input */}
                <div className="large-input-group" style={{ marginBottom: '16px' }}>
                  <label className="large-input-label">
                    <Navigation className="text-indigo" size={20} style={{ color: '#6366f1' }} /> Destino
                  </label>
                  <input
                    type="text"
                    className="large-form-input"
                    value={destQuery}
                    onChange={(e) => handleDestInputChange(e.target.value)}
                    placeholder="Dirección de destino..."
                    required
                  />

                  {/* Warning if typed but not selected from dropdown */}
                  {destQuery.trim().length >= 3 && !isDestSelected && (
                    <span style={{ fontSize: '12px', color: '#f87171', marginTop: '6px', display: 'block' }}>
                      Seleccioná una dirección sugerida de la lista.
                    </span>
                  )}

                  {/* Suggestions dropdown */}
                  {destSuggestions.length > 0 && (
                    <ul className="suggestions-list card glass-card" style={{ zIndex: 10, left: 0 }}>
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
                          {item.name || item.display_name || item.address}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Compact Date/Time inputs */}
              <div className="small-datetime-row">
                <div className="small-input-group">
                  <label className="small-input-label">
                    <Clock size={12} /> Fecha de Salida
                  </label>
                  <input
                    type="date"
                    className="small-form-input"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    required
                  />
                </div>

                <div className="small-input-group">
                  <label className="small-input-label">
                    <Clock size={12} /> Hora de Salida
                  </label>
                  <input
                    type="time"
                    className="small-form-input"
                    value={departureTimeOnly}
                    onChange={(e) => setDepartureTimeOnly(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Action submit button - Disabled until BOTH directions are selected */}
              <button
                type="submit"
                className="btn-viajar"
                disabled={loading || !isOriginSelected || !isDestSelected}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="spinner" />
                    <span>Buscando combis...</span>
                  </>
                ) : (
                  <>
                    <span>Viajar</span>
                    <ArrowRight size={22} className="btn-arrow-icon" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: High Detail Driver SVG Illustration (Mirrored, based on reference photo) */}
          <div className="trip-form-animation-col">
            <div className="driver-illustration-wrap">
              <svg
                className="driver-interactive-svg"
                viewBox="0 0 240 240"
                style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
              >
                {/* 1. Steering Wheel & Spoke Design (Tilted left, matches photo layout) */}
                <ellipse cx="108" cy="142" rx="35" ry="46" transform="rotate(-15 108 142)" stroke="#1f1f23" strokeWidth="3" fill="none" />
                <ellipse cx="108" cy="142" rx="30" ry="40" transform="rotate(-15 108 142)" stroke="#1f1f23" strokeWidth="2" fill="none" />
                {/* Center Hub */}
                <ellipse cx="108" cy="142" rx="9" ry="12" transform="rotate(-15 108 142)" stroke="#1f1f23" strokeWidth="2.5" fill="none" />
                {/* Spokes of the wheel */}
                <line x1="108" y1="142" x2="80" y2="128" transform="rotate(-15 108 142)" stroke="#1f1f23" strokeWidth="2.5" />
                <line x1="108" y1="142" x2="136" y2="128" transform="rotate(-15 108 142)" stroke="#1f1f23" strokeWidth="2.5" />
                <line x1="108" y1="142" x2="108" y2="178" transform="rotate(-15 108 142)" stroke="#1f1f23" strokeWidth="2.5" />

                {/* 2. Steering Column Console */}
                <path d="M 98,148 L 50,175 C 45,178 30,178 20,178" stroke="#1f1f23" strokeWidth="3" fill="none" />
                <path d="M 112,152 L 80,184" stroke="#1f1f23" strokeWidth="3" fill="none" />

                {/* 3. Driver Upper Body Group (Waist anchor at (190, 185)) */}
                <g
                  style={{
                    transform: isDriverAwake ? 'rotate(0deg) translate(0px, 0px)' : 'rotate(-16deg) translate(-26px, 12px)',
                    transformOrigin: '190px 185px',
                    transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  {/* Spine / Torso back curvature */}
                  <path
                    d="M 192,185 C 195,145 186,115 166,95"
                    stroke={isDriverAwake ? '#e4e4e7' : '#71717a'}
                    strokeWidth="2.5"
                    fill="none"
                    style={{ transition: 'stroke 0.8s' }}
                  />
                  {/* Chest / Front contour */}
                  <path
                    d="M 148,185 C 146,155 140,128 132,112"
                    stroke={isDriverAwake ? '#e4e4e7' : '#71717a'}
                    strokeWidth="2.5"
                    fill="none"
                    style={{ transition: 'stroke 0.8s' }}
                  />

                  {/* Hoodie Hood Folds */}
                  <path
                    d="M 166,95 C 172,99 184,108 188,124 C 190,140 178,145 168,138 C 160,132 158,118 158,118"
                    stroke={isDriverAwake ? '#e4e4e7' : '#71717a'}
                    strokeWidth="2"
                    fill="none"
                    style={{ transition: 'stroke 0.8s' }}
                  />
                  <path
                    d="M 172,105 C 178,110 182,118 182,126"
                    stroke={isDriverAwake ? '#a1a1aa' : '#52525b'}
                    strokeWidth="1.5"
                    fill="none"
                    style={{ transition: 'stroke 0.8s' }}
                  />

                  {/* Detailed Head & Hair profile */}
                  <path
                    d="M 124,70 C 122,60 134,50 144,56 C 150,52 158,56 160,66 C 156,64 148,63 142,69 C 136,64 128,66 124,70 Z"
                    stroke={isDriverAwake ? '#e4e4e7' : '#71717a'}
                    strokeWidth="2"
                    fill="none"
                    style={{ transition: 'stroke 0.8s' }}
                  />
                  <path
                    d="M 132,68 C 136,58 148,58 152,65"
                    stroke={isDriverAwake ? '#e4e4e7' : '#71717a'}
                    strokeWidth="1.5"
                    fill="none"
                    style={{ transition: 'stroke 0.8s' }}
                  />

                  {/* Face Outline */}
                  <path
                    d="M 148,78 C 146,65 136,65 132,68 C 127,71 123,76 123,80 L 118,83 C 117,84 117,86 119,87 L 123,89 C 123,92 125,96 129,99 C 135,102 147,98 147,88 C 147,84 149,81 148,78 Z"
                    stroke={isDriverAwake ? '#e4e4e7' : '#71717a'}
                    strokeWidth="2.5"
                    fill="none"
                    style={{ transition: 'stroke 0.8s' }}
                  />

                  {/* Face expression cross-fade */}
                  <g style={{ opacity: isDriverAwake ? 1 : 0, transition: 'opacity 0.6s' }}>
                    <circle cx="131" cy="78" r="1.2" fill="#e4e4e7" />
                    <path d="M 126,89 Q 130,92 133,89" stroke="#e4e4e7" strokeWidth="1.5" fill="none" />
                  </g>

                  <g style={{ opacity: isDriverAwake ? 0 : 1, transition: 'opacity 0.6s' }}>
                    <path d="M 128,79 Q 131,81 133,79" stroke="#71717a" strokeWidth="1.5" fill="none" />
                  </g>
                </g>

                {/* Awake Arms: placed on the steering wheel */}
                <g style={{ opacity: isDriverAwake ? 1 : 0, transform: isDriverAwake ? 'scale(1)' : 'scale(0.92)', transformOrigin: '155px 120px', transition: 'opacity 0.6s, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                  <path d="M 155,120 C 130,105 110,105 92,118" stroke="#e4e4e7" strokeWidth="2.5" fill="none" />
                  <path d="M 152,132 C 130,122 112,122 96,134" stroke="#e4e4e7" strokeWidth="2.5" fill="none" />
                </g>

                {/* Sleeping Arm draped over the steering wheel */}
                <g style={{ opacity: isDriverAwake ? 0 : 1, transform: isDriverAwake ? 'scale(1.08)' : 'scale(1)', transformOrigin: '160px 115px', transition: 'opacity 0.6s, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                  <path d="M 162,115 C 138,102 110,102 86,118" stroke="#71717a" strokeWidth="2.5" fill="none" />
                  <path d="M 86,118 C 72,132 64,152 64,166" stroke="#71717a" strokeWidth="2.5" fill="none" />
                  <path d="M 64,166 Q 60,172 61,180" stroke="#71717a" strokeWidth="2" fill="none" />
                  <path d="M 66,168 L 66,186" stroke="#71717a" strokeWidth="2" />
                  <path d="M 69,169 L 70,188" stroke="#71717a" strokeWidth="2" />
                  <path d="M 72,168 L 73,184" stroke="#71717a" strokeWidth="2" />
                </g>

                {/* Awake Sparks */}
                <g style={{ opacity: isDriverAwake ? 1 : 0, transition: 'opacity 0.8s' }}>
                  <line x1="82" y1="95" x2="72" y2="86" stroke="#22c55e" strokeWidth="1.5" />
                  <line x1="88" y1="156" x2="78" y2="164" stroke="#22c55e" strokeWidth="1.5" />
                </g>

                {/* Floating Zzz */}
                <g style={{ opacity: isDriverAwake ? 0 : 1, transition: 'opacity 0.4s' }}>
                  <text x="175" y="80" className="zzz z1">z</text>
                  <text x="185" y="60" className="zzz z2">Z</text>
                  <text x="200" y="40" className="zzz z3">Z</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}