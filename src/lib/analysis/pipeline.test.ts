import { sampleReviews } from '../../data/sampleReviews';
import { analyzeReviews } from './pipeline';

describe('analyzeReviews', () => {
  it('returns normalized reviews, signals, clusters, and three roadmap cards', () => {
    const result = analyzeReviews(sampleReviews, '2026-05-28T08:00:00.000Z');

    expect(result.reviews).toHaveLength(18);
    expect(result.signals).toHaveLength(18);
    expect(result.clusters.length).toBeGreaterThanOrEqual(5);
    expect(result.roadmapCards).toHaveLength(3);
    expect(result.roadmapCards.map((card) => card.type)).toEqual(['fix', 'improve', 'explore']);
    expect(result.generatedAt).toBe('2026-05-28T08:00:00.000Z');
  });

  it('returns an empty analysis result when there are no normalized reviews', () => {
    const result = analyzeReviews([], '2026-05-28T08:00:00.000Z');

    expect(result).toEqual({
      reviews: [],
      signals: [],
      clusters: [],
      roadmapCards: [],
      generatedAt: '2026-05-28T08:00:00.000Z'
    });
  });

  it('returns localized cluster and roadmap copy for Chinese analysis', () => {
    const result = analyzeReviews(sampleReviews, '2026-05-28T08:00:00.000Z', 'zh');

    expect(result.clusters.some((cluster) => cluster.name === '可靠性与核心任务问题')).toBe(true);
    expect(result.roadmapCards[0].title).toBe('修复草稿恢复与导出失败点');
  });
});
