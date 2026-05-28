import { Search, Sparkles } from 'lucide-react';

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
