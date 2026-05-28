import type { RawReview, Review } from '../../domain/types';

export function normalizeText(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

export function normalizeReviews(rawReviews: RawReview[]): Review[] {
  return rawReviews
    .map((review) => {
      const title = normalizeText(review.title);
      const body = normalizeText(review.body);
      const normalizedText = normalizeText(`${title} ${body}`);

      return {
        ...review,
        title,
        body,
        normalizedText
      };
    })
    .filter((review) => review.normalizedText.length > 0);
}
