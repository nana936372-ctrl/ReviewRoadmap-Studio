import type { RawReview } from '../domain/types';

type AppStorePageReview = {
  $kind?: unknown;
  id?: unknown;
  title?: unknown;
  date?: unknown;
  contents?: unknown;
  rating?: unknown;
};

const SERIALIZED_SERVER_DATA_PATTERN =
  /<script[^>]*id=["']serialized-server-data["'][^>]*>([\s\S]*?)<\/script>/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function toStringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function toRating(value: unknown): RawReview['rating'] | null {
  const rating = Number(value);

  if ([1, 2, 3, 4, 5].includes(rating)) {
    return rating as RawReview['rating'];
  }

  return null;
}

function walkForReviews(value: unknown, reviews: AppStorePageReview[]): void {
  if (!isRecord(value)) {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => walkForReviews(item, reviews));
    return;
  }

  if (value.$kind === 'Review') {
    reviews.push(value as AppStorePageReview);
  }

  Object.values(value).forEach((child) => walkForReviews(child, reviews));
}

export function parseAppStorePageReviews(html: string): RawReview[] {
  const serializedServerData = html.match(SERIALIZED_SERVER_DATA_PATTERN)?.[1];

  if (!serializedServerData) {
    return [];
  }

  let pageData: unknown;

  try {
    pageData = JSON.parse(serializedServerData);
  } catch {
    return [];
  }

  const pageReviews: AppStorePageReview[] = [];
  const seenReviewIds = new Set<string>();
  walkForReviews(pageData, pageReviews);

  return pageReviews.flatMap((review, index) => {
    const rating = toRating(review.rating);
    const title = toStringValue(review.title);
    const body = toStringValue(review.contents);

    if (!rating || (!title && !body)) {
      return [];
    }

    const id = toStringValue(review.id) || `app-store-page-review-${index + 1}`;

    if (seenReviewIds.has(id)) {
      return [];
    }

    seenReviewIds.add(id);

    return [
      {
        id,
        source: 'app-store-live',
        rating,
        title,
        body,
        date: toStringValue(review.date),
        appVersion: 'unknown'
      }
    ];
  });
}
