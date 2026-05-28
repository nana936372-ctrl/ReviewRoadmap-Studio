import { screen } from '@testing-library/react';
import { sampleReviews } from '../data/sampleReviews';
import { analyzeReviews } from '../lib/analysis/pipeline';
import { renderApp } from '../test/render';
import { DecisionBrief } from './DecisionBrief';
import { RoadmapCards } from './RoadmapCards';

describe('RoadmapCards', () => {
  it('renders all roadmap decision types with evidence', () => {
    const analysis = analyzeReviews(sampleReviews, '2026-05-28T08:00:00.000Z');

    renderApp(<RoadmapCards cards={analysis.roadmapCards} />);

    expect(screen.getByText('Fix')).toBeInTheDocument();
    expect(screen.getByText('Improve')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText(/Stabilize draft saving/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Validation experiment/i)).toHaveLength(analysis.roadmapCards.length);
  });

  it('renders an empty state without the roadmap grid when there are no cards', () => {
    renderApp(<RoadmapCards cards={[]} />);

    expect(
      screen.getByText(/No roadmap decisions yet. Add review evidence to generate recommendations./i)
    ).toBeInTheDocument();
    expect(document.querySelector('.roadmap-grid')).not.toBeInTheDocument();
  });
});

describe('DecisionBrief', () => {
  it('renders an empty state when no roadmap decision is available', () => {
    const analysis = analyzeReviews([], '2026-05-28T08:00:00.000Z');

    renderApp(<DecisionBrief analysis={analysis} />);

    expect(screen.getByText(/No decision brief yet/i)).toBeInTheDocument();
  });
});
