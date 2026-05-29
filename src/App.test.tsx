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

  it('switches the product interface to Chinese', () => {
    renderApp(<App />);

    fireEvent.click(screen.getByRole('button', { name: /中文/i }));

    expect(screen.getByText(/把杂乱的 App Store 评论转化为洞察聚类/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /分析 App Store 评论样本/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /评论智能分析/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /路线图决策/i })).toBeInTheDocument();
    expect(screen.getByText(/稳定草稿保存与导出可靠性/i)).toBeInTheDocument();
    expect(screen.getAllByText(/评估维度/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/优先级公式/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/评估方式/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /下载 Brief/i })).toBeInTheDocument();
  });
});
