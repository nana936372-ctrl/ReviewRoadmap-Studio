export type SignalLabel =
  | 'bug'
  | 'feature_request'
  | 'onboarding_friction'
  | 'pricing_friction'
  | 'retention_risk'
  | 'delight';

export type Sentiment = 'negative' | 'mixed' | 'positive';

export type Urgency = 'low' | 'medium' | 'high';

export type RoadmapType = 'fix' | 'improve' | 'explore';

export type Language = 'en' | 'zh';

export interface EvaluationDimension {
  id: string;
  label: string;
  value: string;
  rationale: string;
  score?: number;
  weight?: number;
  evidence?: string[];
}

export interface RawReview {
  id: string;
  source: 'app-store-sample';
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  date: string;
  appVersion: string;
}

export interface Review extends RawReview {
  normalizedText: string;
}

export interface ReviewSignal {
  reviewId: string;
  labels: SignalLabel[];
  sentiment: Sentiment;
  urgency: Urgency;
  quote: string;
}

export interface InsightCluster {
  id: string;
  name: string;
  description: string;
  labels: SignalLabel[];
  reviewCount: number;
  averageRating: number;
  representativeQuotes: string[];
  confidence: number;
  suspectedUserScenario: string;
}

export interface RoadmapCard {
  id: string;
  type: RoadmapType;
  title: string;
  recommendation: string;
  priorityScore: number;
  scoringFactors: {
    frequency: number;
    severity: number;
    businessImpact: number;
    confidence: number;
    effort: number;
  };
  scoreFormula: string;
  scoreDimensions: EvaluationDimension[];
  recommendationDimensions: EvaluationDimension[];
  metricDimensions: EvaluationDimension[];
  experimentDimensions: EvaluationDimension[];
  riskDimensions: EvaluationDimension[];
  evidenceQuotes: string[];
  userScenario: string;
  targetMetric: string;
  validationExperiment: string;
  risks: string;
  confidence: number;
}

export interface AnalysisResult {
  reviews: Review[];
  signals: ReviewSignal[];
  clusters: InsightCluster[];
  roadmapCards: RoadmapCard[];
  generatedAt: string;
}
