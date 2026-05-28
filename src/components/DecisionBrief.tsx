import { Download, FileText } from 'lucide-react';
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

  function downloadBrief() {
    const markdown = [
      '# ReviewRoadmap Decision Brief',
      `## Problem signal\n${topCluster.description}`,
      `## Recommended decision\n${topCard.recommendation}`,
      `## User scenario\n${topCard.userScenario}`,
      `## Evidence\n${topCard.evidenceQuotes[0] ?? 'No direct evidence quote available.'}`,
      `## Next experiment\n${topCard.validationExperiment}`
    ].join('\n\n');
    const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a');

    link.href = url;
    link.download = 'reviewroadmap-decision-brief.md';
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="brief-panel" aria-labelledby="brief-title">
      <div className="brief-header">
        <div>
          <p className="eyebrow">Portfolio-ready artifact</p>
          <h2 id="brief-title">One-page product decision brief</h2>
        </div>
        <div className="brief-actions">
          <button className="brief-download" type="button" onClick={downloadBrief}>
            <Download aria-hidden="true" size={16} />
            Download brief
          </button>
          <FileText aria-hidden="true" size={24} />
        </div>
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
          <h3>User scenario</h3>
          <p>{topCard.userScenario}</p>
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
