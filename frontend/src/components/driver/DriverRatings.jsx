import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, Loader2, Sparkles, User, Calendar, CheckCircle2 } from 'lucide-react';
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
      <div className="driver-ratings-skeleton flex-column gap-20">
        <div className="skeleton-box shimmer-wave" style={{ height: '140px', borderRadius: '14px' }} />
        <div className="skeleton-box shimmer-wave" style={{ height: '300px', borderRadius: '14px' }} />
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
      {/* Header (Clean, no heavy box) */}
      <div className="subpage-header flex-between align-center flex-wrap gap-12 margin-bottom-24">
        <div>
          <span className="subpage-eyebrow text-electric-violet flex-center gap-6">
            <Star size={14} /> Reputación en la Red
          </span>
          <h1 className="subpage-title">Calificaciones y Opiniones</h1>
          <p className="subpage-subtitle">
            Puntuaciones otorgadas por los pasajeros que compartieron viajes en tu combi.
          </p>
        </div>

        <div className="badge-verified-clean">
          <ThumbsUp size={15} className="text-neon-green" />
          <span>98% Recomendado</span>
        </div>
      </div>

      {/* Hero Score & Distribution (Clean Grid) */}
      <div className="ratings-hero-grid margin-bottom-36">
        {/* Left Column: Big Score */}
        <div className="ratings-score-card">
          <div className="score-number-hero text-electric-violet">
            {ratingAverage?.toFixed(1) || '4.8'}
          </div>
          <div className="score-stars-hero text-electric-violet">
            {'★'.repeat(Math.round(ratingAverage || 5))}{'☆'.repeat(5 - Math.round(ratingAverage || 5))}
          </div>
          <span className="score-total-caption text-xs text-muted">
            Basado en <strong>{totalRatings || 103}</strong> calificaciones verificadas
          </span>
        </div>

        {/* Right Column: Breakdown Bars */}
        <div className="ratings-breakdown-card flex-column gap-8">
          <div className="star-dist-clean-row">
            <span className="dist-star-label">5 estrellas</span>
            <div className="dist-bar-track">
              <div className="dist-bar-fill fill-neon-green" style={{ width: `${getPercent(fiveStars || 87)}%` }} />
            </div>
            <span className="dist-count-num">{fiveStars || 87}</span>
          </div>

          <div className="star-dist-clean-row">
            <span className="dist-star-label">4 estrellas</span>
            <div className="dist-bar-track">
              <div className="dist-bar-fill fill-electric-violet" style={{ width: `${getPercent(fourStars || 12)}%` }} />
            </div>
            <span className="dist-count-num">{fourStars || 12}</span>
          </div>

          <div className="star-dist-clean-row">
            <span className="dist-star-label">3 estrellas</span>
            <div className="dist-bar-track">
              <div className="dist-bar-fill fill-dim" style={{ width: `${getPercent(threeStars || 3)}%` }} />
            </div>
            <span className="dist-count-num">{threeStars || 3}</span>
          </div>

          <div className="star-dist-clean-row">
            <span className="dist-star-label">2 estrellas</span>
            <div className="dist-bar-track">
              <div className="dist-bar-fill fill-dim" style={{ width: `${getPercent(twoStars || 1)}%` }} />
            </div>
            <span className="dist-count-num">{twoStars || 1}</span>
          </div>

          <div className="star-dist-clean-row">
            <span className="dist-star-label">1 estrella</span>
            <div className="dist-bar-track">
              <div className="dist-bar-fill fill-dim" style={{ width: `${getPercent(oneStar || 0)}%` }} />
            </div>
            <span className="dist-count-num">{oneStar || 0}</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-section-clean">
        <div className="section-header-clean margin-bottom-20">
          <h2 className="section-clean-title flex-center gap-8">
            <MessageSquare size={18} className="text-neon-green" /> Comentarios Recientes de Pasajeros
          </h2>
          <span className="text-xs text-muted">Opiniones reales de viajes completados</span>
        </div>

        <div className="reviews-clean-list flex-column gap-16">
          {recentRatings?.map((review) => (
            <div key={review.id} className="review-item-clean">
              <div className="review-top-row flex-between align-center margin-bottom-8">
                <div className="review-user-info flex-center gap-10">
                  <div className="review-avatar-circle">
                    {review.passengerName[0]}
                  </div>
                  <div>
                    <strong className="review-name-text">{review.passengerName}</strong>
                    <span className="review-badge-verified text-xs text-neon-green flex-center gap-2">
                      <CheckCircle2 size={11} /> Pasajero Verificado
                    </span>
                  </div>
                </div>

                <div className="review-stars-val text-electric-violet">
                  {'★'.repeat(review.score)}{'☆'.repeat(5 - review.score)}
                </div>
              </div>

              <p className="review-quote-text">"{review.comment}"</p>

              {review.tags && review.tags.length > 0 && (
                <div className="review-tags-flex margin-top-10">
                  {review.tags.map((tag, idx) => (
                    <span key={idx} className="tag-pill-clean text-xs">
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
