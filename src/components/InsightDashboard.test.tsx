import { screen } from '@testing-library/react';
import { sampleReviews } from '../data/sampleReviews';
import { appCopy } from '../i18n/copy';
import { analyzeReviews } from '../lib/analysis/pipeline';
import { renderApp } from '../test/render';
import { InsightDashboard } from './InsightDashboard';

describe('InsightDashboard', () => {
  it('renders theme distribution and evidence quotes', () => {
    const analysis = analyzeReviews(sampleReviews, '2026-05-28T08:00:00.000Z');

    renderApp(<InsightDashboard analysis={analysis} copy={appCopy.en.dashboard} />);

    expect(screen.getByRole('heading', { name: /Review intelligence/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Reliability and data-loss issues/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Crashes during long drafts/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Signal map/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Sentiment balance/i).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText(/Red means complaints, bugs, churn risk/i).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText(/Amber means mixed intent/i).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText(/Green means delight/i).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/Representative review evidence/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/54 \/ 18 = 3.0/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/min\(95%, 62% \+ 5 x 10%\) = 95%/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/17 \/ 5 = 3.4/i)).toBeInTheDocument();
    expect(screen.queryAllByLabelText(/formula/i)).toHaveLength(0);
    expect(screen.queryAllByLabelText(/structured public-review baseline/i)).toHaveLength(0);
    expect(screen.queryByText(/Review evaluation dimensions/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Star rating/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Urgency/i)).not.toBeInTheDocument();
  });

  it('renders an empty state for analysis without reviews', () => {
    const analysis = analyzeReviews([], '2026-05-28T08:00:00.000Z');

    renderApp(<InsightDashboard analysis={analysis} copy={appCopy.en.dashboard} />);

    expect(screen.getByText(/No rating yet/i)).toBeInTheDocument();
    expect(screen.getByText(/No review evidence available yet/i)).toBeInTheDocument();
    expect(screen.queryByText(/NaN avg rating/i)).not.toBeInTheDocument();
  });
});
