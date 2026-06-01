import css from './styles.css?raw';

describe('visual typography contract', () => {
  it('uses a bilingual product font stack', () => {
    expect(css).toContain('PingFang SC');
    expect(css).toContain('Microsoft YaHei UI');
    expect(css).toContain('Noto Sans SC');
  });

  it('keeps tooltip typography light enough for product UI', () => {
    expect(css).toContain('.sentiment-segment::after');
    expect(css).toContain('font-weight: 650');
  });

  it('prevents long product titles from overflowing on narrow screens', () => {
    expect(css).toContain('@media (max-width: 480px)');
    expect(css).toContain('overflow-wrap: anywhere');
  });
});
