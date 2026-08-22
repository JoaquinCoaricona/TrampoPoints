import React, { useState, useEffect } from 'react';
import { Star, MapPin, UserCheck } from 'lucide-react';
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
      <div className="driver-subpage-container flex-column gap-32">
        <div className="skeleton-box shimmer-wave" style={{ height: '80px', borderRadius: '10px' }} />
        <div className="skeleton-box shimmer-wave" style={{ height: '240px', borderRadius: '10px' }} />
      </div>
    );
  }

  return (
    <div className="driver-subpage-container">
      {/* 1. Header with clear title and verified badge */}
      <header className="recs-header-block flex-between align-center flex-wrap gap-20 margin-bottom-40">
        <div className="flex-column gap-6">
          <span className="section-eyebrow text-electric-violet">Testimonios de Pasajeros</span>
          <h1 className="recs-page-title">Recomendaciones</h1>
        </div>

        <div className="badge-verified-clean">
          <UserCheck size={14} className="text-neon-green" />
          <span>Comunidad Verificada</span>
        </div>
      </header>

      <div className="hairline-divider margin-bottom-40" />

      {/* 2. Editorial Wall of Recommendations (Vertical flow, generous line-height) */}
      <div className="recommendations-editorial-list flex-column gap-40">
        {recommendations.map((rec) => (
          <div key={rec.id} className="rec-editorial-item flex-column gap-14">
            <div className="flex-between align-center flex-wrap gap-12">
              <div className="flex-center gap-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={i < rec.score ? 'text-electric-violet' : 'text-dim'}
                    fill={i < rec.score ? '#7C4DFF' : 'none'}
                  />
                ))}
              </div>
              {rec.tripRoute && (
                <span className="rec-route-pill text-xs text-muted flex-center gap-6">
                  <MapPin size={12} className="text-neon-green" /> {rec.tripRoute}
                </span>
              )}
            </div>

            <blockquote className="rec-editorial-body">
              "{rec.quote}"
            </blockquote>

            <div className="rec-author-line flex-center gap-10 text-sm margin-top-4">
              <span className="text-main font-semibold">{rec.passengerName}</span>
              <span className="text-muted">· Pasajero Frecuente</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
