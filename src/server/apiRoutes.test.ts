import appStoreReviewsHandler from '../../api/app-store-reviews';
import semanticAnalysisHandler from '../../api/semantic-analysis';
import type { RawReview } from '../domain/types';

const appUrl = 'https://apps.apple.com/cn/app/example/id1338646799';

const rawReview: RawReview = {
  id: 'r1',
  source: 'app-store-live',
  rating: 5,
  title: '孩子听力有进步',
  body: '孩子读了一段时间绘本之后，发现听力有一些进步。',
  date: '2026-05-20T00:00:00.000Z',
  appVersion: '1.0.0'
};

function createResponse() {
  const response = {
    statusCode: 200,
    body: undefined as unknown,
    setHeader: vi.fn(),
    end: vi.fn((body: unknown) => {
      response.body = body;
      return response;
    }),
    status: vi.fn((statusCode: number) => {
      response.statusCode = statusCode;
      return response;
    }),
    json: vi.fn((body: unknown) => {
      response.body = body;
      return response;
    })
  };

  return response;
}

function responseBody(response: ReturnType<typeof createResponse>) {
  return typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
}

describe('Vercel API routes', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('serves embedded App Store page reviews from the production API route', async () => {
    const html = `
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
                  "rating": 5
                }
              ]
            }
          ]
        }
      </script>
    `;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => html
    });
    vi.stubGlobal('fetch', fetchMock);
    const response = createResponse();

    await appStoreReviewsHandler({ query: { appUrl } }, response);

    expect(response.statusCode).toBe(200);
    expect(responseBody(response)).toEqual({
      feedUrl: appUrl,
      reviews: [
        {
          id: '6032372550',
          source: 'app-store-live',
          rating: 5,
          title: '不能打卡',
          body: '直接跳到下一步，分享以后也不计入打卡日期。',
          date: '2020-06-04T02:40:09.000Z',
          appVersion: 'unknown'
        }
      ]
    });
    expect(fetchMock).toHaveBeenCalledWith(
      appUrl,
      expect.objectContaining({
        headers: expect.objectContaining({
          'Accept-Language': expect.stringContaining('zh-CN'),
          'User-Agent': expect.stringContaining('Mozilla')
        })
      })
    );
  });

  it('serves semantic analysis through the production API route', async () => {
    vi.stubEnv('OPENAI_API_KEY', 'test-key');
    const semanticDraft = {
      reviewSignals: [
        {
          reviewId: 'r1',
          labels: ['delight'],
          sentiment: 'positive',
          urgency: 'low',
          quote: '孩子听力有进步: 孩子读了一段时间绘本之后，发现听力有一些进步。'
        }
      ],
      clusters: [
        {
          id: 'learning-progress',
          name: '被验证的学习进步',
          description: '家长明确反馈孩子在绘本阅读后听力进步。',
          labels: ['delight'],
          reviewIds: ['r1'],
          representativeReviewIds: ['r1'],
          suspectedUserScenario: '家长观察孩子是否真的学有进展。'
        }
      ],
      roadmapCards: [
        {
          type: 'fix',
          clusterId: 'learning-progress',
          title: '保护学习进步证据',
          recommendation: '先保护已验证的学习价值表达。',
          targetMetric: '提高学习进步相关正向评论占比。',
          validationExperiment: '测试更清晰的学习进步反馈。',
          risks: '需要避免报告信息过重。'
        },
        {
          type: 'improve',
          clusterId: 'learning-progress',
          title: '放大学习进步反馈',
          recommendation: '让家长更容易看到孩子进步。',
          targetMetric: '提升报告查看后的复访。',
          validationExperiment: 'A/B 测试轻量进步说明。',
          risks: '不要引入不必要的理解成本。'
        },
        {
          type: 'explore',
          clusterId: 'learning-progress',
          title: '验证家长证明需求',
          recommendation: '先验证是否需要更细的进步解释。',
          targetMetric: '提升进步报告点击率。',
          validationExperiment: '访谈家长并测试原型。',
          risks: '过早完整化可能偏离真实需求。'
        }
      ]
    };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ output_text: JSON.stringify(semanticDraft) })
    });
    vi.stubGlobal('fetch', fetchMock);
    const response = createResponse();

    await semanticAnalysisHandler({ method: 'POST', body: { reviews: [rawReview], language: 'zh' } }, response);

    expect(response.statusCode).toBe(200);
    expect(responseBody(response)).toEqual({ semanticAnalysis: semanticDraft });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/responses',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-key'
        })
      })
    );
  });
});
