import { fetchAppStorePageReviewPayload, AppStorePageApiError } from '../src/server/appStoreReviewsApi';
import { queryValue, sendJson } from '../src/server/http';

export default async function handler(request: any, response: any) {
  const appUrl =
    queryValue(request.query?.appUrl) ||
    new URL(request.url ?? '/', 'http://localhost').searchParams.get('appUrl') ||
    '';

  if (!appUrl) {
    sendJson(response, 400, { error: 'Missing appUrl query parameter.' });
    return;
  }

  try {
    sendJson(response, 200, await fetchAppStorePageReviewPayload(appUrl));
  } catch (error) {
    sendJson(response, error instanceof AppStorePageApiError ? error.statusCode : 502, {
      error: error instanceof Error ? error.message : 'Failed to read App Store page.'
    });
  }
}
