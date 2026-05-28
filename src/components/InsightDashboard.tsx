import { BarChart3, Quote } from 'lucide-react';
import type { AnalysisResult, SignalLabel } from '../domain/types';

interface InsightDashboardProps {
  analysis: AnalysisResult;
}

export function InsightDashboard({ analysis }: InsightDashboardProps) {
  const topClusters = analysis.clusters.slice(0, 6);
  const hasReviews = analysis.reviews.length > 0;
  const hasClusters = topClusters.length > 0;
  const averageRating = hasReviews
    ? analysis.reviews.reduce((sum, review) => sum + review.rating, 0) / analysis.reviews.length
    : null;
  const reviewsById = new Map(analysis.reviews.map((review) => [review.id, review]));
  const sentimentRows = topClusters.map((cluster) => {
    const relatedSignals = analysis.signals.filter((signal) => signal.labels.includes(cluster.id as SignalLabel));

    return {
      id: cluster.id,
      name: cluster.name,
      negative: relatedSignals.filter((signal) => signal.sentiment === 'negative').length,
      mixed: relatedSignals.filter((signal) => signal.sentiment === 'mixed').length,
      positive: relatedSignals.filter((signal) => signal.sentiment === 'positive').length
    };
  });
  const evidenceRows = analysis.signals.slice(0, 6).map((signal) => ({
    signal,
    review: reviewsById.get(signal.reviewId)
  }));

  return (
    <section className="panel" aria-labelledby="intelligence-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Evidence synthesis</p>
          <h2 id="intelligence-title">Review intelligence</h2>
          <p className="section-copy">
            A structured readout of recurring user signals before the product makes roadmap recommendations.
          </p>
        </div>
        <div className="metric-pill">
          <BarChart3 aria-hidden="true" size={18} />
          {averageRating === null ? 'No rating yet' : `${averageRating.toFixed(1)} avg rating`}
        </div>
      </div>

      {!hasReviews && <p className="section-copy">No review evidence available yet.</p>}

      {hasClusters && (
        <div className="cluster-grid">
          {topClusters.map((cluster) => (
            <article className="cluster-card" key={cluster.id}>
              <div className="cluster-card-header">
                <h3>{cluster.name}</h3>
                <span>{cluster.reviewCount} reviews</span>
              </div>
              <p>{cluster.description}</p>
              <div className="cluster-meta">
                <span>{Math.round(cluster.confidence * 100)}% confidence</span>
                <span>{cluster.averageRating.toFixed(1)} rating</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {hasClusters && (
        <div className="insight-table-wrap" aria-label="Sentiment by theme">
          <table className="insight-table">
            <thead>
              <tr>
                <th>Theme</th>
                <th>Negative</th>
                <th>Mixed</th>
                <th>Positive</th>
              </tr>
            </thead>
            <tbody>
              {sentimentRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.negative}</td>
                  <td>{row.mixed}</td>
                  <td>{row.positive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hasReviews && (
        <div className="evidence-strip" aria-label="Representative review evidence">
          {evidenceRows.map(({ signal, review }) => review && (
            <figure key={signal.reviewId}>
              <Quote aria-hidden="true" size={16} />
              <blockquote>
                {review.title}: {review.body}
              </blockquote>
              <figcaption>
                {review.rating} stars - {signal.labels.join(', ')} - v{review.appVersion}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
