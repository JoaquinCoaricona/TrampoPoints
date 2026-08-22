import React, { useState } from 'react';
import { Route, Plus, Trash2, Play, CheckCircle2 } from 'lucide-react';
import { optimizeRoute } from '../services/api';
import MapView from './MapView';

export default function RouteOptimizer() {
  const [origin, setOrigin] = useState({ latitude: -34.6037, longitude: -58.3816 });
  const [destination, setDestination] = useState({ latitude: -34.5895, longitude: -58.3974 });
  const [stops, setStops] = useState([
    { latitude: -34.6001, longitude: -58.3900 },
    { latitude: -34.5950, longitude: -58.3950 }
  ]);
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddStop = () => {
    setStops([...stops, { latitude: -34.5920, longitude: -58.3920 }]);
  };

  const handleRemoveStop = (index) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleUpdateStop = (index, field, value) => {
    const updated = [...stops];
    updated[index][field] = parseFloat(value) || 0;
    setStops(updated);
  };

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const res = await optimizeRoute({
        origin,
        stops,
        destination
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card glass-card">
      <div className="card-header">
        <div className="title-with-icon">
          <Route className="accent-icon" size={20} />
          <h2>Herramienta de Optimización de Rutas (POST /api/routes/optimize)</h2>
        </div>
        <p className="card-subtitle">
          Prueba el servicio de cálculo de itinerarios con paradas múltiples.
        </p>
      </div>

      <div className="optimizer-grid">
        <div className="optimizer-form">
          <div className="form-group">
            <label className="form-label">Origen (Lat, Lng)</label>
            <div className="coords-row">
              <input
                type="number"
                step="any"
                className="form-input"
                value={origin.latitude}
                onChange={(e) => setOrigin({ ...origin, latitude: parseFloat(e.target.value) || 0 })}
              />
              <input
                type="number"
                step="any"
                className="form-input"
                value={origin.longitude}
                onChange={(e) => setOrigin({ ...origin, longitude: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="stops-section">
            <div className="flex-between margin-bottom-8">
              <label className="form-label">Paradas Intermedias ({stops.length})</label>
              <button onClick={handleAddStop} className="btn-secondary btn-sm">
                <Plus size={14} /> Añadir Parada
              </button>
            </div>

            {stops.map((stop, idx) => (
              <div key={idx} className="stop-input-row margin-bottom-8">
                <span className="stop-number">#{idx + 1}</span>
                <input
                  type="number"
                  step="any"
                  className="form-input sub-input"
                  value={stop.latitude}
                  onChange={(e) => handleUpdateStop(idx, 'latitude', e.target.value)}
                />
                <input
                  type="number"
                  step="any"
                  className="form-input sub-input"
                  value={stop.longitude}
                  onChange={(e) => handleUpdateStop(idx, 'longitude', e.target.value)}
                />
                <button onClick={() => handleRemoveStop(idx)} className="btn-danger btn-sm">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="form-group margin-top-12">
            <label className="form-label">Destino (Lat, Lng)</label>
            <div className="coords-row">
              <input
                type="number"
                step="any"
                className="form-input"
                value={destination.latitude}
                onChange={(e) => setDestination({ ...destination, latitude: parseFloat(e.target.value) || 0 })}
              />
              <input
                type="number"
                step="any"
                className="form-input"
                value={destination.longitude}
                onChange={(e) => setDestination({ ...destination, longitude: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <button onClick={handleOptimize} className="btn-primary btn-full margin-top-16" disabled={loading}>
            {loading ? 'Calculando...' : <><Play size={16} /> Calcular y Ordenar Ruta</>}
          </button>
        </div>

        {/* Output section */}
        <div className="optimizer-result">
          {result ? (
            <div>
              <div className="result-stats flex-between margin-bottom-12">
                <div>
                  <strong>Distancia:</strong> {(result.distanceMeters / 1000).toFixed(2)} km
                </div>
                <div>
                  <strong>Duración:</strong> {Math.round(result.durationSeconds / 60)} min
                </div>
              </div>

              <h4>Paradas Ordenadas Retornadas:</h4>
              <ul className="ordered-stops-list margin-bottom-16">
                {result.orderedStops?.map((s) => (
                  <li key={s.order}>
                    <CheckCircle2 size={14} className="text-emerald" /> Orden #{s.order}: Lat {s.latitude.toFixed(4)}, Lng {s.longitude.toFixed(4)}
                  </li>
                ))}
              </ul>

              <MapView
                stops={[
                  { type: 'PICKUP', order: 0, latitude: origin.latitude, longitude: origin.longitude, address: 'Origen' },
                  ...result.orderedStops.map(s => ({ type: 'PICKUP', order: s.order, latitude: s.latitude, longitude: s.longitude, address: `Parada #${s.order}` })),
                  { type: 'DROPOFF', order: result.orderedStops.length + 1, latitude: destination.latitude, longitude: destination.longitude, address: 'Destino' }
                ]}
                polyline={result.polyline}
              />
            </div>
          ) : (
            <div className="empty-placeholder">
              Haz clic en "Calcular y Ordenar Ruta" para obtener la respuesta formateada del backend.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
