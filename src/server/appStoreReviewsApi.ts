import { parseAppStorePageReviews } from '../lib/appStorePageReviews.js';

export class AppStorePageApiError extends Error {
  constructor(
    message: string,
    readonly statusCode = 502
  ) {
    super(message);
    this.name = 'AppStorePageApiError';
  }
}

export async function fetchAppStorePageReviewPayload(appUrl: string) {
  const appStoreResponse = await fetch(appUrl, {
    headers: {
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36'
    }
  });

  if (!appStoreResponse.ok) {
    throw new AppStorePageApiError(`App Store page returned ${appStoreResponse.status}.`, appStoreResponse.status);
  }

  const html = await appStoreResponse.text();

  return {
    feedUrl: appUrl,
    reviews: parseAppStorePageReviews(html)
  };
}
