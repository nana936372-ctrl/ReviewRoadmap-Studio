import { FileText } from 'lucide-react';
import type { AnalysisResult } from '../domain/types';

interface DecisionBriefProps {
  analysis: AnalysisResult;
}

export function DecisionBrief({ analysis }: DecisionBriefProps) {
  const topCard = analysis.roadmapCards[0];
  const topCluster = analysis.clusters[0];

  if (!topCard || !topCluster) {
    return (
      <section className="brief-panel" aria-labelledby="brief-title">
        <div className="brief-header">
          <div>
            <p className="eyebrow">Portfolio-ready artifact</p>
            <h2 id="brief-title">One-page product decision brief</h2>
          </div>
          <FileText aria-hidden="true" size={24} />
        </div>
        <p className="brief-empty">No decision brief yet. Add reviews to generate a portfolio-ready recommendation.</p>
      </section>
    );
  }

  return (
    <section className="brief-panel" aria-labelledby="brief-title">
      <div className="brief-header">
        <div>
          <p className="eyebrow">Portfolio-ready artifact</p>
          <h2 id="brief-title">One-page product decision brief</h2>
        </div>
        <FileText aria-hidden="true" size={24} />
      </div>

      <div className="brief-grid">
        <article>
          <h3>Problem signal</h3>
          <p>{topCluster.description}</p>
        </article>
        <article>
          <h3>Recommended decision</h3>
          <p>{topCard.recommendation}</p>
        </article>
        <article>
          <h3>Evidence</h3>
          <p>{topCard.evidenceQuotes[0] ?? 'No direct evidence quote available.'}</p>
        </article>
        <article>
          <h3>Next experiment</h3>
          <p>{topCard.validationExperiment}</p>
        </article>
      </div>
    </section>
  );
}
