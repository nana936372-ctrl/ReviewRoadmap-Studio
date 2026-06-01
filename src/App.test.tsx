import { fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import App from './App';
import { renderApp } from './test/render';

const liveReviews = [
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
    rating: 1,
    title: '收费高',
    body: '会员价格太贵，孩子刚开始用就遇到付费限制。',
    date: '2026-05-29T07:22:54-07:00',
    appVersion: '7.5.61'
  },
  {
    id: '123456789',
    source: 'app-store-live',
    rating: 5,
    title: '孩子听力有进步',
    body: '孩子读了一段时间绘本之后，发现听力有一些进步。',
    date: '2020-06-04T07:22:54-07:00',
    appVersion: '6.2.0'
  }
] as const;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('App', () => {
  it('renders the input workflow and generated analysis sections', () => {
    renderApp(<App />);
    const appUrlInput = screen.getByLabelText(/App Store URL/i);

    expect(screen.getByRole('heading', { name: /ReviewRoadmap Studio/i })).toBeInTheDocument();
    expect(appUrlInput).toHaveAttribute('type', 'url');
    expect(appUrlInput).toHaveAttribute('inputmode', 'url');
    expect(appUrlInput).toHaveValue('https://apps.apple.com/app/draftly-ai-writing/id0000000000');
    expect(screen.getByText(/Data controls/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toHaveValue('ai-writing');
    expect(screen.getByLabelText(/Time window/i)).toHaveValue('all');
    expect(screen.getByRole('button', { name: /Analyze Reviews/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View all reviews/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download brief/i })).toBeInTheDocument();
    expect(screen.getByText(/18 reviews analyzed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Top decision/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Fix draft recovery and export failure points/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /Review intelligence/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Signal map/i)).toBeInTheDocument();
    expect(screen.getByText(/Decision memo/i)).toBeInTheDocument();
    expect(screen.queryByText(/Priority formula/i)).not.toBeInTheDocument();

    fireEvent.change(appUrlInput, { target: { value: 'https://apps.apple.com/app/example/id1234567890' } });

    expect(appUrlInput).toHaveValue('https://apps.apple.com/app/example/id1234567890');
  });

  it('opens an all fetched reviews page for the prepared sample', () => {
    renderApp(<App />);

    fireEvent.click(screen.getByRole('button', { name: /View all reviews/i }));

    expect(screen.getByRole('heading', { name: /All fetched reviews/i })).toBeInTheDocument();
    expect(screen.getByText(/18 fetched reviews/i)).toBeInTheDocument();
    expect(screen.getByText(/18 used in analysis/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Finally finished my weekly newsletter/i })).toBeInTheDocument();
    expect(screen.getByText(/The outline suggestions saved me hours/i)).toBeInTheDocument();
    expect(screen.getAllByText(/app-store-sample/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: /Back to overview/i }));

    expect(screen.getByRole('heading', { name: /Roadmap decisions/i })).toBeInTheDocument();
  });

  it('fetches and analyzes live App Store reviews from a real app URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        feedUrl: 'https://apps.apple.com/cn/app/example/id1338646799',
        reviews: liveReviews
      })
    });
    vi.stubGlobal('fetch', fetchMock);

    renderApp(<App />);

    fireEvent.change(screen.getByLabelText(/App Store URL/i), {
      target: {
        value:
          'https://apps.apple.com/cn/app/abc-reading-raz%E5%8E%9F%E7%89%88%E7%8B%AC%E5%AE%B6%E6%8E%88%E6%9D%83%E7%BB%98%E6%9C%AC%E9%98%85%E8%AF%BB%E5%85%A8%E7%B3%BB%E5%88%97/id1338646799'
      }
    });
    fireEvent.click(screen.getByRole('button', { name: /Analyze Reviews/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/app-store-reviews'),
        expect.objectContaining({
          headers: expect.objectContaining({ Accept: 'application/json' })
        })
      );
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('appUrl='),
      expect.anything()
    );
    expect(await screen.findByText(/Live App Store reviews/i)).toBeInTheDocument();
    expect(screen.getByText(/3 fetched from App Store page data; 3 matched All fetched reviews/i)).toBeInTheDocument();
    expect(screen.getByText(/3 reviews analyzed/i)).toBeInTheDocument();
    expect(screen.getAllByText(/图片AI/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/收费高/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: /View all reviews/i }));

    expect(screen.getByText(/3 fetched reviews/i)).toBeInTheDocument();
    expect(screen.getByText(/3 used in analysis/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /孩子听力有进步/i })).toBeInTheDocument();
    expect(screen.getByText(/2020-06-04/i)).toBeInTheDocument();
  });

  it('uses LLM semantic analysis when live reviews are available', async () => {
    const fetchMock = vi.fn((url: string | URL | Request) => {
      const requestUrl = String(url);

      if (requestUrl.includes('/api/semantic-analysis')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            semanticAnalysis: {
              reviewSignals: [
                {
                  reviewId: '123456789',
                  labels: ['delight'],
                  sentiment: 'positive',
                  urgency: 'low',
                  quote: '孩子听力有进步: 孩子读了一段时间绘本之后，发现听力有一些进步。'
                }
              ],
              clusters: [
                {
                  id: 'learning-progress',
                  name: '家长感知到学习进步',
                  description: '家长明确提到孩子听力或词汇能力变好。',
                  labels: ['delight'],
                  reviewIds: ['123456789'],
                  representativeReviewIds: ['123456789'],
                  suspectedUserScenario: '家长希望确认孩子使用后真的有进步。'
                }
              ],
              roadmapCards: [
                {
                  type: 'fix',
                  clusterId: 'learning-progress',
                  title: '先复核学习进步证据',
                  recommendation: '没有明确故障证据时，不把正向学习反馈包装成修复项。',
                  targetMetric: '跟踪明确学习问题评论占比。',
                  validationExperiment: '先人工复核相关原始评论。',
                  risks: '避免把正向价值误解成质量缺陷。'
                },
                {
                  type: 'improve',
                  clusterId: 'learning-progress',
                  title: '放大家长可感知的学习进步反馈',
                  recommendation: '把听力进步等正向价值转化成更清晰的家长反馈。',
                  targetMetric: '提升提到学习进步的正向评论占比。',
                  validationExperiment: '测试一版轻量学习进步报告。',
                  risks: '反馈过重会增加理解成本。'
                },
                {
                  type: 'explore',
                  clusterId: 'learning-progress',
                  title: '验证家长是否需要进步证明',
                  recommendation: '先验证家长是否需要更细的学习进步解释。',
                  targetMetric: '提升进步报告点击后的复访率。',
                  validationExperiment: 'A/B 测试轻量说明入口。',
                  risks: '过早建设完整报告可能偏离真实需求。'
                }
              ]
            }
          })
        });
      }

      return Promise.resolve({
        ok: true,
        json: async () => ({
          feedUrl: 'https://apps.apple.com/cn/app/example/id1338646799',
          reviews: liveReviews
        })
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    renderApp(<App />);

    fireEvent.change(screen.getByLabelText(/App Store URL/i), {
      target: { value: 'https://apps.apple.com/cn/app/example/id1338646799' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Analyze Reviews/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/semantic-analysis',
        expect.objectContaining({ method: 'POST' })
      );
    });
    expect((await screen.findAllByText(/家长感知到学习进步/i)).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/放大家长可感知的学习进步反馈/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/没有明确故障证据时，不把正向学习反馈包装成修复项。/i).length).toBeGreaterThan(0);
  });

  it('falls back to the prepared sample when no real reviews are available', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        feedUrl: 'https://apps.apple.com/cn/app/example/id1338646799',
        reviews: []
      })
    });
    vi.stubGlobal('fetch', fetchMock);

    renderApp(<App />);

    fireEvent.change(screen.getByLabelText(/App Store URL/i), {
      target: { value: 'https://apps.apple.com/cn/app/example/id1338646799' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Analyze Reviews/i }));

    expect(await screen.findByText(/No reviews in selected window/i)).toBeInTheDocument();
    expect(screen.getByText(/18 reviews analyzed/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Fix draft recovery and export failure points/i).length).toBeGreaterThan(0);
  });

  it('opens a focused score detail page from a roadmap score', () => {
    renderApp(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Explain priority score: 80/i }));

    expect(screen.getByRole('heading', { name: /Priority score details/i })).toBeInTheDocument();
    expect(screen.getByText(/Priority formula/i)).toBeInTheDocument();
    expect(screen.getByText(/Factor contribution/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommendation dimensions/i)).toBeInTheDocument();
    expect(screen.getByText(/Metric dimensions/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Back to overview/i }));

    expect(screen.getByRole('heading', { name: /Roadmap decisions/i })).toBeInTheDocument();
  });

  it('opens a calculation guide from the hero help button', () => {
    renderApp(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Open calculation guide/i }));

    expect(screen.getByRole('heading', { name: /Calculation guide/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Rating formula/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Confidence/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Priority score/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Sentiment meter/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Brief evaluation/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Unified formula: rating total \/ review count/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Initial confidence: 40% structured public-review baseline \+ 10% star rating \+ 8% quotable text \+ 4% product signal = 62%/i)).toBeInTheDocument();
    expect(screen.getByText(/frequency 22% \+ severity 28%/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Back to overview/i }));

    expect(screen.getByRole('heading', { name: /Roadmap decisions/i })).toBeInTheDocument();
  });

  it('shows the unified formulas in Chinese calculation guide', () => {
    renderApp(<App />);

    fireEvent.click(screen.getByRole('button', { name: /中文/i }));
    fireEvent.click(screen.getByRole('button', { name: /打开计算说明/i }));

    expect(screen.getByRole('heading', { name: /评分统一公式/i })).toBeInTheDocument();
    expect(screen.getAllByText(/统一公式：评分总和 \/ 评论数/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/初始置信度：结构化公开评论基线 40% \+ 星级评分 10% \+ 可引用文本 8% \+ 产品信号匹配 4% = 62%/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/当前：min\(95%, 62% \+ 5 x 10%\) = 95%/i)).toBeInTheDocument();
  });

  it('switches the product interface to Chinese', () => {
    renderApp(<App />);

    fireEvent.click(screen.getByRole('button', { name: /中文/i }));

    expect(screen.getByRole('button', { name: /打开计算说明/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /查看全部评论/i })).toBeInTheDocument();
    expect(screen.getByText(/把杂乱的 App Store 评论转化为洞察聚类/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/首要决策/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /分析 App Store 评论/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /评论智能分析/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/信号地图/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /路线图决策/i })).toBeInTheDocument();
    expect(screen.getAllByText(/修复草稿恢复与导出失败点/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/决策备忘录/i)).toBeInTheDocument();
    expect(screen.getAllByText(/评估维度/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/优先级公式/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/评估方式/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /下载 Brief/i })).toBeInTheDocument();
  });

  it('opens the review list page in Chinese', () => {
    renderApp(<App />);

    fireEvent.click(screen.getByRole('button', { name: /中文/i }));
    fireEvent.click(screen.getByRole('button', { name: /查看全部评论/i }));

    expect(screen.getByRole('heading', { name: /全部获取评论/i })).toBeInTheDocument();
    expect(screen.getByText(/已获取 18 条评论/i)).toBeInTheDocument();
    expect(screen.getByText(/用于分析 18 条/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /返回总览/i })).toBeInTheDocument();
  });
});
