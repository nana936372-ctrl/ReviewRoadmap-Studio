import { parseAppStorePageReviews } from './appStorePageReviews';

describe('parseAppStorePageReviews', () => {
  it('extracts embedded App Store page review records from serialized server data', () => {
    const html = `
      <html>
        <body>
          <script type="application/json" id="serialized-server-data">
            {
              "data": [
                {
                  "$kind": "ReviewsPage",
                  "items": [
                    {
                      "$kind": "Review",
                      "id": "6032372550",
                      "title": "不能打卡",
                      "date": "2020-06-04T02:40:09.000Z",
                      "contents": "直接跳到下一步，分享以后也不计入打卡日期。",
                      "rating": 5,
                      "reviewerName": "筱伊"
                    },
                    {
                      "$kind": "Review",
                      "id": "5269676428",
                      "title": "孩子听力有进步",
                      "date": "2019-12-14T02:10:54.000Z",
                      "contents": "孩子读了一段时间绘本之后，发现听力有一些进步。",
                      "rating": 5,
                      "reviewerName": "灬无邪"
                    },
                    {
                      "$kind": "Review",
                      "id": "metadata",
                      "title": "ignored",
                      "date": "2019-12-14T02:10:54.000Z",
                      "contents": "no rating",
                      "rating": 0
                    }
                  ]
                }
              ]
            }
          </script>
        </body>
      </html>
    `;

    expect(parseAppStorePageReviews(html)).toEqual([
      {
        id: '6032372550',
        source: 'app-store-live',
        rating: 5,
        title: '不能打卡',
        body: '直接跳到下一步，分享以后也不计入打卡日期。',
        date: '2020-06-04T02:40:09.000Z',
        appVersion: 'unknown'
      },
      {
        id: '5269676428',
        source: 'app-store-live',
        rating: 5,
        title: '孩子听力有进步',
        body: '孩子读了一段时间绘本之后，发现听力有一些进步。',
        date: '2019-12-14T02:10:54.000Z',
        appVersion: 'unknown'
      }
    ]);
  });
});
