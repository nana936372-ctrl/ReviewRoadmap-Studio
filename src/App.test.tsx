import { fireEvent, screen } from '@testing-library/react';
import App from './App';
import { renderApp } from './test/render';

describe('App', () => {
  it('renders the input workflow and generated analysis sections', () => {
    renderApp(<App />);
    const appUrlInput = screen.getByLabelText(/App Store URL/i);

    expect(screen.getByRole('heading', { name: /ReviewRoadmap Studio/i })).toBeInTheDocument();
    expect(appUrlInput).toHaveAttribute('type', 'url');
    expect(appUrlInput).toHaveAttribute('inputmode', 'url');
    expect(appUrlInput).toHaveValue('https://apps.apple.com/app/draftly-ai-writing/id0000000000');
    expect(screen.getByLabelText(/^Review sample$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toHaveValue('ai-writing');
    expect(screen.getByLabelText(/Time window/i)).toHaveValue('may-2026');
    expect(screen.getByRole('button', { name: /Analyze Reviews/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download brief/i })).toBeInTheDocument();
    expect(screen.getByText(/18 reviews analyzed/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Review intelligence/i })).toBeInTheDocument();

    fireEvent.change(appUrlInput, { target: { value: 'https://apps.apple.com/app/example/id1234567890' } });

    expect(appUrlInput).toHaveValue('https://apps.apple.com/app/example/id1234567890');
  });
});
