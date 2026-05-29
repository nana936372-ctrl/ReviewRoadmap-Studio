import { useState } from 'react';
import { Activity, FlaskConical, Gauge, ShieldCheck } from 'lucide-react';
import type { EvaluationDimension, RoadmapCard } from '../domain/types';
import type { AppCopy } from '../i18n/copy';

interface RoadmapCardsProps {
  cards: RoadmapCard[];
  copy: AppCopy['roadmap'];
}

function DimensionList({
  dimensions,
  copy
}: {
  dimensions: EvaluationDimension[];
  copy: AppCopy['roadmap'];
}) {
  return (
    <ul className="dimension-list">
      {dimensions.map((dimension) => (
        <li key={dimension.id} title={dimension.rationale}>
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

export function RoadmapCards({ cards, copy }: RoadmapCardsProps) {
  const [collapsedScoreIds, setCollapsedScoreIds] = useState<Set<string>>(new Set());

  function toggleScoreDetails(cardId: string) {
    setCollapsedScoreIds((current) => {
      const next = new Set(current);

      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }

      return next;
    });
  }

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
            const scoreDetailsId = `${card.id}-score-details`;
            const scoreDetailsOpen = !collapsedScoreIds.has(card.id);

            return (
              <article className={`roadmap-card roadmap-card-${card.type}`} key={card.id}>
                <div className="card-kicker">
                  <span>{copy.typeLabels[card.type]}</span>
                  <button
                    aria-controls={scoreDetailsId}
                    aria-expanded={scoreDetailsOpen}
                    aria-label={`${copy.explainPriorityScore}: ${card.priorityScore}`}
                    className="score-button"
                    title={copy.explainPriorityScore}
                    type="button"
                    onClick={() => toggleScoreDetails(card.id)}
                  >
                    {card.priorityScore}
                  </button>
                </div>
                <h3>{card.title}</h3>
                <p>{card.recommendation}</p>
                <details className="inline-evaluation" open>
                  <summary>{copy.recommendationDimensions}</summary>
                  <DimensionList dimensions={card.recommendationDimensions} copy={copy} />
                </details>
                <div className="card-context">
                  <span>{copy.confidence(Math.round(card.confidence * 100))}</span>
                  <span>{card.userScenario}</span>
                </div>

                <div className="score-breakdown" aria-label={copy.scoringFactors(copy.typeLabels[card.type])}>
                  {Object.entries(card.scoringFactors).map(([key, value]) => (
                    <span key={key}>
                      {copy.factorLabels[key as keyof RoadmapCard['scoringFactors']]} <strong>{value}/5</strong>
                    </span>
                  ))}
                </div>

                {scoreDetailsOpen && (
                  <div className="evaluation-panel" id={scoreDetailsId}>
                    <h4>{copy.priorityFormula}</h4>
                    <p>{card.scoreFormula}</p>
                    <DimensionList dimensions={card.scoreDimensions} copy={copy} />
                  </div>
                )}

                <dl className="decision-list">
                  <div>
                    <dt>
                      <Gauge aria-hidden="true" size={15} /> {copy.metric}
                    </dt>
                    <dd>
                      <span>{card.targetMetric}</span>
                      <details className="inline-evaluation compact" open>
                        <summary>{copy.metricDimensions}</summary>
                        <DimensionList dimensions={card.metricDimensions} copy={copy} />
                      </details>
                    </dd>
                  </div>
                  <div>
                    <dt>
                      <FlaskConical aria-hidden="true" size={15} /> {copy.validationExperiment}
                    </dt>
                    <dd>
                      <span>{card.validationExperiment}</span>
                      <details className="inline-evaluation compact" open>
                        <summary>{copy.experimentDimensions}</summary>
                        <DimensionList dimensions={card.experimentDimensions} copy={copy} />
                      </details>
                    </dd>
                  </div>
                  <div>
                    <dt>
                      <ShieldCheck aria-hidden="true" size={15} /> {copy.risk}
                    </dt>
                    <dd>
                      <span>{card.risks}</span>
                      <details className="inline-evaluation compact" open>
                        <summary>{copy.riskDimensions}</summary>
                        <DimensionList dimensions={card.riskDimensions} copy={copy} />
                      </details>
                    </dd>
                  </div>
                </dl>

                <div className="evidence-list">
                  <div className="evidence-title">
                    <Activity aria-hidden="true" size={15} />
                    {copy.evidence}
                  </div>
                  {card.evidenceQuotes.slice(0, 2).map((quote) => (
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
