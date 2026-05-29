import { ArrowLeft, Activity } from 'lucide-react';
import type { EvaluationDimension, RoadmapCard } from '../domain/types';
import type { AppCopy } from '../i18n/copy';

interface ScoreDetailPageProps {
  card: RoadmapCard;
  copy: AppCopy['scoreDetail'];
  roadmapCopy: AppCopy['roadmap'];
  onBack: () => void;
}

function DimensionList({
  dimensions,
  copy
}: {
  dimensions: EvaluationDimension[];
  copy: AppCopy['scoreDetail'];
}) {
  return (
    <ul className="dimension-list detail-dimension-list">
      {dimensions.map((dimension) => (
        <li key={`${dimension.id}-${dimension.label}`} title={dimension.rationale}>
          <div className="dimension-row">
            <strong>{dimension.label}</strong>
            <span>{dimension.value}</span>
          </div>
          {typeof dimension.weight === 'number' && <em>{copy.dimensionWeight(dimension.weight)}</em>}
          <p>{dimension.rationale}</p>
        </li>
      ))}
    </ul>
  );
}

function DetailSection({
  title,
  dimensions,
  copy
}: {
  title: string;
  dimensions: EvaluationDimension[];
  copy: AppCopy['scoreDetail'];
}) {
  return (
    <article className="detail-section">
      <h3>{title}</h3>
      <DimensionList dimensions={dimensions} copy={copy} />
    </article>
  );
}

export function ScoreDetailPage({ card, copy, roadmapCopy, onBack }: ScoreDetailPageProps) {
  return (
    <section className="score-detail-page" aria-labelledby="score-detail-title">
      <button className="detail-back" type="button" onClick={onBack}>
        <ArrowLeft aria-hidden="true" size={16} />
        {copy.back}
      </button>

      <div className="detail-hero">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="score-detail-title">{copy.title}</h2>
          <p>{card.title}</p>
        </div>
        <div className="detail-score" aria-label={copy.scoreLabel(card.priorityScore)}>
          <span>{roadmapCopy.typeLabels[card.type]}</span>
          <strong>{card.priorityScore}</strong>
        </div>
      </div>

      <article className="detail-section detail-formula">
        <h3>{copy.formula}</h3>
        <p>{card.scoreFormula}</p>
      </article>

      <div className="detail-grid">
        <DetailSection title={copy.scoreDimensions} dimensions={card.scoreDimensions} copy={copy} />
        <DetailSection title={copy.recommendationDimensions} dimensions={card.recommendationDimensions} copy={copy} />
        <DetailSection title={copy.metricDimensions} dimensions={card.metricDimensions} copy={copy} />
        <DetailSection title={copy.experimentDimensions} dimensions={card.experimentDimensions} copy={copy} />
        <DetailSection title={copy.riskDimensions} dimensions={card.riskDimensions} copy={copy} />
        <article className="detail-section">
          <h3>
            <Activity aria-hidden="true" size={16} />
            {copy.evidence}
          </h3>
          <div className="evidence-list compact">
            {card.evidenceQuotes.slice(0, 3).map((quote) => (
              <blockquote key={quote}>{quote}</blockquote>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
