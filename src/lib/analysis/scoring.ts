import type { RoadmapCard } from '../../domain/types';

export const CONFIDENCE_BASE_FACTORS = {
  structuredReviewSource: 40,
  starRating: 10,
  quotableText: 8,
  productSignal: 4
} as const;

export type ConfidenceBaseFactors = typeof CONFIDENCE_BASE_FACTORS;

export const CONFIDENCE_BASE_PERCENT = Object.values(CONFIDENCE_BASE_FACTORS).reduce(
  (sum, value) => sum + value,
  0
);
export const CONFIDENCE_PER_REVIEW_PERCENT = 10;
export const CONFIDENCE_CAP_PERCENT = 95;

export const PRIORITY_SCORE_WEIGHTS = {
  frequency: 0.22,
  severity: 0.28,
  businessImpact: 0.25,
  confidence: 0.15,
  effort: -0.1
} satisfies Record<keyof RoadmapCard['scoringFactors'], number>;

export function confidencePercentForReviewCount(reviewCount: number): number {
  return Math.round(
    Math.min(CONFIDENCE_CAP_PERCENT, CONFIDENCE_BASE_PERCENT + reviewCount * CONFIDENCE_PER_REVIEW_PERCENT)
  );
}

export function confidenceScoreForReviewCount(reviewCount: number): number {
  return confidencePercentForReviewCount(reviewCount) / 100;
}
