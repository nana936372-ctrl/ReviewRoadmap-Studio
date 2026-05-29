import { BarChart3, Quote } from 'lucide-react';
import type { AnalysisResult, ReviewSignal, SignalLabel } from '../domain/types';
import type { AppCopy } from '../i18n/copy';

interface InsightDashboardProps {
  analysis: AnalysisResult;
  copy: AppCopy['dashboard'];
}

function reviewDimensions(signal: ReviewSignal, review: AnalysisResult['reviews'][number], copy: AppCopy['dashboard']) {
  return [
    {
      label: copy.reviewDimensionLabels.starRating,
      value: copy.stars(review.rating)
    },
    {
      label: copy.reviewDimensionLabels.productSignals,
      value: signal.labels.map((label) => copy.signalLabels[label]).join(', ')
    },
    {
      label: copy.reviewDimensionLabels.sentiment,
      value: copy.sentimentValues[signal.sentiment]
    },
    {
      label: copy.reviewDimensionLabels.urgency,
      value: copy.urgencyValues[signal.urgency]
    },
    {
      label: copy.reviewDimensionLabels.evidenceUse,
      value: copy.evidenceUseValue
    }
  ];
}

export function InsightDashboard({ analysis, copy }: InsightDashboardProps) {
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
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="intelligence-title">{copy.title}</h2>
          <p className="section-copy">{copy.description}</p>
        </div>
        <div className="metric-pill">
          <BarChart3 aria-hidden="true" size={18} />
          {averageRating === null ? copy.noRating : copy.averageRating(averageRating.toFixed(1))}
        </div>
      </div>

      {!hasReviews && <p className="section-copy">{copy.noEvidence}</p>}

      {hasClusters && (
        <div className="cluster-grid">
          {topClusters.map((cluster) => (
            <article className="cluster-card" key={cluster.id}>
              <div className="cluster-card-header">
                <h3>{cluster.name}</h3>
                <span>{copy.reviews(cluster.reviewCount)}</span>
              </div>
              <p>{cluster.description}</p>
              <div className="cluster-meta">
                <span>{copy.confidence(Math.round(cluster.confidence * 100))}</span>
                <span>{copy.rating(cluster.averageRating.toFixed(1))}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {hasClusters && (
        <div className="insight-table-wrap" aria-label={copy.sentimentLabel}>
          <table className="insight-table">
            <thead>
              <tr>
                <th>{copy.table.theme}</th>
                <th>{copy.table.negative}</th>
                <th>{copy.table.mixed}</th>
                <th>{copy.table.positive}</th>
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
        <div className="evidence-strip" aria-label={copy.evidenceLabel}>
          {evidenceRows.map(({ signal, review }) => review && (
            <figure key={signal.reviewId}>
              <Quote aria-hidden="true" size={16} />
              <blockquote>
                {review.title}: {review.body}
              </blockquote>
              <figcaption>
                {copy.stars(review.rating)} - {signal.labels.map((label) => copy.signalLabels[label]).join(', ')} - v
                {review.appVersion}
              </figcaption>
              <details className="review-evaluation" open>
                <summary>{copy.reviewEvaluationTitle}</summary>
                <p>{copy.reviewEvaluationHint}</p>
                <dl>
                  {reviewDimensions(signal, review, copy).map((dimension) => (
                    <div key={dimension.label}>
                      <dt>{dimension.label}</dt>
                      <dd>{dimension.value}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
