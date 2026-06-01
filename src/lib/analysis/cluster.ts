import type { InsightCluster, Language, Review, ReviewSignal, SignalLabel } from '../../domain/types';
import { confidenceScoreForReviewCount } from './scoring';

const CLUSTER_COPY: Record<Language, Record<SignalLabel, { name: string; description: string; scenario: string }>> = {
  en: {
    bug: {
      name: 'Reliability and core-task failures',
      description: 'Users report core task failures, errors, instability, or outcomes that can damage trust.',
      scenario: 'Users trying to complete an important task with high reliability expectations.'
    },
    feature_request: {
      name: 'Feature and workflow requests',
      description: 'Users ask for clearer capabilities, workflow support, or improvements to an existing use case.',
      scenario: 'Users who already see value and want the product to fit their routine.'
    },
    onboarding_friction: {
      name: 'First-session and navigation confusion',
      description: 'Users struggle to find the right path, understand the next step, or complete early setup.',
      scenario: 'New users evaluating whether the product is worth keeping.'
    },
    pricing_friction: {
      name: 'Pricing and value uncertainty',
      description: 'Users hit paid moments before they understand value, limits, or what is included.',
      scenario: 'Trial users deciding whether the app is worth a subscription.'
    },
    retention_risk: {
      name: 'Trust and repeat-usage risk',
      description: 'Users mention cancellation, loss of trust, or failure to build a habit after the first week.',
      scenario: 'Users who were initially interested but did not reach repeat value.'
    },
    delight: {
      name: 'Validated product value',
      description: 'Users describe concrete moments where the product works well, saves time, or creates progress.',
      scenario: 'Satisfied users who can reveal the value the roadmap should protect.'
    }
  },
  zh: {
    bug: {
      name: '可靠性与核心任务问题',
      description: '用户反馈核心操作失败、异常、卡顿或结果不可信，这些问题会直接损害信任。',
      scenario: '正在完成关键任务、对稳定性要求较高的用户。'
    },
    feature_request: {
      name: '功能与使用场景需求',
      description: '用户希望产品补齐明确能力、支持现有流程，或改善已经在使用的场景。',
      scenario: '已经看到价值、希望产品更好融入日常使用的用户。'
    },
    onboarding_friction: {
      name: '首次使用与路径困惑',
      description: '用户在早期使用时难以找到正确路径、理解下一步或完成初始设置。',
      scenario: '正在判断这个产品是否值得留下的新用户。'
    },
    pricing_friction: {
      name: '价格与价值感不确定性',
      description: '用户在理解产品价值、限制或权益之前就遇到付费节点。',
      scenario: '正在判断订阅是否值得的试用用户。'
    },
    retention_risk: {
      name: '信任与复用风险',
      description: '用户提到取消订阅、失去信任，或第一周后没有形成习惯。',
      scenario: '曾经感兴趣但没有到达复用价值的用户。'
    },
    delight: {
      name: '已验证的产品价值',
      description: '用户描述产品确实有效、节省时间或带来进步的具体时刻。',
      scenario: '已经获得价值、能帮助团队判断应该保护什么的满意用户。'
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
        reviewIds: clusterSignals.map((signal) => signal.reviewId),
        reviewCount: clusterSignals.length,
        averageRating,
        representativeQuotes: clusterSignals.slice(0, 3).map((signal) => signal.quote),
        confidence,
        suspectedUserScenario: copy.scenario
      };
    })
    .sort((a, b) => b.reviewCount - a.reviewCount || a.averageRating - b.averageRating);
}
