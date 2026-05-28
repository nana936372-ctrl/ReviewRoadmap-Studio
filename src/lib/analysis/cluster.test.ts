import type { Review, ReviewSignal } from '../../domain/types';
import { buildInsightClusters } from './cluster';

const reviews: Review[] = [
  {
    id: 'r1',
    source: 'app-store-sample',
    rating: 1,
    title: 'Crash',
    body: 'The app crashed during export.',
    date: '2026-05-01',
    appVersion: '1.0.0',
    normalizedText: 'Crash The app crashed during export.'
  },
  {
    id: 'r2',
    source: 'app-store-sample',
    rating: 5,
    title: 'Love it',
    body: 'The clean interface helped me write faster.',
    date: '2026-05-02',
    appVersion: '1.0.0',
    normalizedText: 'Love it The clean interface helped me write faster.'
  }
];

const signals: ReviewSignal[] = [
  {
    reviewId: 'r1',
    labels: ['bug', 'retention_risk'],
    sentiment: 'negative',
    urgency: 'high',
    quote: 'Crash: The app crashed during export.'
  },
  {
    reviewId: 'r2',
    labels: ['delight'],
    sentiment: 'positive',
    urgency: 'low',
    quote: 'Love it: The clean interface helped me write faster.'
  }
];

describe('buildInsightClusters', () => {
  it('groups reviews by primary product signal', () => {
    const clusters = buildInsightClusters(reviews, signals);

    expect(clusters.map((cluster) => cluster.id)).toEqual(['bug', 'delight']);
    expect(clusters[0]).toMatchObject({
      name: 'Reliability and data-loss issues',
      reviewCount: 1,
      averageRating: 1,
      confidence: 0.72
    });
    expect(clusters[0].representativeQuotes).toEqual(['Crash: The app crashed during export.']);
  });
});
