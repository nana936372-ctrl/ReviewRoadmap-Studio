import type { RawReview, TimeWindow } from '../domain/types';

export interface AppStoreIdentity {
  appId: string;
  country: string;
}

export interface AppStoreReviewFetchResult {
  feedUrl: string;
  identity: AppStoreIdentity;
  fetchedPageCount: number;
  fetchedReviews: RawReview[];
  maxPages: number;
  reviews: RawReview[];
  sourceKind: 'app-store-page' | 'apple-rss';
}

type AppStorePageProxyResponse = {
  feedUrl?: unknown;
  reviews?: unknown;
};

type AppleFeedLabel = {
  label?: unknown;
};

type AppleFeedEntry = Record<string, unknown>;

type AppleCustomerReviewFeed = {
  feed?: {
    entry?: AppleFeedEntry | AppleFeedEntry[];
  };
};

const MAY_2026_START = Date.parse('2026-05-01T00:00:00.000Z');
const JUNE_2026_START = Date.parse('2026-06-01T00:00:00.000Z');
const DAY_MS = 24 * 60 * 60 * 1000;
const APPLE_RSS_PAGE_SIZE = 50;
const MAX_REVIEW_PAGES = 10;

function getLabel(value: unknown): string {
  if (typeof value === 'string') return value;

  if (value && typeof value === 'object' && 'label' in value) {
    const label = (value as AppleFeedLabel).label;
    return typeof label === 'string' ? label : '';
  }

  return '';
}

function getEntryLabel(entry: AppleFeedEntry, key: string): string {
  return getLabel(entry[key]);
}

function toRating(value: string): RawReview['rating'] | null {
  const rating = Number(value);

  if ([1, 2, 3, 4, 5].includes(rating)) {
    return rating as RawReview['rating'];
  }

  return null;
}

function isInRange(date: string, startMs: number, endMs: number): boolean {
  const dateMs = Date.parse(date);
  return Number.isFinite(dateMs) && dateMs >= startMs && dateMs < endMs;
}

export function parseAppStoreUrl(input: string): AppStoreIdentity {
  const appId = input.match(/(?:\/|^)id(\d+)(?:[/?#]|$)/)?.[1] ?? input.match(/[?&]id=(\d+)/)?.[1];

  if (!appId) {
    throw new Error('Enter an App Store URL that includes an app id, such as id1338646799.');
  }

  try {
    const url = new URL(input);
    const firstPathPart = url.pathname.split('/').filter(Boolean)[0];
    const country = firstPathPart && /^[a-z]{2}$/i.test(firstPathPart) ? firstPathPart.toLowerCase() : 'us';

    return { appId, country };
  } catch {
    return { appId, country: 'us' };
  }
}

export function buildCustomerReviewsUrl({ appId, country }: AppStoreIdentity, page = 1): string {
  const safePage = Math.max(1, Math.min(MAX_REVIEW_PAGES, Math.floor(page)));
  const safeCountry = country || 'us';

  return `https://itunes.apple.com/${encodeURIComponent(safeCountry)}/rss/customerreviews/page=${safePage}/id=${encodeURIComponent(
    appId
  )}/sortBy=mostRecent/json`;
}

export function parseCustomerReviewFeed(feed: unknown): RawReview[] {
  const entries = (feed as AppleCustomerReviewFeed).feed?.entry;
  const entryList = Array.isArray(entries) ? entries : entries ? [entries] : [];

  return entryList.flatMap((entry, index) => {
    const rating = toRating(getEntryLabel(entry, 'im:rating'));

    if (!rating) {
      return [];
    }

    const title = getEntryLabel(entry, 'title');
    const body = getEntryLabel(entry, 'content');

    if (!title && !body) {
      return [];
    }

    return [
      {
        id: getEntryLabel(entry, 'id') || `app-store-review-${index + 1}`,
        source: 'app-store-live',
        rating,
        title,
        body,
        date: getEntryLabel(entry, 'updated'),
        appVersion: getEntryLabel(entry, 'im:version') || 'unknown'
      }
    ];
  });
}

export function filterReviewsByTimeWindow(
  reviews: RawReview[],
  timeWindow: TimeWindow,
  now: Date = new Date()
): RawReview[] {
  if (timeWindow === 'all') {
    return reviews;
  }

  if (timeWindow === 'may-2026') {
    return reviews.filter((review) => isInRange(review.date, MAY_2026_START, JUNE_2026_START));
  }

  const intervalDays = timeWindow === 'last-30' ? 30 : 90;
  const endMs = now.getTime() + DAY_MS;
  const startMs = now.getTime() - intervalDays * DAY_MS;

  return reviews.filter((review) => isInRange(review.date, startMs, endMs));
}

function isRawReview(value: unknown): value is RawReview {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const review = value as RawReview;
  return (
    typeof review.id === 'string' &&
    review.source === 'app-store-live' &&
    [1, 2, 3, 4, 5].includes(review.rating) &&
    typeof review.title === 'string' &&
    typeof review.body === 'string' &&
    typeof review.date === 'string' &&
    typeof review.appVersion === 'string'
  );
}

async function fetchAppStorePageProxy(
  appUrl: string,
  identity: AppStoreIdentity,
  timeWindow: TimeWindow,
  now: Date
): Promise<AppStoreReviewFetchResult | null> {
  const response = await fetch(`/api/app-store-reviews?appUrl=${encodeURIComponent(appUrl)}`, {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as AppStorePageProxyResponse;
  const fetchedReviews = Array.isArray(payload.reviews) ? payload.reviews.filter(isRawReview) : [];

  if (fetchedReviews.length === 0) {
    return null;
  }

  return {
    feedUrl: typeof payload.feedUrl === 'string' ? payload.feedUrl : appUrl,
    fetchedPageCount: 1,
    identity,
    fetchedReviews,
    maxPages: 1,
    reviews: filterReviewsByTimeWindow(fetchedReviews, timeWindow, now),
    sourceKind: 'app-store-page'
  };
}

export async function fetchAppStoreReviews(
  appUrl: string,
  timeWindow: TimeWindow,
  now: Date = new Date()
): Promise<AppStoreReviewFetchResult> {
  const identity = parseAppStoreUrl(appUrl);
  const pageProxyResult = await fetchAppStorePageProxy(appUrl, identity, timeWindow, now).catch(() => null);

  if (pageProxyResult) {
    return pageProxyResult;
  }

  const fetchedReviews: RawReview[] = [];
  const seenReviewIds = new Set<string>();
  let fetchedPageCount = 0;
  let feedUrl = buildCustomerReviewsUrl(identity, 1);

  for (let page = 1; page <= MAX_REVIEW_PAGES; page += 1) {
    feedUrl = buildCustomerReviewsUrl(identity, page);

    const response = await fetch(feedUrl, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Apple review feed returned ${response.status}.`);
    }

    fetchedPageCount = page;

    const feed = await response.json();
    const pageReviews = parseCustomerReviewFeed(feed);

    for (const review of pageReviews) {
      if (seenReviewIds.has(review.id)) {
        continue;
      }

      seenReviewIds.add(review.id);
      fetchedReviews.push(review);
    }

    if (pageReviews.length < APPLE_RSS_PAGE_SIZE) {
      break;
    }
  }

  return {
    feedUrl,
    fetchedPageCount,
    identity,
    fetchedReviews,
    maxPages: MAX_REVIEW_PAGES,
    reviews: filterReviewsByTimeWindow(fetchedReviews, timeWindow, now),
    sourceKind: 'apple-rss'
  };
}
