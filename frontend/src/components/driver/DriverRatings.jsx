import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, CheckCircle2, MapPin } from 'lucide-react';
import { getDriverRatings } from '../../services/driverService';

export default function DriverRatings() {
  const [ratingsData, setRatingsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    setLoading(true);
    try {
      const data = await getDriverRatings();
      setRatingsData(data);
    } catch (err) {
      console.error('Error al cargar calificaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="driver-subpage-container flex-column gap-32">
        <div className="skeleton-box shimmer-wave" style={{ height: '140px', borderRadius: '10px' }} />
        <div className="skeleton-box shimmer-wave" style={{ height: '300px', borderRadius: '10px' }} />
      </div>
    );
  }

  const { ratingAverage, totalRatings, fiveStars, fourStars, threeStars, twoStars, oneStar, recentRatings } = ratingsData || {};

  const getPercent = (count) => {
    if (!totalRatings || totalRatings === 0) return 0;
    return Math.round((count / totalRatings) * 100);
  };

  return (
    <div className="driver-subpage-container">
      {/* 1. Resumen de Calificaciones (Editorial Hero Split) */}
      <section className="ratings-summary-section margin-bottom-48">
        <div className="ratings-editorial-top flex-between align-center flex-wrap gap-48">
          {/* Left Column: Big Clean Score */}
          <div className="ratings-hero-col flex-column gap-12">
            <span className="section-eyebrow text-electric-violet">Resumen de Calificaciones</span>
            <div className="flex-center margin-top-12" style={{ gap: '72px' }}>
              <div className="score-hero-display text-electric-violet">
                {ratingAverage?.toFixed(1) || '4.8'}
              </div>
              <div className="flex-column gap-12">
                <div className="flex-center gap-8">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.round(ratingAverage || 5) ? 'text-electric-violet' : 'text-dim'}
                      fill={i < Math.round(ratingAverage || 5) ? '#7C4DFF' : 'none'}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted margin-bottom-8">
                  <strong className="text-main">{totalRatings || 103}</strong> opiniones verificadas · <strong className="text-main">42</strong> viajes
                </span>
                <span className="text-sm text-neon-green font-medium flex-center gap-8">
                  <ThumbsUp size={16} /> 98% de pasajeros recomiendan el servicio
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Percentage Tracks */}
          <div className="ratings-bars-col flex-column gap-12">
            <div className="editorial-bar-row flex-center gap-16 text-sm">
              <span className="bar-label text-muted">5 estrellas</span>
              <div className="bar-track">
                <div className="bar-fill fill-neon-green" style={{ width: `${getPercent(fiveStars || 87)}%` }} />
              </div>
              <span className="bar-count text-muted font-medium">{fiveStars || 87}</span>
            </div>

            <div className="editorial-bar-row flex-center gap-16 text-sm">
              <span className="bar-label text-muted">4 estrellas</span>
              <div className="bar-track">
                <div className="bar-fill fill-electric-violet" style={{ width: `${getPercent(fourStars || 12)}%` }} />
              </div>
              <span className="bar-count text-muted font-medium">{fourStars || 12}</span>
            </div>

            <div className="editorial-bar-row flex-center gap-16 text-sm">
              <span className="bar-label text-muted">3 estrellas</span>
              <div className="bar-track">
                <div className="bar-fill fill-dim" style={{ width: `${getPercent(threeStars || 3)}%` }} />
              </div>
              <span className="bar-count text-muted font-medium">{threeStars || 3}</span>
            </div>

            <div className="editorial-bar-row flex-center gap-16 text-sm">
              <span className="bar-label text-muted">2 estrellas</span>
              <div className="bar-track">
                <div className="bar-fill fill-dim" style={{ width: `${getPercent(twoStars || 1)}%` }} />
              </div>
              <span className="bar-count text-muted font-medium">{twoStars || 1}</span>
            </div>

            <div className="editorial-bar-row flex-center gap-16 text-sm">
              <span className="bar-label text-muted">1 estrella</span>
              <div className="bar-track">
                <div className="bar-fill fill-dim" style={{ width: `${getPercent(oneStar || 0)}%` }} />
              </div>
              <span className="bar-count text-muted font-medium">{oneStar || 0}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="hairline-divider margin-bottom-48" />

      {/* 2. Opiniones Detalladas (Flujo Editorial Espacioso) */}
      <section className="ratings-reviews-section flex-column gap-28">
        <div style={{ paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="section-eyebrow text-muted block">
            Opiniones Recientes ({recentRatings?.length || 0})
          </span>
        </div>

        <div className="reviews-fluid-list flex-column gap-0">
          {recentRatings?.map((review) => (
            <div key={review.id} className="review-fluid-item flex-column gap-20">
              <div className="flex-between align-center flex-wrap gap-20">
                <div className="flex-center gap-16">
                  <div className="review-avatar-circle">
                    {review.passengerName[0]}
                  </div>
                  <div className="flex-column gap-8">
                    <strong className="review-passenger-name">{review.passengerName}</strong>
                    <span className="review-verified-tag text-xs text-neon-green flex-center gap-6 margin-top-4">
                      <CheckCircle2 size={12} /> Pasajero Verificado
                    </span>
                  </div>
                </div>

                <div className="flex-center gap-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className={i < review.score ? 'text-electric-violet' : 'text-dim'}
                      fill={i < review.score ? '#7C4DFF' : 'none'}
                    />
                  ))}
                </div>
              </div>

              <blockquote className="review-quote-paragraph" style={{ marginTop: '20px' }}>
                "{review.comment}"
              </blockquote>

              {review.tags && review.tags.length > 0 && (
                <div className="review-tags-row" style={{ marginTop: '24px' }}>
                  {review.tags.map((tag, idx) => (
                    <span key={idx} className="tag-inline-chip text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
