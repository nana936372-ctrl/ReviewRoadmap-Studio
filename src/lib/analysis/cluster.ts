import type { InsightCluster, Review, ReviewSignal, SignalLabel } from '../../domain/types';

const CLUSTER_COPY: Record<SignalLabel, { name: string; description: string; scenario: string }> = {
  bug: {
    name: 'Reliability and data-loss issues',
    description: 'Users report crashes, failed exports, sync problems, or lost work that can damage trust.',
    scenario: 'Users trying to finish important writing work under time pressure.'
  },
  feature_request: {
    name: 'Workflow extension requests',
    description: 'Users ask for exports, planning views, reusable settings, or collaboration features.',
    scenario: 'Users who want the app to fit into an existing content workflow.'
  },
  onboarding_friction: {
    name: 'First-session confusion',
    description: 'Users struggle to choose the right mode, template, or next step during early usage.',
    scenario: 'New users evaluating whether the product is worth keeping.'
  },
  pricing_friction: {
    name: 'Pricing and paywall uncertainty',
    description: 'Users hit paid moments before understanding the value, limits, or export capabilities.',
    scenario: 'Trial users deciding whether the app is worth a subscription.'
  },
  retention_risk: {
    name: 'Trust and repeat-usage risk',
    description: 'Users mention cancellation, loss of trust, or failure to build a habit after the first week.',
    scenario: 'Users who were initially interested but did not reach repeat value.'
  },
  delight: {
    name: 'Differentiated writing experience',
    description: 'Users praise tone controls, clean interface, useful suggestions, and saved time.',
    scenario: 'Satisfied users who understand the product value and can reveal what to protect.'
  }
};

function primaryLabel(signal: ReviewSignal): SignalLabel {
  const priority: SignalLabel[] = [
    'bug',
    'retention_risk',
    'pricing_friction',
    'onboarding_friction',
    'feature_request',
    'delight'
  ];

  return priority.find((label) => signal.labels.includes(label)) ?? signal.labels[0];
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function buildInsightClusters(reviews: Review[], signals: ReviewSignal[]): InsightCluster[] {
  const reviewsById = new Map(reviews.map((review) => [review.id, review]));
  const grouped = new Map<SignalLabel, ReviewSignal[]>();

  for (const signal of signals) {
    const label = primaryLabel(signal);
    grouped.set(label, [...(grouped.get(label) ?? []), signal]);
  }

  return Array.from(grouped.entries())
    .map(([label, clusterSignals]) => {
      const clusterReviews = clusterSignals
        .map((signal) => reviewsById.get(signal.reviewId))
        .filter((review): review is Review => Boolean(review));
      const ratingTotal = clusterReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = clusterReviews.length > 0 ? round(ratingTotal / clusterReviews.length) : 0;
      const confidence = round(Math.min(0.95, 0.62 + clusterSignals.length * 0.1));
      const copy = CLUSTER_COPY[label];

      return {
        id: label,
        name: copy.name,
        description: copy.description,
        labels: Array.from(new Set(clusterSignals.flatMap((signal) => signal.labels))),
        reviewCount: clusterSignals.length,
        averageRating,
        representativeQuotes: clusterSignals.slice(0, 3).map((signal) => signal.quote),
        confidence,
        suspectedUserScenario: copy.scenario
      };
    })
    .sort((a, b) => b.reviewCount - a.reviewCount || a.averageRating - b.averageRating);
}
