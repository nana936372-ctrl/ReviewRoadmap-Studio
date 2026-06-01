import type {
  AnalysisResult,
  InsightCluster,
  Language,
  RawReview,
  Review,
  ReviewSignal,
  RoadmapType,
  Sentiment,
  SignalLabel,
  Urgency
} from '../../domain/types';
import { classifyReview } from './classify';
import { normalizeReviews } from './normalize';
import { generateRoadmapCardsFromSemanticDecisions, type SemanticRoadmapDecision } from './roadmap';
import { confidenceScoreForReviewCount } from './scoring';

export interface SemanticReviewSignalDraft {
  reviewId: string;
  labels: SignalLabel[];
  sentiment: Sentiment;
  urgency: Urgency;
  quote: string;
}

export interface SemanticClusterDraft {
  id: string;
  name: string;
  description: string;
  labels: SignalLabel[];
  reviewIds: string[];
  representativeReviewIds: string[];
  suspectedUserScenario: string;
}

export interface SemanticAnalysisDraft {
  reviewSignals: SemanticReviewSignalDraft[];
  clusters: SemanticClusterDraft[];
  roadmapCards: SemanticRoadmapDecision[];
}

const SIGNAL_LABELS: SignalLabel[] = [
  'bug',
  'feature_request',
  'onboarding_friction',
  'pricing_friction',
  'retention_risk',
  'delight'
];
const SENTIMENTS: Sentiment[] = ['negative', 'mixed', 'positive'];
const URGENCIES: Urgency[] = ['low', 'medium', 'high'];
const ROADMAP_TYPES: RoadmapType[] = ['fix', 'improve', 'explore'];

export const SEMANTIC_ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['reviewSignals', 'clusters', 'roadmapCards'],
  properties: {
    reviewSignals: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['reviewId', 'labels', 'sentiment', 'urgency', 'quote'],
        properties: {
          reviewId: { type: 'string' },
          labels: {
            type: 'array',
            minItems: 1,
            items: { type: 'string', enum: SIGNAL_LABELS }
          },
          sentiment: { type: 'string', enum: SENTIMENTS },
          urgency: { type: 'string', enum: URGENCIES },
          quote: { type: 'string' }
        }
      }
    },
    clusters: {
      type: 'array',
      minItems: 1,
      maxItems: 6,
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'id',
          'name',
          'description',
          'labels',
          'reviewIds',
          'representativeReviewIds',
          'suspectedUserScenario'
        ],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          labels: {
            type: 'array',
            minItems: 1,
            items: { type: 'string', enum: SIGNAL_LABELS }
          },
          reviewIds: {
            type: 'array',
            minItems: 1,
            items: { type: 'string' }
          },
          representativeReviewIds: {
            type: 'array',
            minItems: 1,
            items: { type: 'string' }
          },
          suspectedUserScenario: { type: 'string' }
        }
      }
    },
    roadmapCards: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['type', 'clusterId', 'title', 'recommendation', 'targetMetric', 'validationExperiment', 'risks'],
        properties: {
          type: { type: 'string', enum: ROADMAP_TYPES },
          clusterId: { type: 'string' },
          title: { type: 'string' },
          recommendation: { type: 'string' },
          targetMetric: { type: 'string' },
          validationExperiment: { type: 'string' },
          risks: { type: 'string' }
        }
      }
    }
  }
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function isSignalLabel(value: unknown): value is SignalLabel {
  return typeof value === 'string' && SIGNAL_LABELS.includes(value as SignalLabel);
}

function isSentiment(value: unknown): value is Sentiment {
  return typeof value === 'string' && SENTIMENTS.includes(value as Sentiment);
}

function isUrgency(value: unknown): value is Urgency {
  return typeof value === 'string' && URGENCIES.includes(value as Urgency);
}

function isRoadmapType(value: unknown): value is RoadmapType {
  return typeof value === 'string' && ROADMAP_TYPES.includes(value as RoadmapType);
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function labelsArray(value: unknown): SignalLabel[] {
  return Array.from(new Set(stringArray(value).filter(isSignalLabel)));
}

function fallbackQuote(review: Review): string {
  const body = review.body.length > 140 ? `${review.body.slice(0, 137)}...` : review.body;
  return `${review.title}: ${body}`;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function existingReviewIds(reviewIds: string[], reviewsById: Map<string, Review>): string[] {
  return Array.from(new Set(reviewIds.filter((id) => reviewsById.has(id))));
}

function normalizeDraftSignal(value: unknown, reviewsById: Map<string, Review>): ReviewSignal | null {
  if (!isRecord(value)) {
    return null;
  }

  const reviewId = stringValue(value.reviewId);
  const review = reviewsById.get(reviewId);

  if (!review) {
    return null;
  }

  const labels = labelsArray(value.labels);
  const sentiment = isSentiment(value.sentiment) ? value.sentiment : null;
  const urgency = isUrgency(value.urgency) ? value.urgency : null;

  if (labels.length === 0 || !sentiment || !urgency) {
    return null;
  }

  return {
    reviewId,
    labels,
    sentiment,
    urgency,
    quote: stringValue(value.quote) || fallbackQuote(review)
  };
}

function normalizeSignals(draft: SemanticAnalysisDraft, reviews: Review[]): ReviewSignal[] {
  const reviewsById = new Map(reviews.map((review) => [review.id, review]));
  const draftedSignals = draft.reviewSignals
    .map((signal) => normalizeDraftSignal(signal, reviewsById))
    .filter((signal): signal is ReviewSignal => Boolean(signal));
  const draftedReviewIds = new Set(draftedSignals.map((signal) => signal.reviewId));
  const fallbackSignals = reviews
    .filter((review) => !draftedReviewIds.has(review.id))
    .map((review) => classifyReview(review));

  return [...draftedSignals, ...fallbackSignals];
}

function normalizeClusterId(id: string, index: number, usedIds: Set<string>): string {
  const base = id.trim() || `semantic-cluster-${index + 1}`;
  let candidate = base;
  let suffix = 2;

  while (usedIds.has(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  usedIds.add(candidate);
  return candidate;
}

function buildCluster(
  value: unknown,
  index: number,
  reviewsById: Map<string, Review>,
  signalsByReviewId: Map<string, ReviewSignal>,
  usedIds: Set<string>
): InsightCluster | null {
  if (!isRecord(value)) {
    return null;
  }

  const reviewIds = existingReviewIds(stringArray(value.reviewIds), reviewsById);

  if (reviewIds.length === 0) {
    return null;
  }

  const clusterReviews = reviewIds.map((id) => reviewsById.get(id)).filter((review): review is Review => Boolean(review));
  const ratingTotal = clusterReviews.reduce((sum, review) => sum + review.rating, 0);
  const signalLabels = reviewIds.flatMap((id) => signalsByReviewId.get(id)?.labels ?? []);
  const labels = labelsArray(value.labels);
  const mergedLabels = Array.from(new Set([...labels, ...signalLabels]));
  const representativeReviewIds = existingReviewIds(stringArray(value.representativeReviewIds), reviewsById);
  const quoteReviewIds = representativeReviewIds.length > 0 ? representativeReviewIds : reviewIds.slice(0, 3);
  const representativeQuotes = quoteReviewIds
    .map((id) => signalsByReviewId.get(id)?.quote ?? reviewsById.get(id))
    .map((item) => (typeof item === 'string' ? item : item ? fallbackQuote(item) : ''))
    .filter(Boolean)
    .slice(0, 3);

  return {
    id: normalizeClusterId(stringValue(value.id), index, usedIds),
    name: stringValue(value.name) || (index === 0 ? 'Semantic insight' : `Semantic insight ${index + 1}`),
    description: stringValue(value.description),
    labels: mergedLabels.length > 0 ? mergedLabels : ['feature_request'],
    reviewIds,
    reviewCount: reviewIds.length,
    averageRating: round(ratingTotal / reviewIds.length),
    representativeQuotes,
    confidence: confidenceScoreForReviewCount(reviewIds.length),
    suspectedUserScenario: stringValue(value.suspectedUserScenario)
  };
}

function normalizeDecision(value: unknown, clusterIds: Set<string>): SemanticRoadmapDecision | null {
  if (!isRecord(value) || !isRoadmapType(value.type)) {
    return null;
  }

  const clusterId = stringValue(value.clusterId);

  if (!clusterIds.has(clusterId)) {
    return null;
  }

  return {
    type: value.type,
    clusterId,
    title: stringValue(value.title),
    recommendation: stringValue(value.recommendation),
    targetMetric: stringValue(value.targetMetric),
    validationExperiment: stringValue(value.validationExperiment),
    risks: stringValue(value.risks)
  };
}

function normalizeSemanticDraft(value: SemanticAnalysisDraft): SemanticAnalysisDraft {
  return {
    reviewSignals: Array.isArray(value.reviewSignals) ? value.reviewSignals : [],
    clusters: Array.isArray(value.clusters) ? value.clusters : [],
    roadmapCards: Array.isArray(value.roadmapCards) ? value.roadmapCards : []
  };
}

export function buildSemanticAnalysisResult(
  rawReviews: RawReview[],
  semanticDraft: SemanticAnalysisDraft,
  generatedAt = new Date().toISOString(),
  language: Language = 'en'
): AnalysisResult {
  const reviews = normalizeReviews(rawReviews);

  if (reviews.length === 0) {
    return {
      reviews: [],
      signals: [],
      clusters: [],
      roadmapCards: [],
      generatedAt
    };
  }

  const draft = normalizeSemanticDraft(semanticDraft);
  const reviewsById = new Map(reviews.map((review) => [review.id, review]));
  const signals = normalizeSignals(draft, reviews);
  const signalsByReviewId = new Map(signals.map((signal) => [signal.reviewId, signal]));
  const usedIds = new Set<string>();
  const clusters = draft.clusters
    .map((cluster, index) => buildCluster(cluster, index, reviewsById, signalsByReviewId, usedIds))
    .filter((cluster): cluster is InsightCluster => Boolean(cluster));
  const clusterIds = new Set(clusters.map((cluster) => cluster.id));
  const decisions = draft.roadmapCards
    .map((decision) => normalizeDecision(decision, clusterIds))
    .filter((decision): decision is SemanticRoadmapDecision => Boolean(decision));

  return {
    reviews,
    signals,
    clusters,
    roadmapCards: generateRoadmapCardsFromSemanticDecisions(clusters, decisions, language),
    generatedAt
  };
}
