import { useEffect, useMemo, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { AiWorkflow } from './components/AiWorkflow';
import { CalculationGuidePage } from './components/CalculationGuidePage';
import { DecisionBrief } from './components/DecisionBrief';
import { InsightDashboard } from './components/InsightDashboard';
import { InputPanel } from './components/InputPanel';
import { ReviewListPage } from './components/ReviewListPage';
import { RoadmapCards } from './components/RoadmapCards';
import { ScoreDetailPage } from './components/ScoreDetailPage';
import { sampleReviews } from './data/sampleReviews';
import type { Language, RawReview, TimeWindow } from './domain/types';
import { appCopy, languageOptions } from './i18n/copy';
import { analyzeReviews } from './lib/analysis/pipeline';
import { fetchAppStoreReviews, filterReviewsByTimeWindow } from './lib/appStoreReviews';
import { fetchSemanticAnalysis } from './lib/semanticAnalysisClient';

const DEMO_APP_URL = 'https://apps.apple.com/app/draftly-ai-writing/id0000000000';
const DEMO_GENERATED_AT = '2026-05-28T08:00:00.000Z';

type AnalysisSourceStatus =
  | { kind: 'sample' }
  | { kind: 'loading' }
  | {
      kind: 'live';
      fetchedCount: number;
      fetchedPageCount: number;
      filteredCount: number;
      maxPages: number;
      sourceKind: 'app-store-page' | 'apple-rss';
      timeWindow: TimeWindow;
    }
  | {
      kind: 'empty';
      fetchedCount: number;
      fetchedPageCount: number;
      maxPages: number;
      sourceKind: 'app-store-page' | 'apple-rss';
      timeWindow: TimeWindow;
    }
  | { kind: 'error'; message: string };

function isDemoUrl(appUrl: string): boolean {
  return appUrl.trim() === DEMO_APP_URL || /id0{6,}/.test(appUrl);
}

export default function App() {
  const [appUrl, setAppUrl] = useState(DEMO_APP_URL);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('all');
  const [rawReviews, setRawReviews] = useState<RawReview[]>(sampleReviews);
  const [fetchedReviews, setFetchedReviews] = useState<RawReview[]>(sampleReviews);
  const [generatedAt, setGeneratedAt] = useState(DEMO_GENERATED_AT);
  const [sourceStatus, setSourceStatus] = useState<AnalysisSourceStatus>({ kind: 'sample' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [semanticAnalysis, setSemanticAnalysis] = useState<ReturnType<typeof analyzeReviews> | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [selectedRoadmapCardId, setSelectedRoadmapCardId] = useState<string | null>(null);
  const [showCalculationGuide, setShowCalculationGuide] = useState(false);
  const [showReviewList, setShowReviewList] = useState(false);
  const copy = appCopy[language];
  const fallbackAnalysis = useMemo(
    () => analyzeReviews(rawReviews, generatedAt, language),
    [generatedAt, language, rawReviews]
  );
  const analysis = semanticAnalysis ?? fallbackAnalysis;
  const timeWindowLabel = copy.input.timeWindowOptions[timeWindow];
  const inputStatus = useMemo(() => {
    if (sourceStatus.kind === 'loading') {
      return {
        tone: 'neutral' as const,
        title: copy.input.status.loadingTitle,
        detail: copy.input.status.loadingDetail
      };
    }

    if (sourceStatus.kind === 'live') {
      return {
        tone: 'success' as const,
        title: copy.input.status.liveTitle,
        detail: copy.input.status.liveDetail({
          fetchedCount: sourceStatus.fetchedCount,
          filteredCount: sourceStatus.filteredCount,
          sourceName:
            sourceStatus.sourceKind === 'app-store-page'
              ? copy.input.status.sources.appStorePage
              : copy.input.status.sources.appleRss({
                  fetchedPageCount: sourceStatus.fetchedPageCount,
                  maxPages: sourceStatus.maxPages
                }),
          timeWindow: copy.input.timeWindowOptions[sourceStatus.timeWindow]
        })
      };
    }

    if (sourceStatus.kind === 'empty') {
      return {
        tone: 'warning' as const,
        title: copy.input.status.emptyTitle,
        detail: copy.input.status.emptyDetail({
          fetchedCount: sourceStatus.fetchedCount,
          sourceName:
            sourceStatus.sourceKind === 'app-store-page'
              ? copy.input.status.sources.appStorePage
              : copy.input.status.sources.appleRss({
                  fetchedPageCount: sourceStatus.fetchedPageCount,
                  maxPages: sourceStatus.maxPages
                }),
          timeWindow: copy.input.timeWindowOptions[sourceStatus.timeWindow]
        })
      };
    }

    if (sourceStatus.kind === 'error') {
      return {
        tone: 'error' as const,
        title: copy.input.status.errorTitle,
        detail: sourceStatus.message
      };
    }

    return {
      tone: 'neutral' as const,
      title: copy.input.status.sampleTitle,
      detail: copy.input.summary
    };
  }, [copy.input, sourceStatus]);
  const selectedRoadmapCard = selectedRoadmapCardId
    ? analysis.roadmapCards.find((card) => card.id === selectedRoadmapCardId)
    : undefined;
  const topRoadmapCard = analysis.roadmapCards[0];

  async function handleAnalyze() {
    setSelectedRoadmapCardId(null);
    setShowCalculationGuide(false);
    setShowReviewList(false);
    setSemanticAnalysis(null);

    if (isDemoUrl(appUrl)) {
      setRawReviews(sampleReviews);
      setFetchedReviews(sampleReviews);
      setGeneratedAt(DEMO_GENERATED_AT);
      setSourceStatus({ kind: 'sample' });
      return;
    }

    setIsAnalyzing(true);
    setSourceStatus({ kind: 'loading' });

    try {
      const result = await fetchAppStoreReviews(appUrl, timeWindow);
      setFetchedReviews(result.fetchedReviews);
      const nextGeneratedAt = new Date().toISOString();
      const hasRealReviews = result.reviews.length > 0;

      setRawReviews(hasRealReviews ? result.reviews : sampleReviews);
      setGeneratedAt(hasRealReviews ? nextGeneratedAt : DEMO_GENERATED_AT);
      setSourceStatus(
        hasRealReviews
          ? {
              kind: 'live',
              fetchedCount: result.fetchedReviews.length,
              fetchedPageCount: result.fetchedPageCount,
              filteredCount: result.reviews.length,
              maxPages: result.maxPages,
              sourceKind: result.sourceKind,
              timeWindow
            }
          : {
              kind: 'empty',
              fetchedCount: result.fetchedReviews.length,
              fetchedPageCount: result.fetchedPageCount,
              maxPages: result.maxPages,
              sourceKind: result.sourceKind,
              timeWindow
            }
      );

      if (hasRealReviews) {
        try {
          const nextSemanticAnalysis = await fetchSemanticAnalysis(result.reviews, language, nextGeneratedAt);
          setSemanticAnalysis(nextSemanticAnalysis);
        } catch {
          setSemanticAnalysis(null);
        }
      }
    } catch (error) {
      setSourceStatus({
        kind: 'error',
        message: error instanceof Error ? error.message : copy.input.status.unknownError
      });
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleTimeWindowChange(nextTimeWindow: TimeWindow) {
    setTimeWindow(nextTimeWindow);
    setSemanticAnalysis(null);

    if (sourceStatus.kind !== 'live' && sourceStatus.kind !== 'empty') {
      return;
    }

    const filteredReviews = filterReviewsByTimeWindow(fetchedReviews, nextTimeWindow);

    setSelectedRoadmapCardId(null);
    setShowCalculationGuide(false);
    setShowReviewList(false);
    const hasRealReviews = filteredReviews.length > 0;
    const nextGeneratedAt = new Date().toISOString();

    setRawReviews(hasRealReviews ? filteredReviews : sampleReviews);
    setGeneratedAt(hasRealReviews ? nextGeneratedAt : DEMO_GENERATED_AT);
    setSourceStatus(
      hasRealReviews
        ? {
            kind: 'live',
            fetchedCount: fetchedReviews.length,
            fetchedPageCount: sourceStatus.fetchedPageCount,
            filteredCount: filteredReviews.length,
            maxPages: sourceStatus.maxPages,
            sourceKind: sourceStatus.sourceKind,
            timeWindow: nextTimeWindow
          }
        : {
            kind: 'empty',
            fetchedCount: fetchedReviews.length,
            fetchedPageCount: sourceStatus.fetchedPageCount,
            maxPages: sourceStatus.maxPages,
            sourceKind: sourceStatus.sourceKind,
            timeWindow: nextTimeWindow
          }
    );

    if (hasRealReviews) {
      setIsAnalyzing(true);

      try {
        const nextSemanticAnalysis = await fetchSemanticAnalysis(filteredReviews, language, nextGeneratedAt);
        setSemanticAnalysis(nextSemanticAnalysis);
      } catch {
        setSemanticAnalysis(null);
      } finally {
        setIsAnalyzing(false);
      }
    }
  }

  useEffect(() => {
    setSemanticAnalysis(null);
  }, [language]);

  useEffect(() => {
    if (!selectedRoadmapCardId) {
      return;
    }

    window.setTimeout(() => {
      document.getElementById('score-detail-page')?.scrollIntoView?.({ block: 'start', behavior: 'smooth' });
    }, 0);
  }, [selectedRoadmapCardId]);

  useEffect(() => {
    if (!showCalculationGuide) {
      return;
    }

    window.setTimeout(() => {
      document.getElementById('calculation-guide-page')?.scrollIntoView?.({ block: 'start', behavior: 'smooth' });
    }, 0);
  }, [showCalculationGuide]);

  return (
    <main className="app-shell" lang={language}>
      <section className="hero-band">
        <button
          aria-label={copy.methodology.open}
          className="hero-help-button"
          title={copy.methodology.open}
          type="button"
          onClick={() => {
            setSelectedRoadmapCardId(null);
            setShowReviewList(false);
            setShowCalculationGuide(true);
          }}
        >
          <HelpCircle aria-hidden="true" size={22} />
        </button>
        <div>
          <p className="eyebrow">{copy.hero.eyebrow}</p>
          <h1>ReviewRoadmap Studio</h1>
          <p className="hero-copy">{copy.hero.body}</p>
          {topRoadmapCard && (
            <aside className="hero-decision" aria-label={copy.hero.topDecisionLabel}>
              <span>{copy.hero.topDecisionLabel}</span>
              <strong>{topRoadmapCard.title}</strong>
              <p>{topRoadmapCard.recommendation}</p>
              <span className="hero-score-value">{topRoadmapCard.priorityScore}</span>
            </aside>
          )}
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
          <button
            className="review-list-button"
            type="button"
            onClick={() => {
              setSelectedRoadmapCardId(null);
              setShowCalculationGuide(false);
              setShowReviewList(true);
            }}
          >
            {copy.reviewsPage.open}
          </button>
        </div>
      </section>

      {showCalculationGuide ? (
        <CalculationGuidePage
          analysis={analysis}
          copy={copy.methodology}
          onBack={() => setShowCalculationGuide(false)}
        />
      ) : selectedRoadmapCard ? (
        <ScoreDetailPage
          card={selectedRoadmapCard}
          copy={copy.scoreDetail}
          roadmapCopy={copy.roadmap}
          onBack={() => setSelectedRoadmapCardId(null)}
        />
      ) : showReviewList ? (
        <ReviewListPage
          analyzedCount={analysis.reviews.length}
          copy={copy.reviewsPage}
          onBack={() => setShowReviewList(false)}
          reviews={fetchedReviews}
        />
      ) : (
        <>
          <InputPanel
            appUrl={appUrl}
            copy={copy.input}
            isAnalyzing={isAnalyzing}
            onAppUrlChange={setAppUrl}
            onAnalyze={handleAnalyze}
            onTimeWindowChange={handleTimeWindowChange}
            status={inputStatus}
            timeWindow={timeWindow}
            timeWindowLabel={timeWindowLabel}
          />
          <InsightDashboard analysis={analysis} copy={copy.dashboard} />
          <RoadmapCards
            cards={analysis.roadmapCards}
            copy={copy.roadmap}
            onScoreSelect={(cardId) => {
              setShowCalculationGuide(false);
              setShowReviewList(false);
              setSelectedRoadmapCardId(cardId);
            }}
          />
          <AiWorkflow copy={copy.workflow} language={language} />
          <DecisionBrief analysis={analysis} copy={copy.brief} />
        </>
      )}
    </main>
  );
}
