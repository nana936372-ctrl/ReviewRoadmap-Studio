import type { RawReview } from '../../domain/types';
import { buildSemanticAnalysisResult } from './semantic';

const reviews: RawReview[] = [
  {
    id: 'r1',
    source: 'app-store-live',
    rating: 5,
    title: '孩子听力有进步',
    body: '孩子读了一段时间绘本之后，发现听力有一些进步。',
    date: '2026-05-20T00:00:00.000Z',
    appVersion: '1.0.0'
  },
  {
    id: 'r2',
    source: 'app-store-live',
    rating: 2,
    title: '不能打卡',
    body: '更新后不能打卡，小队活跃状态也不准。',
    date: '2026-05-21T00:00:00.000Z',
    appVersion: '1.0.1'
  }
];

describe('buildSemanticAnalysisResult', () => {
  it('uses LLM semantic text while recalculating numeric fields from review evidence', () => {
    const result = buildSemanticAnalysisResult(
      reviews,
      {
        reviewSignals: [
          {
            reviewId: 'r1',
            labels: ['delight'],
            sentiment: 'positive',
            urgency: 'low',
            quote: '孩子听力有进步: 孩子读了一段时间绘本之后，发现听力有一些进步。'
          },
          {
            reviewId: 'r2',
            labels: ['bug', 'retention_risk'],
            sentiment: 'negative',
            urgency: 'high',
            quote: '不能打卡: 更新后不能打卡，小队活跃状态也不准。'
          }
        ],
        clusters: [
          {
            id: 'learning-progress',
            name: '被验证的学习进步',
            description: '家长明确反馈孩子在绘本阅读后听力进步。',
            labels: ['delight'],
            reviewIds: ['r1', 'missing-review'],
            representativeReviewIds: ['r1'],
            suspectedUserScenario: '家长观察孩子是否真的学有进展。'
          },
          {
            id: 'check-in-state',
            name: '打卡与小队状态异常',
            description: '用户反馈打卡失败和小队活跃状态不准确。',
            labels: ['bug', 'retention_risk'],
            reviewIds: ['r2'],
            representativeReviewIds: ['r2'],
            suspectedUserScenario: '家长陪孩子完成每日学习任务。'
          }
        ],
        roadmapCards: [
          {
            type: 'fix',
            clusterId: 'check-in-state',
            title: '修复打卡和小队状态判断',
            recommendation: '先修复打卡状态与小队活跃判定，避免学习激励机制失去可信度。',
            targetMetric: '降低打卡失败和小队状态异常评论占比。',
            validationExperiment: '对打卡和小队状态校验做小流量发布，并观察两周内相关差评。',
            risks: '会推迟新增激励玩法，但能先保护每日学习习惯。'
          },
          {
            type: 'improve',
            clusterId: 'learning-progress',
            title: '放大学习进步反馈',
            recommendation: '把听力进步等已验证价值做成更清晰的家长反馈。',
            targetMetric: '提升提到学习进步的正向评论占比。',
            validationExperiment: '原型化一版学习进步报告，观察家长 7 天回访。',
            risks: '反馈过重可能增加理解成本，所以第一版只突出一个进步信号。'
          },
          {
            type: 'explore',
            clusterId: 'learning-progress',
            title: '测试家长进步证明需求',
            recommendation: '先验证家长是否需要更细的进步解释，再扩大报告能力。',
            targetMetric: '提升进步报告点击后的复访率。',
            validationExperiment: 'A/B 测试一版轻量进步说明。',
            risks: '过早做完整报告可能偏离真实需求。'
          }
        ]
      },
      '2026-05-28T08:00:00.000Z',
      'zh'
    );

    expect(result.generatedAt).toBe('2026-05-28T08:00:00.000Z');
    expect(result.clusters[0]).toMatchObject({
      id: 'learning-progress',
      name: '被验证的学习进步',
      reviewCount: 1,
      averageRating: 5,
      confidence: 0.72
    });
    expect(result.roadmapCards.map((card) => card.type)).toEqual(['fix', 'improve', 'explore']);
    expect(result.roadmapCards[0]).toMatchObject({
      title: '修复打卡和小队状态判断',
      supportingReviewCount: 1,
      confidence: 0.72
    });
    expect(result.roadmapCards[1].title).toBe('放大学习进步反馈');
    expect(result.roadmapCards[1].recommendationDimensions[0].value).toBe('放大学习进步反馈');
  });
});
