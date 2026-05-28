import type { InsightCluster, RoadmapCard, RoadmapType } from '../../domain/types';

const TYPE_ORDER: RoadmapType[] = ['fix', 'improve', 'explore'];

function findCluster(clusters: InsightCluster[], ids: string[]): InsightCluster {
  return ids.map((id) => clusters.find((cluster) => cluster.id === id)).find(Boolean) ?? clusters[0];
}

function score(cluster: InsightCluster, severity: number, impact: number, effort: number): RoadmapCard['scoringFactors'] {
  return {
    frequency: Math.min(5, Math.max(1, cluster.reviewCount)),
    severity,
    businessImpact: impact,
    confidence: Math.round(cluster.confidence * 5),
    effort
  };
}

function priorityScore(factors: RoadmapCard['scoringFactors']): number {
  const raw =
    factors.frequency * 0.22 +
    factors.severity * 0.28 +
    factors.businessImpact * 0.25 +
    factors.confidence * 0.15 -
    factors.effort * 0.1;

  return Math.max(1, Math.min(100, Math.round(raw * 20)));
}

function createCard(type: RoadmapType, cluster: InsightCluster): RoadmapCard {
  if (type === 'fix') {
    const factors = score(cluster, 5, 5, 3);

    return {
      id: 'fix-reliability',
      type,
      title: 'Stabilize draft saving and export reliability',
      recommendation: 'Prioritize auto-save, export recovery, and sync-state visibility before expanding new writing modes.',
      priorityScore: priorityScore(factors),
      scoringFactors: factors,
      evidenceQuotes: cluster.representativeQuotes,
      userScenario: cluster.suspectedUserScenario,
      targetMetric: 'Reduce one-star reliability complaints per 100 reviews.',
      validationExperiment: 'Ship auto-save recovery messaging to 25% of users and compare lost-draft support mentions for two weeks.',
      risks: 'This may delay visible feature work, but trust issues can suppress retention and paid conversion.',
      confidence: cluster.confidence
    };
  }

  if (type === 'improve') {
    const factors = score(cluster, 3, 4, 3);

    return {
      id: 'improve-workflow',
      type,
      title: 'Add one high-fit workflow export',
      recommendation: 'Start with Notion-friendly export or preserved formatting because users already describe a clear downstream workflow.',
      priorityScore: priorityScore(factors),
      scoringFactors: factors,
      evidenceQuotes: cluster.representativeQuotes,
      userScenario: cluster.suspectedUserScenario,
      targetMetric: 'Increase completed exports per activated user.',
      validationExperiment: 'Prototype one export path and measure whether users who export return within seven days.',
      risks: 'Export breadth can sprawl, so the first version should support one workflow with strong evidence.',
      confidence: cluster.confidence
    };
  }

  const factors = score(cluster, 3, 3, 2);

  return {
    id: 'explore-onboarding',
    type,
    title: 'Test a guided first-draft setup',
    recommendation: 'Use a short guided setup that recommends one writing mode and one template based on the user goal.',
    priorityScore: priorityScore(factors),
    scoringFactors: factors,
    evidenceQuotes: cluster.representativeQuotes,
    userScenario: cluster.suspectedUserScenario,
    targetMetric: 'Improve first-session draft completion rate.',
    validationExperiment: 'A/B test guided setup against the current template picker for new users.',
    risks: 'Guidance can feel restrictive to advanced users, so provide a skip path and keep the first question lightweight.',
    confidence: cluster.confidence
  };
}

export function generateRoadmapCards(clusters: InsightCluster[]): RoadmapCard[] {
  if (clusters.length === 0) return [];

  const selected = {
    fix: findCluster(clusters, ['bug', 'retention_risk', 'pricing_friction']),
    improve: findCluster(clusters, ['feature_request', 'delight']),
    explore: findCluster(clusters, ['onboarding_friction', 'pricing_friction', 'feature_request'])
  };

  return TYPE_ORDER.map((type) => createCard(type, selected[type]));
}
