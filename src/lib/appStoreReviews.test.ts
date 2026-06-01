import {
  buildCustomerReviewsUrl,
  fetchAppStoreReviews,
  filterReviewsByTimeWindow,
  parseAppStoreUrl,
  parseCustomerReviewFeed
} from './appStoreReviews';

const feed = {
  feed: {
    entry: [
      {
        id: { label: '14123073783' },
        updated: { label: '2026-05-30T04:55:17-07:00' },
        'im:rating': { label: '2' },
        'im:version': { label: '7.5.61' },
        title: { label: '图片AI' },
        content: { label: '更多图片全部是AI' }
      },
      {
        id: { label: 'metadata-without-rating' },
        title: { label: 'ABC Reading' }
      },
      {
        id: { label: '14119648406' },
        updated: { label: '2026-04-01T07:22:54-07:00' },
        'im:rating': { label: '5' },
        'im:version': { label: '7.5.60' },
        title: { label: '孩子听力有进步' },
        content: { label: '坚持读了一段时间，听力和词汇明显有进步。' }
      }
    ]
  }
};

describe('parseAppStoreUrl', () => {
  it('extracts the app id and country from a public App Store URL', () => {
    expect(
      parseAppStoreUrl(
        'https://apps.apple.com/cn/app/abc-reading-raz%E5%8E%9F%E7%89%88%E7%8B%AC%E5%AE%B6%E6%8E%88%E6%9D%83%E7%BB%98%E6%9C%AC%E9%98%85%E8%AF%BB%E5%85%A8%E7%B3%BB%E5%88%97/id1338646799'
      )
    ).toEqual({ appId: '1338646799', country: 'cn' });
  });

  it('builds the public customer-review RSS URL', () => {
    expect(buildCustomerReviewsUrl({ appId: '1338646799', country: 'cn' })).toBe(
      'https://itunes.apple.com/cn/rss/customerreviews/page=1/id=1338646799/sortBy=mostRecent/json'
    );
    expect(buildCustomerReviewsUrl({ appId: '1338646799', country: 'cn' }, 3)).toBe(
      'https://itunes.apple.com/cn/rss/customerreviews/page=3/id=1338646799/sortBy=mostRecent/json'
    );
  });
});

describe('parseCustomerReviewFeed', () => {
  it('maps Apple RSS entries into normalized raw review records', () => {
    expect(parseCustomerReviewFeed(feed)).toEqual([
      {
        id: '14123073783',
        source: 'app-store-live',
        rating: 2,
        title: '图片AI',
        body: '更多图片全部是AI',
        date: '2026-05-30T04:55:17-07:00',
        appVersion: '7.5.61'
      },
      {
        id: '14119648406',
        source: 'app-store-live',
        rating: 5,
        title: '孩子听力有进步',
        body: '坚持读了一段时间，听力和词汇明显有进步。',
        date: '2026-04-01T07:22:54-07:00',
        appVersion: '7.5.60'
      }
    ]);
  });

  it('filters reviews to the selected time window', () => {
    const reviews = parseCustomerReviewFeed(feed);

    expect(filterReviewsByTimeWindow(reviews, 'all', new Date('2026-06-01T00:00:00.000Z'))).toHaveLength(2);
    expect(filterReviewsByTimeWindow(reviews, 'may-2026', new Date('2026-06-01T00:00:00.000Z'))).toHaveLength(1);
    expect(filterReviewsByTimeWindow(reviews, 'last-90', new Date('2026-06-01T00:00:00.000Z'))).toHaveLength(2);
  });
});

describe('fetchAppStoreReviews', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses the local App Store page proxy when embedded page reviews are available', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        feedUrl: 'https://apps.apple.com/cn/app/example/id1338646799',
        reviews: parseCustomerReviewFeed(feed)
      })
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchAppStoreReviews(
      'https://apps.apple.com/cn/app/example/id1338646799',
      'all',
      new Date('2026-06-01T00:00:00.000Z')
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/app-store-reviews?appUrl=https%3A%2F%2Fapps.apple.com%2Fcn%2Fapp%2Fexample%2Fid1338646799',
      expect.anything()
    );
    expect(result.sourceKind).toBe('app-store-page');
    expect(result.fetchedReviews).toHaveLength(2);
    expect(result.reviews).toHaveLength(2);
    expect(result.fetchedPageCount).toBe(1);
    expect(result.maxPages).toBe(1);
  });

  it('fetches paginated Apple RSS review pages and filters the analyzed time window', async () => {
    const mayEntries = Array.from({ length: 50 }, (_, index) => ({
      id: { label: `may-${index}` },
      updated: { label: `2026-05-${String((index % 28) + 1).padStart(2, '0')}T04:00:00-07:00` },
      'im:rating': { label: '2' },
      'im:version': { label: '7.5.61' },
      title: { label: `May issue ${index}` },
      content: { label: 'May review body' }
    }));
    const olderEntries = [
      {
        id: { label: 'older-1' },
        updated: { label: '2026-04-02T04:00:00-07:00' },
        'im:rating': { label: '5' },
        'im:version': { label: '7.5.60' },
        title: { label: 'Older praise' },
        content: { label: 'Older review body' }
      },
      {
        id: { label: 'older-2' },
        updated: { label: '2026-03-15T04:00:00-07:00' },
        'im:rating': { label: '1' },
        'im:version': { label: '7.5.59' },
        title: { label: 'Older complaint' },
        content: { label: 'Older complaint body' }
      }
    ];
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({})
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ feed: { entry: mayEntries } })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ feed: { entry: olderEntries } })
      });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchAppStoreReviews(
      'https://apps.apple.com/cn/app/example/id1338646799',
      'may-2026',
      new Date('2026-06-01T00:00:00.000Z')
    );

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/app-store-reviews?appUrl=https%3A%2F%2Fapps.apple.com%2Fcn%2Fapp%2Fexample%2Fid1338646799',
      expect.anything()
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://itunes.apple.com/cn/rss/customerreviews/page=1/id=1338646799/sortBy=mostRecent/json',
      expect.anything()
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      'https://itunes.apple.com/cn/rss/customerreviews/page=2/id=1338646799/sortBy=mostRecent/json',
      expect.anything()
    );
    expect(result.sourceKind).toBe('apple-rss');
    expect(result.fetchedReviews).toHaveLength(52);
    expect(result.reviews).toHaveLength(50);
    expect(result.fetchedPageCount).toBe(2);
  });
});
