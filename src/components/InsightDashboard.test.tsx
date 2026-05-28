import { screen } from '@testing-library/react';
import { sampleReviews } from '../data/sampleReviews';
import { analyzeReviews } from '../lib/analysis/pipeline';
import { renderApp } from '../test/render';
import { InsightDashboard } from './InsightDashboard';

describe('InsightDashboard', () => {
  it('renders theme distribution and evidence quotes', () => {
    const analysis = analyzeReviews(sampleReviews, '2026-05-28T08:00:00.000Z');

    renderApp(<InsightDashboard analysis={analysis} />);

    expect(screen.getByRole('heading', { name: /Review intelligence/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Reliability and data-loss issues/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Crashes during long drafts/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sentiment by theme/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Representative review evidence/i)).toBeInTheDocument();
  });

  it('renders an empty state for analysis without reviews', () => {
    const analysis = analyzeReviews([], '2026-05-28T08:00:00.000Z');

    renderApp(<InsightDashboard analysis={analysis} />);

    expect(screen.getByText(/No rating yet/i)).toBeInTheDocument();
    expect(screen.getByText(/No review evidence available yet/i)).toBeInTheDocument();
    expect(screen.queryByText(/NaN avg rating/i)).not.toBeInTheDocument();
  });
});
