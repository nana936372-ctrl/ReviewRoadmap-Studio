import { Activity, FlaskConical, Gauge, ShieldCheck } from 'lucide-react';
import type { RoadmapCard } from '../domain/types';
import type { AppCopy } from '../i18n/copy';

interface RoadmapCardsProps {
  cards: RoadmapCard[];
  copy: AppCopy['roadmap'];
}

export function RoadmapCards({ cards, copy }: RoadmapCardsProps) {
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
          {cards.map((card) => (
            <article className={`roadmap-card roadmap-card-${card.type}`} key={card.id}>
              <div className="card-kicker">
                <span>{copy.typeLabels[card.type]}</span>
                <strong>{card.priorityScore}</strong>
              </div>
              <h3>{card.title}</h3>
              <p>{card.recommendation}</p>
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

              <dl className="decision-list">
                <div>
                  <dt>
                    <Gauge aria-hidden="true" size={15} /> {copy.metric}
                  </dt>
                  <dd>{card.targetMetric}</dd>
                </div>
                <div>
                  <dt>
                    <FlaskConical aria-hidden="true" size={15} /> {copy.validationExperiment}
                  </dt>
                  <dd>{card.validationExperiment}</dd>
                </div>
                <div>
                  <dt>
                    <ShieldCheck aria-hidden="true" size={15} /> {copy.risk}
                  </dt>
                  <dd>{card.risks}</dd>
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
          ))}
        </div>
      )}
    </section>
  );
}
