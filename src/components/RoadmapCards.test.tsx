import { fireEvent, screen } from '@testing-library/react';
import { sampleReviews } from '../data/sampleReviews';
import type { RawReview } from '../domain/types';
import { appCopy } from '../i18n/copy';
import { analyzeReviews } from '../lib/analysis/pipeline';
import { renderApp } from '../test/render';
import { DecisionBrief } from './DecisionBrief';
import { RoadmapCards } from './RoadmapCards';

describe('RoadmapCards', () => {
  it('renders all roadmap decision types with evidence', () => {
    const analysis = analyzeReviews(sampleReviews, '2026-05-28T08:00:00.000Z');
    const onScoreSelect = vi.fn();

    renderApp(<RoadmapCards cards={analysis.roadmapCards} copy={appCopy.en.roadmap} onScoreSelect={onScoreSelect} />);

    expect(screen.getByText('Fix')).toBeInTheDocument();
    expect(screen.getByText('Improve')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getAllByText(/Fix draft recovery and export failure points/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Reduce draft-loss, recovery, or export-failure complaints/i)).toBeInTheDocument();
    expect(screen.getByText(/Users trying to complete an important task/i)).toBeInTheDocument();
    expect(screen.getAllByText(/95% confidence/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByLabelText(/min\(95%, 62% \+ 4 x 10%\) = 95%/i)).toBeInTheDocument();
    expect(screen.queryAllByLabelText(/formula/i)).toHaveLength(0);
    expect(screen.queryAllByLabelText(/structured public-review baseline/i)).toHaveLength(0);
    expect(screen.getAllByText(/Decision notes/i)).toHaveLength(analysis.roadmapCards.length);
    expect(screen.getAllByText(/Validation experiment/i)).toHaveLength(analysis.roadmapCards.length);
    expect(screen.getAllByRole('button', { name: /Explain priority score/i })).toHaveLength(analysis.roadmapCards.length);
    expect(screen.queryByText(/Priority formula/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Recommendation dimensions/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Explain priority score: 80/i }));

    expect(onScoreSelect).toHaveBeenCalledWith('fix-reliability');
  });

  it('renders an empty state without the roadmap grid when there are no cards', () => {
    renderApp(<RoadmapCards cards={[]} copy={appCopy.en.roadmap} onScoreSelect={vi.fn()} />);

    expect(
      screen.getByText(/No roadmap decisions yet. Add review evidence to generate recommendations./i)
    ).toBeInTheDocument();
    expect(document.querySelector('.roadmap-grid')).not.toBeInTheDocument();
  });
});

describe('DecisionBrief', () => {
  it('renders an empty state when no roadmap decision is available', () => {
    const analysis = analyzeReviews([], '2026-05-28T08:00:00.000Z');

    renderApp(<DecisionBrief analysis={analysis} copy={appCopy.en.brief} />);

    expect(screen.getByText(/No decision brief yet/i)).toBeInTheDocument();
  });

  it('uses the insight cluster that supports the top roadmap decision', () => {
    const analysis = analyzeReviews(sampleReviews, '2026-05-28T08:00:00.000Z', 'zh');

    renderApp(<DecisionBrief analysis={analysis} copy={appCopy.zh.brief} />);

    expect(screen.getByText(/基于当前 18 条已分析评论和 6 个洞察聚类生成/i)).toBeInTheDocument();
    expect(screen.getByText(/优先级分数 80/i)).toBeInTheDocument();
    expect(screen.getByText(/用户反馈核心操作失败、异常、卡顿或结果不可信/i)).toBeInTheDocument();
    expect(screen.getByText(/决策备忘录/i)).toBeInTheDocument();
    expect(screen.getByText(/为什么现在做/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /成功指标/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /下一步行动/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /评估维度/i })).toBeInTheDocument();
    expect(screen.queryByText(/用户希望产品补齐明确能力、支持现有流程/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/AI 写作应用/i)).not.toBeInTheDocument();
  });

  it('generates brief context and next steps from a different app review set', () => {
    const educationReviews: RawReview[] = [
      {
        id: 'abc-1',
        source: 'app-store-live',
        rating: 1,
        title: '不能打卡',
        body: '更新后打卡按钮没有了，直接跳到下一步，分享以后也不计入打卡日期。',
        date: '2020-06-04T02:40:09.000Z',
        appVersion: 'unknown'
      },
      {
        id: 'abc-2',
        source: 'app-store-live',
        rating: 2,
        title: '小队活跃规则不清楚',
        body: '小队里有人长期不打卡，队长也不能踢出，活跃规则看不懂，希望增加规则说明。',
        date: '2020-06-05T02:40:09.000Z',
        appVersion: 'unknown'
      },
      {
        id: 'abc-3',
        source: 'app-store-live',
        rating: 5,
        title: '孩子听力有进步',
        body: '孩子读了一段时间绘本之后，发现听力有一些进步，很喜欢每天阅读。',
        date: '2020-06-06T02:40:09.000Z',
        appVersion: 'unknown'
      }
    ];
    const analysis = analyzeReviews(educationReviews, '2026-06-01T00:00:00.000Z', 'zh');

    renderApp(<DecisionBrief analysis={analysis} copy={appCopy.zh.brief} />);

    expect(screen.getByText(/基于当前 3 条已分析评论/i)).toBeInTheDocument();
    expect(screen.getAllByText(/修复打卡状态与小队活跃判定异常/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/降低每 100 条评论中的打卡\/小队异常投诉数/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/执行验证实验：先在打卡与小队页增加状态校验/i)).toBeInTheDocument();
    expect(screen.queryByText(/AI 写作应用/i)).not.toBeInTheDocument();
  });
});
