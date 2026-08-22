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
      <div className="driver-recommendations-skeleton flex-column gap-20">
        <div className="skeleton-box shimmer-wave" style={{ height: '90px', borderRadius: '14px' }} />
        <div className="skeleton-box shimmer-wave" style={{ height: '280px', borderRadius: '14px' }} />
      </div>
    );
  }

  return (
    <div className="driver-subpage-container">
      {/* Header section (Clean, no heavy box) */}
      <div className="subpage-header flex-between align-center flex-wrap gap-12 margin-bottom-24">
        <div>
          <span className="subpage-eyebrow text-electric-violet flex-center gap-6">
            <Sparkles size={14} /> Muro de Testimonios
          </span>
          <h1 className="subpage-title">Recomendaciones de Pasajeros</h1>
          <p className="subpage-subtitle">
            Citas y comentarios destacados otorgados por los viajeros de tu comunidad.
          </p>
        </div>
      </div>

      {/* Clean Quotes List (No heavy card boxes) */}
      <div className="recommendations-clean-list flex-column gap-20">
        {recommendations.map((rec) => (
          <div key={rec.id} className="rec-quote-item">
            <div className="rec-quote-header flex-between align-center margin-bottom-8">
              <div className="rec-stars text-electric-violet">
                {'★'.repeat(rec.score)}{'☆'.repeat(5 - rec.score)}
              </div>
              {rec.tripRoute && (
                <span className="rec-route-tag text-xs text-muted flex-center gap-4">
                  <MapPin size={12} className="text-neon-green" /> {rec.tripRoute}
                </span>
              )}
            </div>

            <blockquote className="rec-quote-body">
              "{rec.quote}"
            </blockquote>

            <div className="rec-quote-author-row margin-top-12 flex-center gap-8">
              <div className="rec-avatar-small">
                {rec.passengerName[0]}
              </div>
              <div>
                <strong className="rec-passenger-name">{rec.passengerName}</strong>
                <span className="text-xs text-muted block">Pasajero Frecuente</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
