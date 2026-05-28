import type { Review, ReviewSignal, Sentiment, SignalLabel, Urgency } from '../../domain/types';

const LABEL_RULES: Record<SignalLabel, RegExp[]> = {
  bug: [/crash/i, /froze/i, /frozen/i, /lost/i, /bug/i, /failed/i, /sync/i, /login/i],
  feature_request: [/please add/i, /wish/i, /would love/i, /need/i, /export/i, /calendar/i, /comments/i, /offline/i],
  onboarding_friction: [/confusing/i, /did not know/i, /too many choices/i, /guided/i, /setup/i, /examples/i, /templates feel buried/i],
  pricing_friction: [/paywall/i, /subscription/i, /expensive/i, /trial/i, /pricing/i, /monthly plan/i],
  retention_risk: [/cancelled/i, /stopped using/i, /uninstall/i, /switch/i, /cannot trust/i, /nervous using/i],
  delight: [/love/i, /saved me/i, /excellent/i, /best/i, /great/i, /helped me/i, /cleanest/i, /useful/i]
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
