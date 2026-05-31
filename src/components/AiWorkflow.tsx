import { Boxes } from 'lucide-react';
import type { Language } from '../domain/types';
import type { AppCopy } from '../i18n/copy';
import { getAiWorkflowStages } from '../lib/analysis/promptSpec';

interface AiWorkflowProps {
  copy: AppCopy['workflow'];
  language: Language;
}

export function AiWorkflow({ copy, language }: AiWorkflowProps) {
  const aiWorkflowStages = getAiWorkflowStages(language);

  return (
    <section className="panel" aria-labelledby="workflow-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="workflow-title">{copy.title}</h2>
          <p className="section-copy">{copy.description}</p>
        </div>
        <div className="metric-pill">
          <Boxes aria-hidden="true" size={18} />
          {copy.stages(aiWorkflowStages.length)}
        </div>
      </div>

      <ol className="workflow-stepper">
        {aiWorkflowStages.map((stage, index) => (
          <li key={stage.name}>
            <span className="step-index">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <strong>{stage.name}</strong>
              <span>{stage.description}</span>
              <details className="workflow-evaluation">
                <summary>{copy.evaluationMethod}</summary>
                <p>{stage.evaluationMethod}</p>
                <div className="workflow-dimensions">
                  <b>{copy.dimensions}</b>
                  <ul>
                    {stage.dimensions.map((dimension) => (
                      <li key={dimension}>{dimension}</li>
                    ))}
                  </ul>
                </div>
              </details>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
