import { fireEvent, screen } from '@testing-library/react';
import { sampleReviews } from '../data/sampleReviews';
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
    expect(screen.getByText(/Fix draft recovery and export failure points/i)).toBeInTheDocument();
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

    expect(screen.getByText(/用户反馈核心操作失败、异常、卡顿或结果不可信/i)).toBeInTheDocument();
    expect(screen.getByText(/决策备忘录/i)).toBeInTheDocument();
    expect(screen.getByText(/为什么现在做/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /成功指标/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /下一步行动/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /评估维度/i })).toBeInTheDocument();
    expect(screen.queryByText(/用户希望产品补齐明确能力、支持现有流程/i)).not.toBeInTheDocument();
  });
});
