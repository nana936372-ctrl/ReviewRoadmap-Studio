import type { InsightCluster, Language, Review, ReviewSignal, SignalLabel } from '../../domain/types';
import { confidenceScoreForReviewCount } from './scoring';

const CLUSTER_COPY: Record<Language, Record<SignalLabel, { name: string; description: string; scenario: string }>> = {
  en: {
    bug: {
      name: 'Reliability and data-loss issues',
      description: 'Users report crashes, failed exports, sync problems, or lost work that can damage trust.',
      scenario: 'Users trying to finish important writing work under time pressure.'
    },
    feature_request: {
      name: 'Workflow extension requests',
      description: 'Users ask for exports, planning views, reusable settings, or collaboration features.',
      scenario: 'Users who want the app to fit into an existing content workflow.'
    },
    onboarding_friction: {
      name: 'First-session confusion',
      description: 'Users struggle to choose the right mode, template, or next step during early usage.',
      scenario: 'New users evaluating whether the product is worth keeping.'
    },
    pricing_friction: {
      name: 'Pricing and paywall uncertainty',
      description: 'Users hit paid moments before understanding the value, limits, or export capabilities.',
      scenario: 'Trial users deciding whether the app is worth a subscription.'
    },
    retention_risk: {
      name: 'Trust and repeat-usage risk',
      description: 'Users mention cancellation, loss of trust, or failure to build a habit after the first week.',
      scenario: 'Users who were initially interested but did not reach repeat value.'
    },
    delight: {
      name: 'Differentiated writing experience',
      description: 'Users praise tone controls, clean interface, useful suggestions, and saved time.',
      scenario: 'Satisfied users who understand the product value and can reveal what to protect.'
    }
  },
  zh: {
    bug: {
      name: '可靠性与数据丢失问题',
      description: '用户反馈崩溃、导出失败、同步异常或作品丢失，这些问题会直接损害信任。',
      scenario: '正在赶重要写作任务、对可靠性要求很高的用户。'
    },
    feature_request: {
      name: '工作流扩展需求',
      description: '用户希望增加导出、规划视图、可复用设置或协作能力。',
      scenario: '希望产品接入现有内容生产流程的用户。'
    },
    onboarding_friction: {
      name: '首次使用困惑',
      description: '用户在早期使用时难以选择合适模式、模板或下一步操作。',
      scenario: '正在判断这个产品是否值得留下的新用户。'
    },
    pricing_friction: {
      name: '价格与付费墙不确定性',
      description: '用户在理解价值、限制或导出能力之前就遇到付费节点。',
      scenario: '正在判断订阅是否值得的试用用户。'
    },
    retention_risk: {
      name: '信任与复用风险',
      description: '用户提到取消订阅、失去信任，或第一周后没有形成习惯。',
      scenario: '曾经感兴趣但没有到达复用价值的用户。'
    },
    delight: {
      name: '差异化写作体验',
      description: '用户认可语气控制、干净界面、有效建议和节省时间。',
      scenario: '已经理解产品价值、能帮助团队判断该保护什么的满意用户。'
    }
  }
};

function primaryLabel(signal: ReviewSignal): SignalLabel {
  const priority: SignalLabel[] = [
    'bug',
    'retention_risk',
    'pricing_friction',
    'onboarding_friction',
    'feature_request',
    'delight'
  ];

  return priority.find((label) => signal.labels.includes(label)) ?? signal.labels[0];
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function buildInsightClusters(
  reviews: Review[],
  signals: ReviewSignal[],
  language: Language = 'en'
): InsightCluster[] {
  const reviewsById = new Map(reviews.map((review) => [review.id, review]));
  const grouped = new Map<SignalLabel, ReviewSignal[]>();

  for (const signal of signals) {
    const label = primaryLabel(signal);
    grouped.set(label, [...(grouped.get(label) ?? []), signal]);
  }

  return Array.from(grouped.entries())
    .map(([label, clusterSignals]) => {
      const clusterReviews = clusterSignals
        .map((signal) => reviewsById.get(signal.reviewId))
        .filter((review): review is Review => Boolean(review));
      const ratingTotal = clusterReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = clusterReviews.length > 0 ? round(ratingTotal / clusterReviews.length) : 0;
      const confidence = confidenceScoreForReviewCount(clusterSignals.length);
      const copy = CLUSTER_COPY[language][label];

      return {
        id: label,
        name: copy.name,
        description: copy.description,
        labels: Array.from(new Set(clusterSignals.flatMap((signal) => signal.labels))),
        reviewCount: clusterSignals.length,
        averageRating,
        representativeQuotes: clusterSignals.slice(0, 3).map((signal) => signal.quote),
        confidence,
        suspectedUserScenario: copy.scenario
      };
    })
    .sort((a, b) => b.reviewCount - a.reviewCount || a.averageRating - b.averageRating);
}
