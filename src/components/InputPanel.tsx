import { CalendarDays, FileUp, Search, Sparkles, Tags } from 'lucide-react';
import type { AppCopy } from '../i18n/copy';

interface InputPanelProps {
  appUrl: string;
  copy: AppCopy['input'];
  onAppUrlChange: (value: string) => void;
  onAnalyze: () => void;
}

export function InputPanel({ appUrl, copy, onAppUrlChange, onAnalyze }: InputPanelProps) {
  return (
    <section className="input-panel compact-input" aria-labelledby="input-title">
      <div className="input-panel-header">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="input-title">{copy.title}</h2>
          <p className="section-copy">{copy.description}</p>
        </div>
        <button className="primary-button" type="button" onClick={onAnalyze}>
          <Sparkles aria-hidden="true" size={18} />
          {copy.analyze}
        </button>
      </div>

      <div className="setup-bar" aria-label={copy.settingsLabel}>
        <div className="setup-url">
          <label className="field-label compact" htmlFor="app-url">
            {copy.appStoreUrl}
          </label>
          <div className="url-row">
            <Search aria-hidden="true" size={18} />
            <input
              id="app-url"
              type="url"
              inputMode="url"
              value={appUrl}
              onChange={(event) => onAppUrlChange(event.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="field-label compact" htmlFor="review-category">
            {copy.category}
          </label>
          <div className="control-row">
            <Tags aria-hidden="true" size={18} />
            <select id="review-category" defaultValue="ai-writing">
              <option value="ai-writing">{copy.categoryOptions.aiWriting}</option>
              <option value="productivity">{copy.categoryOptions.productivity}</option>
              <option value="learning">{copy.categoryOptions.learning}</option>
              <option value="knowledge">{copy.categoryOptions.knowledge}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="field-label compact" htmlFor="time-window">
            {copy.timeWindow}
          </label>
          <div className="control-row">
            <CalendarDays aria-hidden="true" size={18} />
            <select id="time-window" defaultValue="may-2026">
              <option value="may-2026">{copy.timeWindowOptions.may2026}</option>
              <option value="last-30">{copy.timeWindowOptions.last30}</option>
              <option value="last-90">{copy.timeWindowOptions.last90}</option>
            </select>
          </div>
        </div>
      </div>

      <details className="sample-details">
        <summary>{copy.advancedSettings}</summary>
        <div>
          <label className="field-label compact" htmlFor="review-sample">
            {copy.reviewSample}
          </label>
          <div className="control-row">
            <FileUp aria-hidden="true" size={18} />
            <input id="review-sample" type="file" accept=".csv,.json,.txt" aria-describedby="review-sample-note" />
          </div>
          <p id="review-sample-note" className="field-note">
            {copy.reviewSampleNote}
          </p>
        </div>
      </details>

      <p className="setup-summary">{copy.summary}</p>
    </section>
  );
}
