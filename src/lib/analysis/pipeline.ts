import type { AnalysisResult, RawReview } from '../../domain/types';
import { buildInsightClusters } from './cluster';
import { classifyReviews } from './classify';
import { normalizeReviews } from './normalize';
import { generateRoadmapCards } from './roadmap';

export function analyzeReviews(rawReviews: RawReview[], generatedAt = new Date().toISOString()): AnalysisResult {
  const reviews = normalizeReviews(rawReviews);
  const signals = classifyReviews(reviews);
  const clusters = buildInsightClusters(reviews, signals);
  const roadmapCards = generateRoadmapCards(clusters);

  return {
    reviews,
    signals,
    clusters,
    roadmapCards,
    generatedAt
  };
}
