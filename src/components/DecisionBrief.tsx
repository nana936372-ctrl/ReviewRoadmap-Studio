import { Download, FileText } from 'lucide-react';
import type { AnalysisResult, EvaluationDimension } from '../domain/types';
import type { AppCopy } from '../i18n/copy';

interface DecisionBriefProps {
  analysis: AnalysisResult;
  copy: AppCopy['brief'];
}

function briefEvaluationDimensions(card: AnalysisResult['roadmapCards'][number]): EvaluationDimension[] {
  return [
    ...card.scoreDimensions.slice(0, 3),
    ...card.recommendationDimensions,
    ...card.metricDimensions,
    ...card.experimentDimensions,
    ...card.riskDimensions
  ];
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
  const selectedDimensions = briefEvaluationDimensions(selectedCard);
  const evidenceQuotes = selectedCard.evidenceQuotes.slice(0, 2);

  function downloadBrief() {
    const dimensionMarkdown = selectedDimensions
      .map((dimension) => `- ${dimension.label}: ${dimension.value}. ${dimension.rationale}`)
      .join('\n');
    const evidenceMarkdown =
      evidenceQuotes.map((quote) => `- ${quote}`).join('\n') || `- ${copy.noEvidence}`;
    const nextStepsMarkdown = copy.nextStepItems.map((item) => `- ${item}`).join('\n');
    const markdown = [
      `# ${copy.markdownTitle}`,
      `## ${copy.context}\n${copy.contextBody}`,
      `## ${copy.problemSignal}\n${selectedCluster.description}`,
      `## ${copy.userScenario}\n${selectedCard.userScenario}`,
      `## ${copy.recommendedDecision}\n${selectedCard.recommendation}`,
      `## ${copy.whyNow}\n${copy.whyNowBody}`,
      `## ${copy.successMetric}\n${selectedCard.targetMetric}`,
      `## ${copy.nextExperiment}\n${selectedCard.validationExperiment}`,
      `## ${copy.riskAndTradeoff}\n${selectedCard.risks}`,
      `## ${copy.evidence}\n${evidenceMarkdown}`,
      `## ${copy.evaluationDimensions}\n${dimensionMarkdown}`,
      `## ${copy.nextSteps}\n${nextStepsMarkdown}`
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

      <div className="brief-summary">
        <article>
          <h3>{copy.context}</h3>
          <p>{copy.contextBody}</p>
        </article>
        <article>
          <h3>{copy.whyNow}</h3>
          <p>{copy.whyNowBody}</p>
        </article>
      </div>

      <div className="brief-grid">
        <article className="brief-wide">
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
          <h3>{copy.successMetric}</h3>
          <p>{selectedCard.targetMetric}</p>
        </article>
        <article>
          <h3>{copy.nextExperiment}</h3>
          <p>{selectedCard.validationExperiment}</p>
        </article>
        <article>
          <h3>{copy.riskAndTradeoff}</h3>
          <p>{selectedCard.risks}</p>
        </article>
        <article className="brief-wide">
          <h3>{copy.evidence}</h3>
          <ul className="brief-quote-list">
            {evidenceQuotes.length > 0 ? (
              evidenceQuotes.map((quote) => <li key={quote}>{quote}</li>)
            ) : (
              <li>{copy.noEvidence}</li>
            )}
          </ul>
        </article>
        <article>
          <h3>{copy.evaluationDimensions}</h3>
          <ul className="brief-dimensions">
            {selectedDimensions.map((dimension) => (
              <li key={`${dimension.id}-${dimension.label}`}>
                <strong>{dimension.label}</strong>
                <span>{dimension.value}</span>
              </li>
            ))}
          </ul>
        </article>
        <article>
          <h3>{copy.nextSteps}</h3>
          <ul className="brief-dimensions">
            {copy.nextStepItems.map((item) => (
              <li key={item}>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
