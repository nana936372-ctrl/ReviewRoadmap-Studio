import { ArrowLeft, BarChart3, FileText, Gauge, HelpCircle, Layers3, Route, Workflow } from 'lucide-react';
import type { ReactNode } from 'react';
import type { AnalysisResult, SignalLabel } from '../domain/types';
import type { AppCopy } from '../i18n/copy';
import {
  CONFIDENCE_BASE_FACTORS,
  CONFIDENCE_BASE_PERCENT,
  CONFIDENCE_CAP_PERCENT,
  CONFIDENCE_PER_REVIEW_PERCENT,
  PRIORITY_SCORE_WEIGHTS
} from '../lib/analysis/scoring';

interface CalculationGuidePageProps {
  analysis: AnalysisResult;
  copy: AppCopy['methodology'];
  onBack: () => void;
}

interface GuideSectionProps {
  body: string;
  children: ReactNode;
  icon: ReactNode;
  title: string;
}

function formatNumber(value: number, fractionDigits = 1): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(fractionDigits);
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="method-line">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function GuideSection({ body, children, icon, title }: GuideSectionProps) {
  return (
    <article className="method-card">
      <div className="method-card-heading">
        <span aria-hidden="true">{icon}</span>
        <h3>{title}</h3>
      </div>
      <p>{body}</p>
      <dl>{children}</dl>
    </article>
  );
}

function getBriefDimensionCount(analysis: AnalysisResult): number {
  const topCard = analysis.roadmapCards[0];

  if (!topCard) {
    return 0;
  }

  return (
    topCard.scoreDimensions.slice(0, 3).length +
    topCard.recommendationDimensions.length +
    topCard.metricDimensions.length +
    topCard.experimentDimensions.length +
    topCard.riskDimensions.length
  );
}

export function CalculationGuidePage({ analysis, copy, onBack }: CalculationGuidePageProps) {
  const topCluster = analysis.clusters[0];
  const topCard = analysis.roadmapCards[0];
  const ratingTotal = analysis.reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = analysis.reviews.length > 0 ? ratingTotal / analysis.reviews.length : 0;
  const clusterRatingTotal = topCluster ? topCluster.averageRating * topCluster.reviewCount : 0;
  const confidenceReviewCount = topCluster?.reviewCount ?? 0;
  const confidenceRawPercent = CONFIDENCE_BASE_PERCENT + confidenceReviewCount * CONFIDENCE_PER_REVIEW_PERCENT;
  const confidenceResultPercent = topCluster ? Math.round(topCluster.confidence * 100) : 0;
  const relatedSignals = topCluster
    ? analysis.signals.filter((signal) => signal.labels.includes(topCluster.id as SignalLabel))
    : [];
  const sentimentCounts = {
    negative: relatedSignals.filter((signal) => signal.sentiment === 'negative').length,
    mixed: relatedSignals.filter((signal) => signal.sentiment === 'mixed').length,
    positive: relatedSignals.filter((signal) => signal.sentiment === 'positive').length
  };
  const sentimentTotal = sentimentCounts.negative + sentimentCounts.mixed + sentimentCounts.positive || 1;
  const scoringFactors = topCard?.scoringFactors;
  const priorityRawScore = scoringFactors
    ? scoringFactors.frequency * PRIORITY_SCORE_WEIGHTS.frequency +
      scoringFactors.severity * PRIORITY_SCORE_WEIGHTS.severity +
      scoringFactors.businessImpact * PRIORITY_SCORE_WEIGHTS.businessImpact +
      scoringFactors.confidence * PRIORITY_SCORE_WEIGHTS.confidence +
      scoringFactors.effort * PRIORITY_SCORE_WEIGHTS.effort
    : 0;
  const detailDimensionCount = topCard
    ? topCard.scoreDimensions.length +
      topCard.recommendationDimensions.length +
      topCard.metricDimensions.length +
      topCard.experimentDimensions.length +
      topCard.riskDimensions.length
    : 0;
  const briefDimensionCount = getBriefDimensionCount(analysis);
  const workflowStageCount = 5;

  return (
    <section id="calculation-guide-page" className="methodology-page" aria-labelledby="calculation-guide-title">
      <button className="detail-back" type="button" onClick={onBack}>
        <ArrowLeft aria-hidden="true" size={16} />
        {copy.back}
      </button>

      <div className="detail-hero methodology-hero">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="calculation-guide-title">{copy.title}</h2>
          <p>{copy.description}</p>
        </div>
        <div className="methodology-mark" aria-hidden="true">
          <HelpCircle size={34} />
        </div>
      </div>

      <div className="method-summary" aria-label={copy.currentSample}>
        <span>{copy.modules.dataScope.reviews(analysis.reviews.length)}</span>
        <span>{copy.modules.dataScope.clusters(analysis.clusters.length)}</span>
        <span>{copy.modules.dataScope.roadmapCards(analysis.roadmapCards.length)}</span>
        <span>{copy.modules.dataScope.topDecision(topCard?.priorityScore ?? 0)}</span>
      </div>

      <div className="method-grid">
        <GuideSection body={copy.modules.dataScope.body} icon={<Layers3 size={18} />} title={copy.modules.dataScope.title}>
          <InfoLine label={copy.principle} value={copy.modules.dataScope.reviews(analysis.reviews.length)} />
          <InfoLine label={copy.dimensions} value={copy.modules.dataScope.clusters(analysis.clusters.length)} />
        </GuideSection>

        <GuideSection
          body={copy.modules.averageRating.body}
          icon={<BarChart3 size={18} />}
          title={copy.modules.averageRating.title}
        >
          <InfoLine
            label={copy.calculation}
            value={copy.modules.averageRating.formula({
              ratingTotal: formatNumber(ratingTotal),
              reviewCount: analysis.reviews.length,
              result: averageRating.toFixed(1)
            })}
          />
          <InfoLine label={copy.dimensions} value={copy.modules.averageRating.dimensions} />
        </GuideSection>

        <GuideSection body={copy.modules.confidence.body} icon={<Gauge size={18} />} title={copy.modules.confidence.title}>
          <InfoLine
            label={copy.calculation}
            value={copy.modules.confidence.formula({
              baseFactors: CONFIDENCE_BASE_FACTORS,
              basePercent: CONFIDENCE_BASE_PERCENT,
              capPercent: CONFIDENCE_CAP_PERCENT,
              perReviewPercent: CONFIDENCE_PER_REVIEW_PERCENT,
              rawPercent: confidenceRawPercent,
              resultPercent: confidenceResultPercent,
              reviewCount: confidenceReviewCount
            })}
          />
          <InfoLine label={copy.dimensions} value={copy.modules.confidence.dimensions} />
        </GuideSection>

        <GuideSection
          body={copy.modules.themeRating.body}
          icon={<BarChart3 size={18} />}
          title={copy.modules.themeRating.title}
        >
          <InfoLine
            label={copy.calculation}
            value={copy.modules.themeRating.formula({
              ratingTotal: formatNumber(clusterRatingTotal),
              reviewCount: topCluster?.reviewCount ?? 0,
              result: topCluster ? topCluster.averageRating.toFixed(1) : '0.0'
            })}
          />
          <InfoLine label={copy.dimensions} value={copy.modules.themeRating.dimensions} />
        </GuideSection>

        <GuideSection body={copy.modules.sentiment.body} icon={<Route size={18} />} title={copy.modules.sentiment.title}>
          <InfoLine
            label={copy.calculation}
            value={copy.modules.sentiment.formula({
              mixed: sentimentCounts.mixed,
              negative: sentimentCounts.negative,
              positive: sentimentCounts.positive,
              total: sentimentTotal
            })}
          />
          <InfoLine label={copy.dimensions} value={copy.modules.sentiment.dimensions} />
        </GuideSection>

        <GuideSection body={copy.modules.priority.body} icon={<Gauge size={18} />} title={copy.modules.priority.title}>
          <InfoLine
            label={copy.calculation}
            value={copy.modules.priority.formula({
              businessImpact: scoringFactors?.businessImpact ?? 0,
              confidence: scoringFactors?.confidence ?? 0,
              effort: scoringFactors?.effort ?? 0,
              frequency: scoringFactors?.frequency ?? 0,
              rawScore: formatNumber(priorityRawScore * 20, 1),
              result: topCard?.priorityScore ?? 0,
              severity: scoringFactors?.severity ?? 0
            })}
          />
          <InfoLine label={copy.dimensions} value={copy.modules.priority.dimensions} />
        </GuideSection>

        <GuideSection
          body={copy.modules.decisionDimensions.body}
          icon={<Route size={18} />}
          title={copy.modules.decisionDimensions.title}
        >
          <InfoLine label={copy.calculation} value={copy.modules.decisionDimensions.formula(detailDimensionCount)} />
          <InfoLine label={copy.dimensions} value={copy.modules.decisionDimensions.dimensions} />
        </GuideSection>

        <GuideSection body={copy.modules.workflow.body} icon={<Workflow size={18} />} title={copy.modules.workflow.title}>
          <InfoLine label={copy.calculation} value={copy.modules.workflow.formula(workflowStageCount)} />
          <InfoLine label={copy.dimensions} value={copy.modules.workflow.dimensions} />
        </GuideSection>

        <GuideSection body={copy.modules.brief.body} icon={<FileText size={18} />} title={copy.modules.brief.title}>
          <InfoLine label={copy.calculation} value={copy.modules.brief.formula(briefDimensionCount)} />
          <InfoLine label={copy.dimensions} value={copy.modules.brief.dimensions} />
        </GuideSection>
      </div>
    </section>
  );
}
