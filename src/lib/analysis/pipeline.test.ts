import { sampleReviews } from '../../data/sampleReviews';
import type { RawReview } from '../../domain/types';
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

  it('does not turn positive learning praise into a content-quality trust fix', () => {
    const praiseReviews: RawReview[] = [
      {
        id: 'praise-1',
        source: 'app-store-live',
        rating: 5,
        title: '用了两年的百词斩来说一说',
        body: '百词斩的优势在于图文混记，我们无法遗忘母语是学英语最大的障碍。单词报告有及时反馈，改进意见也很有帮助。',
        date: '2026-05-20',
        appVersion: '1.0.0'
      },
      {
        id: 'praise-2',
        source: 'app-store-live',
        rating: 5,
        title: '我爱百词斩',
        body: '用了百词斩已经一年多啦，从惧怕英语到喜欢英语，推荐给身边很多朋友。',
        date: '2026-05-21',
        appVersion: '1.0.0'
      }
    ];

    const result = analyzeReviews(praiseReviews, '2026-05-28T08:00:00.000Z', 'zh');

    expect(result.signals.every((signal) => !signal.labels.includes('bug'))).toBe(true);
    expect(result.roadmapCards.map((card) => card.title)).not.toContain('提升内容质量与结果可信度');
  });
});
