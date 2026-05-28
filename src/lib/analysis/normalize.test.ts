import { normalizeReviews, normalizeText } from './normalize';
import type { RawReview } from '../../domain/types';

describe('normalizeText', () => {
  it('trims and collapses whitespace', () => {
    expect(normalizeText('  Lost   work\nagain  ')).toBe('Lost work again');
  });
});

describe('normalizeReviews', () => {
  it('drops empty reviews and keeps citation fields', () => {
    const raw: RawReview[] = [
      {
        id: 'r1',
        source: 'app-store-sample',
        rating: 1,
        title: 'Crash',
        body: '   The app crashed during export.   ',
        date: '2026-05-01',
        appVersion: '1.0.0'
      },
      {
        id: 'r2',
        source: 'app-store-sample',
        rating: 5,
        title: '',
        body: '    ',
        date: '2026-05-02',
        appVersion: '1.0.0'
      }
    ];

    expect(normalizeReviews(raw)).toEqual([
      {
        ...raw[0],
        title: 'Crash',
        body: 'The app crashed during export.',
        normalizedText: 'Crash The app crashed during export.'
      }
    ]);
  });
});
