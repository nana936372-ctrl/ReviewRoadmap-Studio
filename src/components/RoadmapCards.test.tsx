import { screen } from '@testing-library/react';
import { sampleReviews } from '../data/sampleReviews';
import { appCopy } from '../i18n/copy';
import { analyzeReviews } from '../lib/analysis/pipeline';
import { renderApp } from '../test/render';
import { DecisionBrief } from './DecisionBrief';
import { RoadmapCards } from './RoadmapCards';

describe('RoadmapCards', () => {
  it('renders all roadmap decision types with evidence', () => {
    const analysis = analyzeReviews(sampleReviews, '2026-05-28T08:00:00.000Z');

    renderApp(<RoadmapCards cards={analysis.roadmapCards} copy={appCopy.en.roadmap} />);

    expect(screen.getByText('Fix')).toBeInTheDocument();
    expect(screen.getByText('Improve')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText(/Stabilize draft saving/i)).toBeInTheDocument();
    expect(screen.getByText(/Users trying to finish important writing work/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Business impact/i)).toHaveLength(analysis.roadmapCards.length);
    expect(screen.getAllByText(/95% confidence/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Validation experiment/i)).toHaveLength(analysis.roadmapCards.length);
  });

  it('renders an empty state without the roadmap grid when there are no cards', () => {
    renderApp(<RoadmapCards cards={[]} copy={appCopy.en.roadmap} />);

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

    expect(screen.getByText(/用户反馈崩溃、导出失败、同步异常或作品丢失/i)).toBeInTheDocument();
    expect(screen.queryByText(/用户希望增加导出、规划视图、可复用设置/i)).not.toBeInTheDocument();
  });
});
