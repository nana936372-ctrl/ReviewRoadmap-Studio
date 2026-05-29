import { Download, FileText } from 'lucide-react';
import type { AnalysisResult } from '../domain/types';
import type { AppCopy } from '../i18n/copy';

interface DecisionBriefProps {
  analysis: AnalysisResult;
  copy: AppCopy['brief'];
}

export function DecisionBrief({ analysis, copy }: DecisionBriefProps) {
  const topCard = analysis.roadmapCards[0];
  const topCluster = topCard
    ? analysis.clusters.find((cluster) =>
        topCard.evidenceQuotes.some((quote) => cluster.representativeQuotes.includes(quote))
      )
    : undefined;

  if (!topCard || !topCluster) {
    return (
      <section className="brief-panel" aria-labelledby="brief-title">
        <div className="brief-header">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 id="brief-title">{copy.title}</h2>
          </div>
          <FileText aria-hidden="true" size={24} />
        </div>
        <p className="brief-empty">{copy.empty}</p>
      </section>
    );
  }

  const selectedCard = topCard;
  const selectedCluster = topCluster;

  function downloadBrief() {
    const markdown = [
      `# ${copy.markdownTitle}`,
      `## ${copy.problemSignal}\n${selectedCluster.description}`,
      `## ${copy.recommendedDecision}\n${selectedCard.recommendation}`,
      `## ${copy.userScenario}\n${selectedCard.userScenario}`,
      `## ${copy.evidence}\n${selectedCard.evidenceQuotes[0] ?? copy.noEvidence}`,
      `## ${copy.nextExperiment}\n${selectedCard.validationExperiment}`
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
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="brief-title">{copy.title}</h2>
        </div>
        <div className="brief-actions">
          <button className="brief-download" type="button" onClick={downloadBrief}>
            <Download aria-hidden="true" size={16} />
            {copy.download}
          </button>
          <FileText aria-hidden="true" size={24} />
        </div>
      </div>

      <div className="brief-grid">
        <article>
          <h3>{copy.problemSignal}</h3>
          <p>{selectedCluster.description}</p>
        </article>
        <article>
          <h3>{copy.recommendedDecision}</h3>
          <p>{selectedCard.recommendation}</p>
        </article>
        <article>
          <h3>{copy.userScenario}</h3>
          <p>{selectedCard.userScenario}</p>
        </article>
        <article>
          <h3>{copy.evidence}</h3>
          <p>{selectedCard.evidenceQuotes[0] ?? copy.noEvidence}</p>
        </article>
        <article>
          <h3>{copy.nextExperiment}</h3>
          <p>{selectedCard.validationExperiment}</p>
        </article>
      </div>
    </section>
  );
}
