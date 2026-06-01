import type { AnalysisResult, Language, RawReview } from '../domain/types';
import { buildSemanticAnalysisResult, type SemanticAnalysisDraft } from './analysis/semantic';

type SemanticAnalysisApiResponse = {
  semanticAnalysis?: unknown;
  error?: unknown;
};

function isSemanticAnalysisDraft(value: unknown): value is SemanticAnalysisDraft {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const draft = value as Partial<SemanticAnalysisDraft>;
  return Array.isArray(draft.reviewSignals) && Array.isArray(draft.clusters) && Array.isArray(draft.roadmapCards);
}

export async function fetchSemanticAnalysis(
  reviews: RawReview[],
  language: Language,
  generatedAt = new Date().toISOString()
): Promise<AnalysisResult> {
  const response = await fetch('/api/semantic-analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ reviews, language })
  });

  const payload = (await response.json()) as SemanticAnalysisApiResponse;

  if (!response.ok) {
    throw new Error(typeof payload.error === 'string' ? payload.error : 'Semantic analysis failed.');
  }

  if (!isSemanticAnalysisDraft(payload.semanticAnalysis)) {
    throw new Error('Semantic analysis returned an invalid shape.');
  }

  return buildSemanticAnalysisResult(reviews, payload.semanticAnalysis, generatedAt, language);
}
