import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { renderApp } from './test/render';

describe('App', () => {
  it('renders the input workflow and generated analysis sections', async () => {
    const user = userEvent.setup();

    renderApp(<App />);
    const appUrlInput = screen.getByLabelText(/App Store URL/i);

    expect(screen.getByRole('heading', { name: /ReviewRoadmap Studio/i })).toBeInTheDocument();
    expect(appUrlInput).toHaveAttribute('type', 'url');
    expect(appUrlInput).toHaveAttribute('inputmode', 'url');
    expect(appUrlInput).toHaveValue('https://apps.apple.com/app/draftly-ai-writing/id0000000000');
    expect(screen.getByRole('button', { name: /Analyze Reviews/i })).toBeInTheDocument();
    expect(screen.getByText(/18 reviews analyzed/i)).toBeInTheDocument();
    expect(screen.getByText(/Roadmap decisions/i)).toBeInTheDocument();

    await user.clear(appUrlInput);
    await user.type(appUrlInput, 'https://apps.apple.com/app/example/id1234567890');

    expect(appUrlInput).toHaveValue('https://apps.apple.com/app/example/id1234567890');
  });
});
