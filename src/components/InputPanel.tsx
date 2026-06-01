import { CalendarDays, FileUp, Search, Sparkles, Tags } from 'lucide-react';
import type { TimeWindow } from '../domain/types';
import type { AppCopy } from '../i18n/copy';

interface InputPanelStatus {
  tone: 'neutral' | 'success' | 'warning' | 'error';
  title: string;
  detail: string;
}

interface InputPanelProps {
  appUrl: string;
  copy: AppCopy['input'];
  isAnalyzing: boolean;
  onAppUrlChange: (value: string) => void;
  onAnalyze: () => void | Promise<void>;
  onTimeWindowChange: (value: TimeWindow) => void;
  status: InputPanelStatus;
  timeWindow: TimeWindow;
  timeWindowLabel: string;
}

export function InputPanel({
  appUrl,
  copy,
  isAnalyzing,
  onAppUrlChange,
  onAnalyze,
  onTimeWindowChange,
  status,
  timeWindow
}: InputPanelProps) {
  return (
    <section className="input-panel compact-input" aria-labelledby="input-title">
      <div className="input-panel-header">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="input-title">{copy.title}</h2>
          <p className="section-copy">{copy.description}</p>
        </div>
        <button className="primary-button" type="button" disabled={isAnalyzing} onClick={() => void onAnalyze()}>
          <Sparkles aria-hidden="true" size={18} />
          {isAnalyzing ? copy.analyzing : copy.analyze}
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
            <select
              id="time-window"
              value={timeWindow}
              onChange={(event) => onTimeWindowChange(event.target.value as TimeWindow)}
            >
              <option value="may-2026">{copy.timeWindowOptions['may-2026']}</option>
              <option value="last-30">{copy.timeWindowOptions['last-30']}</option>
              <option value="last-90">{copy.timeWindowOptions['last-90']}</option>
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

      <div className={`setup-status ${status.tone}`} role="status" aria-live="polite">
        <span>{status.title}</span>
        <span>{status.detail}</span>
      </div>
    </section>
  );
}
