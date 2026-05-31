import { BarChart3, Quote } from 'lucide-react';
import type { AnalysisResult, SignalLabel } from '../domain/types';
import type { AppCopy } from '../i18n/copy';

interface InsightDashboardProps {
  analysis: AnalysisResult;
  copy: AppCopy['dashboard'];
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
  const evidenceRows = analysis.signals.slice(0, 4).map((signal) => ({
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
        <div className="signal-board" aria-label={copy.signalMapLabel}>
          {topClusters.map((cluster) => {
            const sentiment = sentimentRows.find((row) => row.id === cluster.id);
            const totalSignals =
              (sentiment?.negative ?? 0) + (sentiment?.mixed ?? 0) + (sentiment?.positive ?? 0) || 1;

            return (
              <article className="signal-card" key={cluster.id}>
                <div className="signal-card-header">
                  <h3>{cluster.name}</h3>
                  <span>{copy.reviews(cluster.reviewCount)}</span>
                </div>
                <p>{cluster.description}</p>
                <div className="signal-card-meta">
                  <span>{copy.confidence(Math.round(cluster.confidence * 100))}</span>
                  <span>{copy.rating(cluster.averageRating.toFixed(1))}</span>
                </div>
                <div className="sentiment-meter" aria-label={`${copy.sentimentBalanceLabel}: ${cluster.name}`}>
                  <span
                    className="sentiment-negative"
                    style={{ width: `${((sentiment?.negative ?? 0) / totalSignals) * 100}%` }}
                    title={`${copy.table.negative}: ${sentiment?.negative ?? 0}`}
                  />
                  <span
                    className="sentiment-mixed"
                    style={{ width: `${((sentiment?.mixed ?? 0) / totalSignals) * 100}%` }}
                    title={`${copy.table.mixed}: ${sentiment?.mixed ?? 0}`}
                  />
                  <span
                    className="sentiment-positive"
                    style={{ width: `${((sentiment?.positive ?? 0) / totalSignals) * 100}%` }}
                    title={`${copy.table.positive}: ${sentiment?.positive ?? 0}`}
                  />
                </div>
              </article>
            );
          })}
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
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
