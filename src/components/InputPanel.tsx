import { CalendarDays, FileUp, Search, Sparkles, Tags } from 'lucide-react';

interface InputPanelProps {
  appUrl: string;
  onAppUrlChange: (value: string) => void;
  onAnalyze: () => void;
}

export function InputPanel({ appUrl, onAppUrlChange, onAnalyze }: InputPanelProps) {
  return (
    <section className="input-panel" aria-labelledby="input-title">
      <div>
        <p className="eyebrow">Demo data source</p>
        <h2 id="input-title">Analyze an App Store review sample</h2>
        <p className="section-copy">
          This prototype uses a prepared review sample for a fictional AI writing app, shaped like public App Store feedback.
        </p>
      </div>

      <label className="field-label" htmlFor="app-url">
        App Store URL
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

      <div className="input-grid" aria-label="Review analysis settings">
        <div>
          <label className="field-label compact" htmlFor="review-category">
            Category
          </label>
          <div className="control-row">
            <Tags aria-hidden="true" size={18} />
            <select id="review-category" defaultValue="ai-writing">
              <option value="ai-writing">AI writing app</option>
              <option value="productivity">Productivity app</option>
              <option value="learning">Language learning app</option>
              <option value="knowledge">Knowledge management app</option>
            </select>
          </div>
        </div>

        <div>
          <label className="field-label compact" htmlFor="time-window">
            Time window
          </label>
          <div className="control-row">
            <CalendarDays aria-hidden="true" size={18} />
            <select id="time-window" defaultValue="may-2026">
              <option value="may-2026">May 2026 sample</option>
              <option value="last-30">Last 30 days</option>
              <option value="last-90">Last 90 days</option>
            </select>
          </div>
        </div>

        <div>
          <label className="field-label compact" htmlFor="review-sample">
            Review sample
          </label>
          <div className="control-row">
            <FileUp aria-hidden="true" size={18} />
            <input id="review-sample" type="file" accept=".csv,.json,.txt" aria-describedby="review-sample-note" />
          </div>
          <p id="review-sample-note" className="field-note">
            Optional upload control; this demo uses prepared sample data.
          </p>
        </div>
      </div>

      <div className="input-actions">
        <button className="primary-button" type="button" onClick={onAnalyze}>
          <Sparkles aria-hidden="true" size={18} />
          Analyze Reviews
        </button>
        <span>18 review-shaped records - AI writing category - May 2026 sample</span>
      </div>
    </section>
  );
}
