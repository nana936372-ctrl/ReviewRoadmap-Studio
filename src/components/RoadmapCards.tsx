import { Activity, FlaskConical, Gauge, ShieldCheck } from 'lucide-react';
import type { RoadmapCard } from '../domain/types';

interface RoadmapCardsProps {
  cards: RoadmapCard[];
}

const TYPE_LABELS: Record<RoadmapCard['type'], string> = {
  fix: 'Fix',
  improve: 'Improve',
  explore: 'Explore'
};

const FACTOR_LABELS: Record<keyof RoadmapCard['scoringFactors'], string> = {
  frequency: 'Frequency',
  severity: 'Severity',
  businessImpact: 'Business impact',
  confidence: 'Confidence',
  effort: 'Effort'
};

export function RoadmapCards({ cards }: RoadmapCardsProps) {
  return (
    <section className="panel" aria-labelledby="roadmap-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Decision output</p>
          <h2 id="roadmap-title">Roadmap decisions</h2>
          <p className="section-copy">
            Each recommendation preserves evidence, scoring logic, and the next validation step.
          </p>
        </div>
      </div>

      {cards.length === 0 ? (
        <p className="section-copy">No roadmap decisions yet. Add review evidence to generate recommendations.</p>
      ) : (
        <div className="roadmap-grid">
          {cards.map((card) => (
            <article className={`roadmap-card roadmap-card-${card.type}`} key={card.id}>
              <div className="card-kicker">
                <span>{TYPE_LABELS[card.type]}</span>
                <strong>{card.priorityScore}</strong>
              </div>
              <h3>{card.title}</h3>
              <p>{card.recommendation}</p>
              <div className="card-context">
                <span>{Math.round(card.confidence * 100)}% confidence</span>
                <span>{card.userScenario}</span>
              </div>

              <div className="score-breakdown" aria-label={`${TYPE_LABELS[card.type]} scoring factors`}>
                {Object.entries(card.scoringFactors).map(([key, value]) => (
                  <span key={key}>
                    {FACTOR_LABELS[key as keyof RoadmapCard['scoringFactors']]} <strong>{value}/5</strong>
                  </span>
                ))}
              </div>

              <dl className="decision-list">
                <div>
                  <dt>
                    <Gauge aria-hidden="true" size={15} /> Metric
                  </dt>
                  <dd>{card.targetMetric}</dd>
                </div>
                <div>
                  <dt>
                    <FlaskConical aria-hidden="true" size={15} /> Validation experiment
                  </dt>
                  <dd>{card.validationExperiment}</dd>
                </div>
                <div>
                  <dt>
                    <ShieldCheck aria-hidden="true" size={15} /> Risk
                  </dt>
                  <dd>{card.risks}</dd>
                </div>
              </dl>

              <div className="evidence-list">
                <div className="evidence-title">
                  <Activity aria-hidden="true" size={15} />
                  Evidence
                </div>
                {card.evidenceQuotes.slice(0, 2).map((quote) => (
                  <blockquote key={quote}>{quote}</blockquote>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
