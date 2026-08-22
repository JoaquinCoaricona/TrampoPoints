import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, Loader2, Sparkles, User, Calendar } from 'lucide-react';
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
      <div className="card glass-card padding-32 text-center flex-center">
        <Loader2 className="spinner" size={24} />
        <span>Cargando calificaciones y reputación...</span>
      </div>
    );
  }

  const { ratingAverage, totalRatings, fiveStars, fourStars, threeStars, twoStars, oneStar, recentRatings } = ratingsData || {};

  const getPercent = (count) => {
    if (!totalRatings || totalRatings === 0) return 0;
    return Math.round((count / totalRatings) * 100);
  };

  return (
    <div className="driver-ratings-view">
      <div className="card glass-card">
        <div className="card-header flex-between margin-bottom-24">
          <div>
            <h2 className="title-with-icon">
              <Star className="accent-icon text-amber" size={22} /> Mis Calificaciones y Reputación
            </h2>
            <p className="card-subtitle">
              Resumen de valoraciones otorgadas por los pasajeros que compartieron viajes en tu combi.
            </p>
          </div>

          <div className="rating-badge-highlight">
            <ThumbsUp size={16} className="text-emerald" />
            <span>98% Recomendado</span>
          </div>
        </div>

        {/* Big Score Breakdown Box */}
        <div className="ratings-overview-box margin-bottom-32">
          <div className="score-summary-column">
            <span className="big-rating-number">{ratingAverage?.toFixed(1) || '4.8'}</span>
            <div className="big-stars-row text-amber">
              {'★'.repeat(Math.round(ratingAverage || 5))}{'☆'.repeat(5 - Math.round(ratingAverage || 5))}
            </div>
            <span className="text-xs text-muted margin-top-4">Basado en {totalRatings || 103} valoraciones</span>
          </div>

          {/* Star Distribution Bars */}
          <div className="stars-distribution-bars">
            {/* 5 Stars */}
            <div className="star-dist-row">
              <span className="star-dist-label">★★★★★ (5)</span>
              <div className="star-bar-bg">
                <div className="star-bar-fill bg-emerald" style={{ width: `${getPercent(fiveStars || 87)}%` }}></div>
              </div>
              <span className="star-dist-count">{fiveStars || 87}</span>
            </div>

            {/* 4 Stars */}
            <div className="star-dist-row">
              <span className="star-dist-label">★★★★☆ (4)</span>
              <div className="star-bar-bg">
                <div className="star-bar-fill bg-indigo" style={{ width: `${getPercent(fourStars || 12)}%` }}></div>
              </div>
              <span className="star-dist-count">{fourStars || 12}</span>
            </div>

            {/* 3 Stars */}
            <div className="star-dist-row">
              <span className="star-dist-label">★★★☆☆ (3)</span>
              <div className="star-bar-bg">
                <div className="star-bar-fill bg-amber" style={{ width: `${getPercent(threeStars || 3)}%` }}></div>
              </div>
              <span className="star-dist-count">{threeStars || 3}</span>
            </div>

            {/* 2 Stars */}
            <div className="star-dist-row">
              <span className="star-dist-label">★★☆☆☆ (2)</span>
              <div className="star-bar-bg">
                <div className="star-bar-fill bg-amber" style={{ width: `${getPercent(twoStars || 1)}%` }}></div>
              </div>
              <span className="star-dist-count">{twoStars || 1}</span>
            </div>

            {/* 1 Star */}
            <div className="star-dist-row">
              <span className="star-dist-label">★☆☆☆☆ (1)</span>
              <div className="star-bar-bg">
                <div className="star-bar-fill bg-rose" style={{ width: `${getPercent(oneStar || 0)}%` }}></div>
              </div>
              <span className="star-dist-count">{oneStar || 0}</span>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="reviews-section">
          <h3 className="section-title margin-bottom-16">
            <MessageSquare size={18} className="text-indigo" /> Opiniones y Comentarios Recientes
          </h3>

          <div className="reviews-list-grid">
            {recentRatings?.map((review) => (
              <div key={review.id} className="review-card card glass-card">
                <div className="flex-between margin-bottom-8">
                  <div className="review-author-box flex-center gap-8">
                    <div className="review-author-avatar">
                      {review.passengerName[0]}
                    </div>
                    <div>
                      <strong className="review-author-name">{review.passengerName}</strong>
                      <span className="review-date block text-xs text-muted">
                        Pasajero Verificado
                      </span>
                    </div>
                  </div>

                  <div className="review-stars-score text-amber">
                    {'★'.repeat(review.score)}{'☆'.repeat(5 - review.score)}
                  </div>
                </div>

                <p className="review-comment-text">"{review.comment}"</p>

                {review.tags && review.tags.length > 0 && (
                  <div className="review-tags-row margin-top-12">
                    {review.tags.map((tag, idx) => (
                      <span key={idx} className="badge badge-subtle text-xs">
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
    </div>
  );
}
