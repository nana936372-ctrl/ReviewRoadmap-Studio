import { Activity, FlaskConical, Gauge, ShieldCheck } from 'lucide-react';
import type { RoadmapCard } from '../domain/types';
import type { AppCopy } from '../i18n/copy';
import {
  CONFIDENCE_BASE_FACTORS,
  CONFIDENCE_BASE_PERCENT,
  CONFIDENCE_CAP_PERCENT,
  CONFIDENCE_PER_REVIEW_PERCENT
} from '../lib/analysis/scoring';

interface RoadmapCardsProps {
  cards: RoadmapCard[];
  copy: AppCopy['roadmap'];
  onScoreSelect: (cardId: string) => void;
}

export function RoadmapCards({ cards, copy, onScoreSelect }: RoadmapCardsProps) {
  return (
    <section className="panel" aria-labelledby="roadmap-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="roadmap-title">{copy.title}</h2>
          <p className="section-copy">{copy.description}</p>
        </div>
      </div>

      {cards.length === 0 ? (
        <p className="section-copy">{copy.empty}</p>
      ) : (
        <div className="roadmap-grid">
          {cards.map((card) => {
            const confidencePercent = Math.round(card.confidence * 100);
            const confidenceLabel = copy.confidence(confidencePercent);
            const confidenceCalculation = copy.confidenceCalculation({
              baseFactors: CONFIDENCE_BASE_FACTORS,
              basePercent: CONFIDENCE_BASE_PERCENT,
              capPercent: CONFIDENCE_CAP_PERCENT,
              perReviewPercent: CONFIDENCE_PER_REVIEW_PERCENT,
              resultPercent: confidencePercent,
              reviewCount: card.supportingReviewCount
            });

            return (
              <article className={`roadmap-card roadmap-card-${card.type}`} key={card.id}>
                <div className="card-kicker">
                  <span>{copy.typeLabels[card.type]}</span>
                  <button
                    aria-label={`${copy.explainPriorityScore}: ${card.priorityScore}`}
                    className="score-button"
                    title={copy.explainPriorityScore}
                    type="button"
                    onClick={() => onScoreSelect(card.id)}
                  >
                    {card.priorityScore}
                  </button>
                </div>
                <h3>{card.title}</h3>
                <p>{card.recommendation}</p>
                <div className="card-context">
                  <span
                    aria-label={`${confidenceLabel}. ${confidenceCalculation}`}
                    className="explainable-pill"
                    data-tooltip={confidenceCalculation}
                    tabIndex={0}
                    title={confidenceCalculation}
                  >
                    {confidenceLabel}
                  </span>
                  <span>{card.userScenario}</span>
                </div>

                <div className="decision-card-notes">
                  <h4>{copy.decisionNotes}</h4>
                  <dl className="decision-list compact">
                    <div>
                      <dt>
                        <Gauge aria-hidden="true" size={15} /> {copy.metric}
                      </dt>
                      <dd>
                        <span>{card.targetMetric}</span>
                      </dd>
                    </div>
                    <div>
                      <dt>
                        <FlaskConical aria-hidden="true" size={15} /> {copy.validationExperiment}
                      </dt>
                      <dd>
                        <span>{card.validationExperiment}</span>
                      </dd>
                    </div>
                    <div>
                      <dt>
                        <ShieldCheck aria-hidden="true" size={15} /> {copy.risk}
                      </dt>
                      <dd>
                        <span>{card.risks}</span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="evidence-list compact-evidence">
                  <div className="evidence-title">
                    <Activity aria-hidden="true" size={15} />
                    {copy.evidence}
                  </div>
                  {card.evidenceQuotes.slice(0, 1).map((quote) => (
                    <blockquote key={quote}>{quote}</blockquote>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
