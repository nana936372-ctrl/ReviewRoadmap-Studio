import { screen } from '@testing-library/react';
import App from './App';
import { renderApp } from './test/render';

describe('App', () => {
  it('renders the input workflow and generated analysis sections', () => {
    renderApp(<App />);

    expect(screen.getByRole('heading', { name: /ReviewRoadmap Studio/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/App Store URL/i)).toHaveValue('https://apps.apple.com/app/draftly-ai-writing/id0000000000');
    expect(screen.getByRole('button', { name: /Analyze Reviews/i })).toBeInTheDocument();
    expect(screen.getByText(/18 reviews analyzed/i)).toBeInTheDocument();
    expect(screen.getByText(/Roadmap decisions/i)).toBeInTheDocument();
  });
});
