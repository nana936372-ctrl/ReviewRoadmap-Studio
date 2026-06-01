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
    expect(cards[0].title).toBe('Fix draft recovery and export failure points');
    expect(cards[0].targetMetric).toBe('Reduce draft-loss, recovery, or export-failure complaints per 100 reviews.');
    expect(cards[0].validationExperiment).toMatch(/autosave/i);
    expect(cards[0].evidenceQuotes).toEqual(['Lost work: The draft disappeared.']);
    expect(cards[0].userScenario).toBe('Users finishing client work.');
    expect(cards[0].supportingReviewCount).toBe(4);
    expect(cards[0].scoreFormula).toContain('frequency 22%');
    expect(cards[0].scoreDimensions.map((dimension) => dimension.id)).toEqual([
      'frequency',
      'severity',
      'businessImpact',
      'confidence',
      'effort'
    ]);
    expect(cards[0].recommendationDimensions[0].value).toBe('Fix draft recovery and export failure points');
    expect(cards[0].recommendationDimensions[0].rationale).toMatch(/draft recovery/i);
    expect(cards[0].metricDimensions[0].label).toBe('Metric fit');
    expect(cards[0].metricDimensions[0].value).toBe('Draft loss complaint rate');
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
      title: '修复草稿恢复与导出失败点',
      recommendation: '优先修复自动保存、草稿恢复、同步和导出失败点，避免用户在重要任务中失去成果。',
      targetMetric: '降低每 100 条评论中的草稿丢失、恢复失败或导出失败投诉数。'
    });
    expect(cards[0].scoreFormula).toContain('频次 22%');
    expect(cards[0].scoreDimensions[0].label).toBe('频次');
    expect(cards[0].recommendationDimensions[0].label).toBe('建议依据');
  });

  it('derives specific roadmap decisions from a Chinese education app review theme', () => {
    const educationClusters: InsightCluster[] = [
      {
        id: 'bug',
        name: '可靠性与核心任务问题',
        description: '用户反馈打卡、小队活跃状态和学习激励规则不可信。',
        labels: ['bug', 'retention_risk'],
        reviewCount: 6,
        averageRating: 1.4,
        representativeQuotes: [
          '不能打卡，更新后打卡按钮没有了，直接跳到下一步。',
          '小队里有人长期不打卡，队长也不能踢出，活跃规则看不懂。'
        ],
        confidence: 0.95,
        suspectedUserScenario: '家长每天陪孩子完成阅读任务。'
      }
    ];

    const cards = generateRoadmapCards(educationClusters, 'zh');

    expect(cards[0]).toMatchObject({
      title: '修复打卡状态与小队活跃判定异常',
      recommendation: '优先修复打卡状态、队员活跃判定和小队规则反馈，避免激励机制被用户认为不可信。',
      targetMetric: '降低每 100 条评论中的打卡/小队异常投诉数。'
    });
    expect(cards[0].validationExperiment).toMatch(/打卡与小队页/);
    expect(cards[0].recommendationDimensions[0].value).toBe('修复打卡状态与小队活跃判定异常');
    expect(cards[0].metricDimensions[0].value).toBe('打卡/小队异常投诉率');
  });

  it('derives a specific pricing decision for subscription friction in a different app', () => {
    const pricingClusters: InsightCluster[] = [
      {
        id: 'pricing_friction',
        name: 'Pricing and subscription uncertainty',
        description: 'Users meet a subscription prompt before understanding included value.',
        labels: ['pricing_friction'],
        reviewCount: 3,
        averageRating: 2,
        representativeQuotes: [
          'The paywall appeared before I understood the value, and the trial does not explain export limits.',
          'Subscription pricing is hard to compare with other tools.'
        ],
        confidence: 0.92,
        suspectedUserScenario: 'New users evaluating whether the product is worth keeping.'
      }
    ];

    const cards = generateRoadmapCards(pricingClusters, 'en');

    expect(cards[0]).toMatchObject({
      title: 'Clarify value before subscription moments',
      targetMetric: 'Reduce value, plan, or limit-clarity complaints per 100 reviews.'
    });
    expect(cards[0].recommendation).toMatch(/subscription/i);
    expect(cards[0].validationExperiment).toMatch(/paywall/i);
    expect(cards[0].metricDimensions[0].value).toBe('Pricing clarity complaint rate');
  });
});
