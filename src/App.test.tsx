import { screen } from '@testing-library/react';
import App from './App';
import { renderApp } from './test/render';

describe('App', () => {
  it('renders the product name and value proposition', () => {
    renderApp(<App />);

    expect(screen.getByRole('heading', { name: /ReviewRoadmap Studio/i })).toBeInTheDocument();
    expect(screen.getByText(/evidence-backed roadmap decisions/i)).toBeInTheDocument();
  });
});
