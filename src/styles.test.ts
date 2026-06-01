import css from './styles.css?raw';

describe('visual typography contract', () => {
  it('uses a bilingual product font stack', () => {
    expect(css).toContain('--font-sans-en');
    expect(css).toContain('--font-sans-zh');
    expect(css).toContain(':lang(zh)');
    expect(css).toContain('PingFang SC');
    expect(css).toContain('Microsoft YaHei UI');
    expect(css).toContain('Noto Sans SC');
  });

  it('keeps tooltip typography light enough for product UI', () => {
    expect(css).toContain('.sentiment-segment::after');
    expect(css).toContain('font-weight: 400');
    expect(css).not.toContain('font-weight: 650');
    expect(css).not.toContain('font-weight: 690');
    expect(css).not.toContain('font-weight: 730');
    expect(css).not.toContain('font-weight: 760');
  });

  it('prevents long product titles from overflowing on narrow screens', () => {
    expect(css).toContain('@media (max-width: 480px)');
    expect(css).toContain('overflow-wrap: anywhere');
  });
});
