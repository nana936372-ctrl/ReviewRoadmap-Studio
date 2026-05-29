import { useMemo, useState } from 'react';
import { AiWorkflow } from './components/AiWorkflow';
import { DecisionBrief } from './components/DecisionBrief';
import { InsightDashboard } from './components/InsightDashboard';
import { InputPanel } from './components/InputPanel';
import { RoadmapCards } from './components/RoadmapCards';
import { ScoreDetailPage } from './components/ScoreDetailPage';
import { sampleReviews } from './data/sampleReviews';
import type { Language } from './domain/types';
import { appCopy, languageOptions } from './i18n/copy';
import { analyzeReviews } from './lib/analysis/pipeline';

const DEMO_APP_URL = 'https://apps.apple.com/app/draftly-ai-writing/id0000000000';

export default function App() {
  const [appUrl, setAppUrl] = useState(DEMO_APP_URL);
  const [analysisRunCount, setAnalysisRunCount] = useState(1);
  const [language, setLanguage] = useState<Language>('en');
  const [selectedRoadmapCardId, setSelectedRoadmapCardId] = useState<string | null>(null);
  const copy = appCopy[language];
  const analysis = useMemo(
    () => analyzeReviews(sampleReviews, '2026-05-28T08:00:00.000Z', language),
    [analysisRunCount, language]
  );
  const selectedRoadmapCard = selectedRoadmapCardId
    ? analysis.roadmapCards.find((card) => card.id === selectedRoadmapCardId)
    : undefined;

  return (
    <main className="app-shell">
      <section className="hero-band">
        <div>
          <p className="eyebrow">{copy.hero.eyebrow}</p>
          <h1>ReviewRoadmap Studio</h1>
          <p className="hero-copy">{copy.hero.body}</p>
        </div>
        <div className="hero-side">
          <div className="language-toggle" role="group" aria-label={copy.languageLabel}>
            {languageOptions.map((option) => (
              <button
                aria-pressed={language === option.code}
                className={language === option.code ? 'active' : undefined}
                key={option.code}
                type="button"
                onClick={() => setLanguage(option.code)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="hero-stats" aria-label={copy.hero.summaryLabel}>
            <span>{copy.hero.reviewsAnalyzed(analysis.reviews.length)}</span>
            <span>{copy.hero.insightClusters(analysis.clusters.length)}</span>
            <span>{copy.hero.roadmapCards(analysis.roadmapCards.length)}</span>
          </div>
        </div>
      </section>

      {selectedRoadmapCard ? (
        <ScoreDetailPage
          card={selectedRoadmapCard}
          copy={copy.scoreDetail}
          roadmapCopy={copy.roadmap}
          onBack={() => setSelectedRoadmapCardId(null)}
        />
      ) : (
        <>
          <InputPanel
            appUrl={appUrl}
            copy={copy.input}
            onAppUrlChange={setAppUrl}
            onAnalyze={() => {
              setSelectedRoadmapCardId(null);
              setAnalysisRunCount((count) => count + 1);
            }}
          />
          <InsightDashboard analysis={analysis} copy={copy.dashboard} />
          <RoadmapCards
            cards={analysis.roadmapCards}
            copy={copy.roadmap}
            onScoreSelect={setSelectedRoadmapCardId}
          />
          <AiWorkflow copy={copy.workflow} language={language} />
          <DecisionBrief analysis={analysis} copy={copy.brief} />
        </>
      )}
    </main>
  );
}
