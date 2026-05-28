import { BarChart3, Quote } from 'lucide-react';
import type { AnalysisResult } from '../domain/types';

interface InsightDashboardProps {
  analysis: AnalysisResult;
}

export function InsightDashboard({ analysis }: InsightDashboardProps) {
  const topClusters = analysis.clusters.slice(0, 6);
  const averageRating =
    analysis.reviews.reduce((sum, review) => sum + review.rating, 0) / analysis.reviews.length;

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
          {averageRating.toFixed(1)} avg rating
        </div>
      </div>

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

      <div className="evidence-strip" aria-label="Representative review evidence">
        {analysis.reviews.slice(1, 5).map((review) => (
          <figure key={review.id}>
            <Quote aria-hidden="true" size={16} />
            <blockquote>
              {review.title}: {review.body}
            </blockquote>
            <figcaption>
              {review.rating} stars - v{review.appVersion}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
