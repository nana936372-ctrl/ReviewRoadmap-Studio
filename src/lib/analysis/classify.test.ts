import type { Review } from '../../domain/types';
import { classifyReview, extractQuote } from './classify';

const baseReview: Review = {
  id: 'r1',
  source: 'app-store-sample',
  rating: 2,
  title: 'Lost work',
  body: 'The app froze and I lost a paragraph during export.',
  date: '2026-05-01',
  appVersion: '1.0.0',
  normalizedText: 'Lost work The app froze and I lost a paragraph during export.'
};

describe('extractQuote', () => {
  it('returns a compact quote with the review title', () => {
    expect(extractQuote(baseReview)).toBe('Lost work: The app froze and I lost a paragraph during export.');
  });
});

describe('classifyReview', () => {
  it('labels crash and lost work reviews as urgent bugs', () => {
    expect(classifyReview(baseReview)).toMatchObject({
      reviewId: 'r1',
      labels: ['bug', 'retention_risk'],
      sentiment: 'negative',
      urgency: 'high'
    });
  });

  it('labels paywall complaints as pricing friction', () => {
    const signal = classifyReview({
      ...baseReview,
      id: 'r2',
      rating: 1,
      normalizedText: 'Subscription wall too early The paywall appeared before I could try export.'
    });

    expect(signal.labels).toContain('pricing_friction');
    expect(signal.urgency).toBe('high');
  });

  it('labels praise as delight', () => {
    const signal = classifyReview({
      ...baseReview,
      id: 'r3',
      rating: 5,
      normalizedText: 'Best tone controls I love the clean interface and useful suggestions.'
    });

    expect(signal.labels).toEqual(['delight']);
    expect(signal.sentiment).toBe('positive');
  });
});
