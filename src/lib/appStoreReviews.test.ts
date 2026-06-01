import {
  buildCustomerReviewsUrl,
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
      'https://itunes.apple.com/rss/customerreviews/id=1338646799/sortBy=mostRecent/json?cc=cn'
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

    expect(filterReviewsByTimeWindow(reviews, 'may-2026', new Date('2026-06-01T00:00:00.000Z'))).toHaveLength(1);
    expect(filterReviewsByTimeWindow(reviews, 'last-90', new Date('2026-06-01T00:00:00.000Z'))).toHaveLength(2);
  });
});
