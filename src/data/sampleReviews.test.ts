import { sampleReviews } from './sampleReviews';

describe('sampleReviews', () => {
  it('contains enough review variety for the portfolio demo', () => {
    expect(sampleReviews).toHaveLength(18);
    expect(new Set(sampleReviews.map((review) => review.rating)).size).toBeGreaterThanOrEqual(4);
    expect(sampleReviews.every((review) => review.body.length > 40)).toBe(true);
  });

  it('keeps stable ids for evidence citations', () => {
    const ids = sampleReviews.map((review) => review.id);
    expect(new Set(ids).size).toBe(sampleReviews.length);
    expect(ids.every((id) => id.startsWith('draftly-'))).toBe(true);
  });
});
