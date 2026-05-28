import { useMemo, useState } from 'react';
import { InputPanel } from './components/InputPanel';
import { sampleReviews } from './data/sampleReviews';
import { analyzeReviews } from './lib/analysis/pipeline';

const DEMO_APP_URL = 'https://apps.apple.com/app/draftly-ai-writing/id0000000000';

export default function App() {
  const [appUrl, setAppUrl] = useState(DEMO_APP_URL);
  const [analysisRunCount, setAnalysisRunCount] = useState(1);
  const analysis = useMemo(
    () => analyzeReviews(sampleReviews, '2026-05-28T08:00:00.000Z'),
    [analysisRunCount]
  );

  return (
    <main className="app-shell">
      <section className="hero-band">
        <div>
          <p className="eyebrow">AI product decision assistant</p>
          <h1>ReviewRoadmap Studio</h1>
          <p className="hero-copy">
            Turn messy App Store reviews into insight clusters, evidence quotes, and roadmap <span>decisions</span>.
          </p>
        </div>
        <div className="hero-stats" aria-label="Demo summary">
          <span>{analysis.reviews.length} reviews analyzed</span>
          <span>{analysis.clusters.length} insight clusters</span>
          <span>{analysis.roadmapCards.length} roadmap cards</span>
        </div>
      </section>

      <InputPanel
        appUrl={appUrl}
        onAppUrlChange={setAppUrl}
        onAnalyze={() => setAnalysisRunCount((count) => count + 1)}
      />

      <section className="panel">
        <p className="eyebrow">Output preview</p>
        <h2>Roadmap decisions</h2>
        <p className="section-copy">
          The next tasks replace this preview with the dashboard, roadmap cards, and decision brief.
        </p>
      </section>
    </main>
  );
}
