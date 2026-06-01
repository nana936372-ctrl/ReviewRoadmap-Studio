import type { Review, ReviewSignal, Sentiment, SignalLabel, Urgency } from '../../domain/types';

const LABEL_RULES: Record<SignalLabel, RegExp[]> = {
  bug: [
    /crash/i,
    /froze/i,
    /frozen/i,
    /lost/i,
    /bug/i,
    /failed/i,
    /sync/i,
    /login/i,
    /崩溃/,
    /闪退/,
    /卡顿/,
    /卡死/,
    /卡住/,
    /很卡/,
    /太卡/,
    /打不开/,
    /登录/,
    /丢/,
    /错误/,
    /失败/,
    /同步/,
    /不能(?:打卡|登录|打开|使用|保存|导出|同步|分享|提交|完成|进入|恢复|显示|踢出)/,
    /无法(?:打卡|登录|打开|使用|保存|导出|同步|分享|提交|完成|进入|恢复|显示|正常|踢出)/
  ],
  feature_request: [
    /please add/i,
    /wish/i,
    /would love/i,
    /need/i,
    /export/i,
    /calendar/i,
    /comments/i,
    /offline/i,
    /希望/,
    /建议/,
    /增加/,
    /添加/,
    /支持/,
    /需要/,
    /功能/
  ],
  onboarding_friction: [
    /confusing/i,
    /did not know/i,
    /too many choices/i,
    /guided/i,
    /setup/i,
    /examples/i,
    /templates feel buried/i,
    /不知道/,
    /找不到/,
    /复杂/,
    /难用/,
    /不会/,
    /引导/,
    /选择/
  ],
  pricing_friction: [
    /paywall/i,
    /subscription/i,
    /expensive/i,
    /trial/i,
    /pricing/i,
    /monthly plan/i,
    /收费/,
    /付费/,
    /会员/,
    /订阅/,
    /太贵/,
    /价格/,
    /购买/,
    /限制/
  ],
  retention_risk: [
    /cancelled/i,
    /stopped using/i,
    /uninstall/i,
    /switch/i,
    /cannot trust/i,
    /nervous using/i,
    /取消/,
    /不用/,
    /卸载/,
    /退款/,
    /失望/,
    /不推荐/,
    /差评/
  ],
  delight: [
    /love/i,
    /saved me/i,
    /excellent/i,
    /best/i,
    /great/i,
    /helped me/i,
    /cleanest/i,
    /useful/i,
    /好用/,
    /喜欢/,
    /进步/,
    /推荐/,
    /很棒/,
    /很好/,
    /优秀/,
    /提升/,
    /有帮助/
  ]
};

export function extractQuote(review: Review): string {
  const body = review.body.length > 140 ? `${review.body.slice(0, 137)}...` : review.body;
  return `${review.title}: ${body}`;
}

function getSentiment(rating: Review['rating']): Sentiment {
  if (rating <= 2) return 'negative';
  if (rating === 3) return 'mixed';
  return 'positive';
}

function hasMatch(text: string, label: SignalLabel): boolean {
  return LABEL_RULES[label].some((pattern) => pattern.test(text));
}

function getLabels(review: Review): SignalLabel[] {
  const text = review.normalizedText;
  let labels = (Object.keys(LABEL_RULES) as SignalLabel[]).filter((label) => hasMatch(text, label));

  if (review.rating <= 2 && labels.includes('bug')) {
    labels = labels.filter((label) => label !== 'feature_request');

    if (!labels.includes('retention_risk')) {
      labels.push('retention_risk');
    }
  }

  if (labels.length === 0 && review.rating <= 2) return ['retention_risk'];
  if (labels.length === 0 && review.rating >= 4) return ['delight'];
  if (labels.length === 0) return ['feature_request'];

  return labels;
}

function getUrgency(review: Review, labels: SignalLabel[]): Urgency {
  if (review.rating <= 2 && (labels.includes('bug') || labels.includes('retention_risk') || labels.includes('pricing_friction'))) {
    return 'high';
  }

  if (review.rating === 3 || labels.includes('feature_request') || labels.includes('onboarding_friction')) {
    return 'medium';
  }

  return 'low';
}

export function classifyReview(review: Review): ReviewSignal {
  const labels = getLabels(review);

  return {
    reviewId: review.id,
    labels,
    sentiment: getSentiment(review.rating),
    urgency: getUrgency(review, labels),
    quote: extractQuote(review)
  };
}

export function classifyReviews(reviews: Review[]): ReviewSignal[] {
  return reviews.map(classifyReview);
}
