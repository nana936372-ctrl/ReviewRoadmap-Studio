import { sampleReviews } from '../../data/sampleReviews';
import { analyzeReviews } from './pipeline';

describe('analyzeReviews', () => {
  it('returns normalized reviews, signals, clusters, and three roadmap cards', () => {
    const result = analyzeReviews(sampleReviews, '2026-05-28T08:00:00.000Z');

    expect(result.reviews).toHaveLength(18);
    expect(result.signals).toHaveLength(18);
    expect(result.clusters.length).toBeGreaterThanOrEqual(5);
    expect(result.roadmapCards).toHaveLength(3);
    expect(result.generatedAt).toBe('2026-05-28T08:00:00.000Z');
  });
});
