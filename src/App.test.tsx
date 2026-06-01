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
    expect(screen.getByText(/Sample controls/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toHaveValue('ai-writing');
    expect(screen.getByLabelText(/Time window/i)).toHaveValue('may-2026');
    expect(screen.getByRole('button', { name: /Analyze Reviews/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download brief/i })).toBeInTheDocument();
    expect(screen.getByText(/18 reviews analyzed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Top decision/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Review intelligence/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Signal map/i)).toBeInTheDocument();
    expect(screen.getByText(/Decision memo/i)).toBeInTheDocument();
    expect(screen.queryByText(/Priority formula/i)).not.toBeInTheDocument();

    fireEvent.change(appUrlInput, { target: { value: 'https://apps.apple.com/app/example/id1234567890' } });

    expect(appUrlInput).toHaveValue('https://apps.apple.com/app/example/id1234567890');
  });

  it('opens a focused score detail page from a roadmap score', () => {
    renderApp(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Explain priority score: 80/i }));

    expect(screen.getByRole('heading', { name: /Priority score details/i })).toBeInTheDocument();
    expect(screen.getByText(/Priority formula/i)).toBeInTheDocument();
    expect(screen.getByText(/Factor contribution/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommendation dimensions/i)).toBeInTheDocument();
    expect(screen.getByText(/Metric dimensions/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Back to overview/i }));

    expect(screen.getByRole('heading', { name: /Roadmap decisions/i })).toBeInTheDocument();
  });

  it('opens a calculation guide from the hero help button', () => {
    renderApp(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Open calculation guide/i }));

    expect(screen.getByRole('heading', { name: /Calculation guide/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Rating formula/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Confidence/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Priority score/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Sentiment meter/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Brief evaluation/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Unified formula: rating total \/ review count/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Initial confidence: 40% structured public-review baseline \+ 10% star rating \+ 8% quotable text \+ 4% product signal = 62%/i)).toBeInTheDocument();
    expect(screen.getByText(/frequency 22% \+ severity 28%/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Back to overview/i }));

    expect(screen.getByRole('heading', { name: /Roadmap decisions/i })).toBeInTheDocument();
  });

  it('shows the unified formulas in Chinese calculation guide', () => {
    renderApp(<App />);

    fireEvent.click(screen.getByRole('button', { name: /中文/i }));
    fireEvent.click(screen.getByRole('button', { name: /打开计算说明/i }));

    expect(screen.getByRole('heading', { name: /评分统一公式/i })).toBeInTheDocument();
    expect(screen.getAllByText(/统一公式：评分总和 \/ 评论数/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/初始置信度：结构化公开评论基线 40% \+ 星级评分 10% \+ 可引用文本 8% \+ 产品信号匹配 4% = 62%/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/当前：min\(95%, 62% \+ 5 x 10%\) = 95%/i)).toBeInTheDocument();
  });

  it('switches the product interface to Chinese', () => {
    renderApp(<App />);

    fireEvent.click(screen.getByRole('button', { name: /中文/i }));

    expect(screen.getByRole('button', { name: /打开计算说明/i })).toBeInTheDocument();
    expect(screen.getByText(/把杂乱的 App Store 评论转化为洞察聚类/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/首要决策/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /分析 App Store 评论样本/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /评论智能分析/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/信号地图/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /路线图决策/i })).toBeInTheDocument();
    expect(screen.getAllByText(/稳定草稿保存与导出可靠性/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/决策备忘录/i)).toBeInTheDocument();
    expect(screen.getAllByText(/评估维度/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/优先级公式/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/评估方式/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /下载 Brief/i })).toBeInTheDocument();
  });
});
