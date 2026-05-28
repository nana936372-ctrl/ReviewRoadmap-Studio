import { Boxes } from 'lucide-react';
import { aiWorkflowStages } from '../lib/analysis/promptSpec';

export function AiWorkflow() {
  return (
    <section className="panel" aria-labelledby="workflow-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">AI workflow</p>
          <h2 id="workflow-title">Explainable analysis chain</h2>
          <p className="section-copy">
            The demo separates classification, clustering, scoring, and recommendation so the AI does not feel like a
            black box.
          </p>
        </div>
        <div className="metric-pill">
          <Boxes aria-hidden="true" size={18} />
          {aiWorkflowStages.length} stages
        </div>
      </div>

      <ol className="workflow-list">
        {aiWorkflowStages.map((stage) => (
          <li key={stage.name}>
            <strong>{stage.name}</strong>
            <span>{stage.description}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
