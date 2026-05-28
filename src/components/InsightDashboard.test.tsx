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
    expect(screen.getByText(/Reliability and data-loss issues/i)).toBeInTheDocument();
    expect(screen.getByText(/Crashes during long drafts/i)).toBeInTheDocument();
  });
});
