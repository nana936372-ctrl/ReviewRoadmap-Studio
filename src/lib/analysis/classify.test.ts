import type { Review } from '../../domain/types';
import { classifyReview, extractQuote } from './classify';

const baseReview: Review = {
  id: 'r1',
  source: 'app-store-sample',
  rating: 2,
  title: 'Lost work',
  body: 'The app froze and I lost a paragraph during export.',
  date: '2026-05-01',
  appVersion: '1.0.0',
  normalizedText: 'Lost work The app froze and I lost a paragraph during export.'
};

describe('extractQuote', () => {
  it('returns a compact quote with the review title', () => {
    expect(extractQuote(baseReview)).toBe('Lost work: The app froze and I lost a paragraph during export.');
  });
});

describe('classifyReview', () => {
  it('labels crash and lost work reviews as urgent bugs', () => {
    expect(classifyReview(baseReview)).toMatchObject({
      reviewId: 'r1',
      labels: ['bug', 'retention_risk'],
      sentiment: 'negative',
      urgency: 'high'
    });
  });

  it('labels paywall complaints as pricing friction', () => {
    const signal = classifyReview({
      ...baseReview,
      id: 'r2',
      rating: 1,
      normalizedText: 'Subscription wall too early The paywall appeared before I could try export.'
    });

    expect(signal.labels).toContain('pricing_friction');
    expect(signal.urgency).toBe('high');
  });

  it('labels praise as delight', () => {
    const signal = classifyReview({
      ...baseReview,
      id: 'r3',
      rating: 5,
      normalizedText: 'Best tone controls I love the clean interface and useful suggestions.'
    });

    expect(signal.labels).toEqual(['delight']);
    expect(signal.sentiment).toBe('positive');
  });

  it('labels Chinese live reviews with product signals', () => {
    const bugSignal = classifyReview({
      ...baseReview,
      id: 'cn1',
      rating: 2,
      title: '不能打卡',
      body: '按钮没有了，更新后不能打卡，客服也没有回复。',
      normalizedText: '不能打卡 按钮没有了，更新后不能打卡，客服也没有回复。'
    });
    const pricingSignal = classifyReview({
      ...baseReview,
      id: 'cn2',
      rating: 1,
      title: '收费高',
      body: '会员价格太贵，孩子刚开始用就遇到付费限制。',
      normalizedText: '收费高 会员价格太贵，孩子刚开始用就遇到付费限制。'
    });
    const delightSignal = classifyReview({
      ...baseReview,
      id: 'cn3',
      rating: 5,
      title: '孩子听力有进步',
      body: '坚持读了一段时间，听力和词汇明显有进步。',
      normalizedText: '孩子听力有进步 坚持读了一段时间，听力和词汇明显有进步。'
    });

    expect(bugSignal.labels).toContain('bug');
    expect(pricingSignal.labels).toContain('pricing_friction');
    expect(delightSignal.labels).toEqual(['delight']);
  });

  it('does not infer a bug from positive Chinese learning praise with broad negation words', () => {
    const signal = classifyReview({
      ...baseReview,
      id: 'cn4',
      rating: 5,
      title: '百词斩帮助很大',
      body: '百词斩的优势在于图文混记，我们无法遗忘母语是学英语最大的障碍，推荐给朋友。',
      normalizedText: '百词斩帮助很大 百词斩的优势在于图文混记，我们无法遗忘母语是学英语最大的障碍，推荐给朋友。'
    });

    expect(signal.labels).not.toContain('bug');
    expect(signal.labels).toEqual(['delight']);
    expect(signal.urgency).toBe('low');
  });
});
