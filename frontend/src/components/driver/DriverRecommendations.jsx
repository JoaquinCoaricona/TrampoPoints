import React, { useState, useEffect } from 'react';
import { Sparkles, Quote, MapPin, UserCheck, Loader2 } from 'lucide-react';
import { getDriverRecommendations } from '../../services/driverService';

export default function DriverRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const data = await getDriverRecommendations();
      setRecommendations(data);
    } catch (err) {
      console.error('Error al cargar recomendaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card glass-card padding-32 text-center flex-center">
        <Loader2 className="spinner" size={24} />
        <span>Cargando recomendaciones...</span>
      </div>
    );
  }

  return (
    <div className="driver-recommendations-view">
      <div className="card glass-card">
        <div className="card-header flex-between margin-bottom-24">
          <div>
            <h2 className="title-with-icon">
              <Sparkles className="accent-icon text-amber" size={22} /> Recomendaciones de Pasajeros
            </h2>
            <p className="card-subtitle">
              Muro de testimonios y valoraciones destacadas recibidas de pasajeros habituales.
            </p>
          </div>
        </div>

        <div className="recommendations-grid">
          {recommendations.map((rec) => (
            <div key={rec.id} className="recommendation-card card glass-card">
              <div className="rec-quote-icon">
                <Quote size={28} className="text-indigo" />
              </div>

              <div className="rec-stars text-amber margin-bottom-8">
                {'★'.repeat(rec.score)}{'☆'.repeat(5 - rec.score)}
              </div>

              <blockquote className="rec-quote-text">
                "{rec.quote}"
              </blockquote>

              <div className="rec-footer margin-top-16 flex-between">
                <div className="rec-author-info flex-center gap-8">
                  <div className="rec-avatar-circle">
                    <UserCheck size={16} />
                  </div>
                  <div>
                    <strong>{rec.passengerName}</strong>
                    <span className="block text-xs text-muted">Pasajero Frecuente</span>
                  </div>
                </div>

                {rec.tripRoute && (
                  <span className="badge badge-subtle flex-center gap-4 text-xs">
                    <MapPin size={12} /> {rec.tripRoute}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
