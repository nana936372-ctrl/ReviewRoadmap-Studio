import type { InsightCluster } from '../../domain/types';
import { generateRoadmapCards } from './roadmap';

const clusters: InsightCluster[] = [
  {
    id: 'bug',
    name: 'Reliability and data-loss issues',
    description: 'Users report crashes and lost work.',
    labels: ['bug', 'retention_risk'],
    reviewCount: 4,
    averageRating: 1.5,
    representativeQuotes: ['Lost work: The draft disappeared.'],
    confidence: 0.9,
    suspectedUserScenario: 'Users finishing client work.'
  },
  {
    id: 'feature_request',
    name: 'Workflow extension requests',
    description: 'Users ask for export and planning features.',
    labels: ['feature_request'],
    reviewCount: 3,
    averageRating: 4,
    representativeQuotes: ['Please add Notion export.'],
    confidence: 0.82,
    suspectedUserScenario: 'Users moving drafts into publishing tools.'
  },
  {
    id: 'onboarding_friction',
    name: 'First-session confusion',
    description: 'Users struggle to choose the right template.',
    labels: ['onboarding_friction'],
    reviewCount: 2,
    averageRating: 3,
    representativeQuotes: ['I did not know which mode to choose.'],
    confidence: 0.72,
    suspectedUserScenario: 'New users trying the first draft.'
  }
];

describe('generateRoadmapCards', () => {
  it('creates fix, improve, and explore cards with evidence', () => {
    const cards = generateRoadmapCards(clusters);

    expect(cards.map((card) => card.type)).toEqual(['fix', 'improve', 'explore']);
    expect(cards[0].title).toBe('Stabilize draft saving and export reliability');
    expect(cards[0].evidenceQuotes).toEqual(['Lost work: The draft disappeared.']);
    expect(cards[0].userScenario).toBe('Users finishing client work.');
    expect(cards[0].scoreFormula).toContain('frequency 22%');
    expect(cards[0].scoreDimensions.map((dimension) => dimension.id)).toEqual([
      'frequency',
      'severity',
      'businessImpact',
      'confidence',
      'effort'
    ]);
    expect(cards[0].recommendationDimensions[0].rationale).toMatch(/lost work/i);
    expect(cards[0].metricDimensions[0].label).toBe('Metric fit');
    expect(cards[0].experimentDimensions[0].label).toBe('Experiment quality');
    expect(cards[0].riskDimensions[0].label).toBe('Risk control');
    expect(cards[0].priorityScore).toBeGreaterThan(cards[2].priorityScore);
  });

  it('returns an empty card list for empty clusters', () => {
    expect(generateRoadmapCards([])).toEqual([]);
  });

  it('can localize roadmap cards for Chinese product review', () => {
    const cards = generateRoadmapCards(clusters, 'zh');

    expect(cards[0]).toMatchObject({
      title: '稳定草稿保存与导出可靠性',
      recommendation: '先修复自动保存、导出恢复和同步状态提示，再扩展新的写作模式。',
      targetMetric: '降低每 100 条评论中的一星可靠性投诉数。'
    });
    expect(cards[0].scoreFormula).toContain('频次 22%');
    expect(cards[0].scoreDimensions[0].label).toBe('频次');
    expect(cards[0].recommendationDimensions[0].label).toBe('建议依据');
  });
});
