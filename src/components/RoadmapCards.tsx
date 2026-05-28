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
