import { BarChart3, Quote } from 'lucide-react';
import type { AnalysisResult, Sentiment, SignalLabel } from '../domain/types';
import type { AppCopy } from '../i18n/copy';
import {
  CONFIDENCE_BASE_FACTORS,
  CONFIDENCE_BASE_PERCENT,
  CONFIDENCE_CAP_PERCENT,
  CONFIDENCE_PER_REVIEW_PERCENT
} from '../lib/analysis/scoring';

interface InsightDashboardProps {
  analysis: AnalysisResult;
  copy: AppCopy['dashboard'];
}

function formatCalculationNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function InsightDashboard({ analysis, copy }: InsightDashboardProps) {
  const topClusters = analysis.clusters.slice(0, 6);
  const hasReviews = analysis.reviews.length > 0;
  const hasClusters = topClusters.length > 0;
  const ratingTotal = analysis.reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = hasReviews
    ? ratingTotal / analysis.reviews.length
    : null;
  const averageRatingLabel = averageRating === null ? copy.noRating : copy.averageRating(averageRating.toFixed(1));
  const averageRatingCalculation =
    averageRating === null
      ? null
      : copy.averageRatingCalculation({
          ratingTotal: formatCalculationNumber(ratingTotal),
          reviewCount: analysis.reviews.length,
          result: averageRating.toFixed(1)
        });
  const reviewsById = new Map(analysis.reviews.map((review) => [review.id, review]));
  const sentimentRows = topClusters.map((cluster) => {
    const clusterReviewIds = new Set(cluster.reviewIds ?? []);
    const relatedSignals =
      clusterReviewIds.size > 0
        ? analysis.signals.filter((signal) => clusterReviewIds.has(signal.reviewId))
        : analysis.signals.filter((signal) => signal.labels.includes(cluster.id as SignalLabel));

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
        <div
          aria-label={
            averageRatingCalculation ? `${averageRatingLabel}. ${averageRatingCalculation}` : averageRatingLabel
          }
          className={`metric-pill${averageRatingCalculation ? ' explainable-pill' : ''}`}
          data-tooltip={averageRatingCalculation ?? undefined}
          tabIndex={averageRatingCalculation ? 0 : undefined}
          title={averageRatingCalculation ?? undefined}
        >
          <BarChart3 aria-hidden="true" size={18} />
          {averageRatingLabel}
        </div>
      </div>

      {!hasReviews && <p className="section-copy">{copy.noEvidence}</p>}

      {hasClusters && (
        <div className="signal-board" aria-label={copy.signalMapLabel}>
          {topClusters.map((cluster) => {
            const sentiment = sentimentRows.find((row) => row.id === cluster.id);
            const totalSignals =
              (sentiment?.negative ?? 0) + (sentiment?.mixed ?? 0) + (sentiment?.positive ?? 0) || 1;
            const sentimentSegments: {
              sentiment: Sentiment;
              count: number;
              className: string;
            }[] = [
              { sentiment: 'negative', count: sentiment?.negative ?? 0, className: 'sentiment-negative' },
              { sentiment: 'mixed', count: sentiment?.mixed ?? 0, className: 'sentiment-mixed' },
              { sentiment: 'positive', count: sentiment?.positive ?? 0, className: 'sentiment-positive' }
            ];

            return (
              <article className="signal-card" key={cluster.id}>
                <div className="signal-card-header">
                  <h3>{cluster.name}</h3>
                  <span>{copy.reviews(cluster.reviewCount)}</span>
                </div>
                <p>{cluster.description}</p>
                <div className="signal-card-meta">
                  {(() => {
                    const confidencePercent = Math.round(cluster.confidence * 100);
                    const confidenceCalculation = copy.confidenceCalculation({
                      baseFactors: CONFIDENCE_BASE_FACTORS,
                      basePercent: CONFIDENCE_BASE_PERCENT,
                      capPercent: CONFIDENCE_CAP_PERCENT,
                      perReviewPercent: CONFIDENCE_PER_REVIEW_PERCENT,
                      resultPercent: confidencePercent,
                      reviewCount: cluster.reviewCount
                    });
                    const confidenceLabel = copy.confidence(confidencePercent);

                    return (
                      <span
                        aria-label={`${confidenceLabel}. ${confidenceCalculation}`}
                        className="explainable-pill"
                        data-tooltip={confidenceCalculation}
                        tabIndex={0}
                        title={confidenceCalculation}
                      >
                        {confidenceLabel}
                      </span>
                    );
                  })()}
                  {(() => {
                    const clusterRating = cluster.averageRating.toFixed(1);
                    const clusterRatingTotal = cluster.averageRating * cluster.reviewCount;
                    const ratingCalculation = copy.ratingCalculation({
                      ratingTotal: formatCalculationNumber(clusterRatingTotal),
                      reviewCount: cluster.reviewCount,
                      result: clusterRating
                    });
                    const ratingLabel = copy.rating(clusterRating);

                    return (
                      <span
                        aria-label={`${ratingLabel}. ${ratingCalculation}`}
                        className="explainable-pill"
                        data-tooltip={ratingCalculation}
                        tabIndex={0}
                        title={ratingCalculation}
                      >
                        {ratingLabel}
                      </span>
                    );
                  })()}
                </div>
                <div className="sentiment-meter" aria-label={`${copy.sentimentBalanceLabel}: ${cluster.name}`}>
                  {sentimentSegments
                    .filter((segment) => segment.count > 0)
                    .map((segment) => {
                      const label = `${copy.sentimentValues[segment.sentiment]}: ${segment.count}. ${
                        copy.sentimentMeanings[segment.sentiment]
                      }`;

                      return (
                        <span
                          aria-label={label}
                          className={`sentiment-segment ${segment.className}`}
                          data-tooltip={label}
                          key={segment.sentiment}
                          style={{ width: `${(segment.count / totalSignals) * 100}%` }}
                          tabIndex={0}
                          title={label}
                        />
                      );
                    })}
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
